// Dimensions and Margins
margin = { top: 50, right: 200, bottom: 50, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Append SVG to the container
const svg = d3
  .select("#container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load Data
d3.csv("Boston_marathon.csv")
  .then((data) => {
    // Parse Data
    // The CSV has columns: "","X",time,value
    // We are interested in 'time' (Year) and 'value' (Winning Time in Minutes)
    const parsedData = data
      .map((d) => ({
        time: +d.time,
        value: +d.value,
      }))
      .filter((d) => !isNaN(d.time) && !isNaN(d.value));

    // Scales
    const x = d3
      .scaleLinear()
      .domain(d3.extent(parsedData, (d) => d.time))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(parsedData, (d) => d.value) - 5,
        d3.max(parsedData, (d) => d.value) + 5,
      ])
      .range([height, 0]);

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d"))); // Format as integer (Year)

    svg.append("g").call(d3.axisLeft(y));

    // Axis Labels
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 40)
      .text("Year");

    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", 0)
      .text("Winning Time (minutes)");

    // Plot Original Data (Scatter Plot)
    svg
      .selectAll("circle")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(d.value))
      .attr("r", 3)
      .attr("fill", "#4682b4") // changed original data color to steelblue
      .attr("opacity", 0.7);

    // --- Smoothing Functions ---

    /**
     * 1. Centered Moving Average
     * Calculates the average of the window [i - k/2, i + k/2].
     * For k=5, it averages indices i-2, i-1, i, i+1, i+2.
     */
    function centeredMovingAverage(data, k) {
      const half = Math.floor(k / 2);
      return data
        .map((d, i) => {
          if (i < half || i >= data.length - half) return null;
          const subset = data.slice(i - half, i + half + 1);
          const mean = d3.mean(subset, (d) => d.value);
          return { time: d.time, value: mean };
        })
        .filter((d) => d !== null);
    }

    /**
     * 2. One-sided Moving Average
     * Calculates the average of the window [i - k + 1, i].
     * For k=5, it averages indices i-4, i-3, i-2, i-1, i.
     * This represents the average of the "last k" points.
     */
    function oneSidedMovingAverage(data, k) {
      return data
        .map((d, i) => {
          if (i < k - 1) return null;
          const subset = data.slice(i - k + 1, i + 1);
          const mean = d3.mean(subset, (d) => d.value);
          return { time: d.time, value: mean };
        })
        .filter((d) => d !== null);
    }

    /**
     * 3. Gaussian Kernel Smoothing
     * Uses a Gaussian weight function to calculate a weighted average.
     * Points closer to the target time have higher weights.
     * Sigma controls the bandwidth (smoothness).
     */

    function gaussianKernelSmoothing(data, sigma) {
      // Le rayon d'action de la gaussienne (environ 3 écarts-types)
      const range = Math.ceil(3 * sigma);

      return data
        .map((d, i) => {
          // MODIFICATION ICI :
          // Si on est au tout début (i < range) ou à la toute fin,
          // on ne calcule pas le point pour éviter les effets de bord, comme dans le Code 2.
          if (i < range || i >= data.length - range) {
            return null;
          }

          let weightSum = 0;
          let valueSum = 0;

          const start = i - range;
          const end = i + range + 1;

          for (let j = start; j < end; j++) {
            const dist = i - j;

            // J'ai aussi corrigé la formule mathématique pour qu'elle soit standard (comme Code 2)
            // Suppression du "-0.5" en trop qui était dans votre Code 1
            const weight = Math.exp(-(dist * dist) / (2 * sigma * sigma));

            weightSum += weight;
            valueSum += weight * data[j].value;
          }
          return { time: d.time, value: valueSum / weightSum };
        })
        .filter((d) => d !== null); // On retire les points vides du début et de la fin
    }

    /**
     * 4. Double Exponential Smoothing (Holt's Linear Trend)
     * Captures both level and trend.
     * S_t = alpha * y_t + (1 - alpha) * (S_{t-1} + b_{t-1})
     * b_t = beta * (S_t - S_{t-1}) + (1 - beta) * b_{t-1}
     */
    function doubleExponentialSmoothing(data, alpha = 0.4, beta = 0.3) {
      if (data.length < 2) return data;
      const result = [];

      // Initialization
      let s = data[0].value;
      let b = data[1].value - data[0].value; // Initial trend

      result.push({ time: data[0].time, value: s });

      for (let i = 1; i < data.length; i++) {
        const val = data[i].value;
        const oldS = s;

        // Level update
        s = alpha * val + (1 - alpha) * (s + b);

        // Trend update
        b = beta * (s - oldS) + (1 - beta) * b;

        result.push({ time: data[i].time, value: s });
      }
      return result;
    }

    /**
     * 5. LOWESS (Locally Weighted Scatterplot Smoothing)
     * Uses the science.js library.
     * Fits local polynomials to subsets of data.
     */
    function calculateLowess(data, bandwidth) {
      if (
        typeof science === "undefined" ||
        !science.stats ||
        !science.stats.loess
      ) {
        console.warn("science.js library not found. Skipping LOWESS.");
        return [];
      }
      try {
        // Construire x et y
        const xValues = data.map((d) => d.time);
        const yValues = data.map((d) => d.value);

        // Créer le loess et définir la bande passante si disponible
        const loessFactory = science.stats.loess();
        if (typeof loessFactory.bandwidth === "function")
          loessFactory.bandwidth(bandwidth);

        const smoothed = loessFactory(xValues, yValues);
        if (!smoothed || smoothed.length !== xValues.length) {
          console.warn("LOESS returned unexpected result:", smoothed);
          return [];
        }

        console.info("LOESS computed:", {
          bandwidth,
          n: smoothed.length,
          first: smoothed.slice(0, 3),
        });
        return xValues.map((t, i) => ({ time: t, value: smoothed[i] }));
      } catch (e) {
        console.error("Erreur LOESS:", e);
        return [];
      }
    }

    // --- Calculate Series ---
    const k = 5; // Window size for moving averages

    const cmaData = centeredMovingAverage(parsedData, k);
    const osmaData = oneSidedMovingAverage(parsedData, k);
    const gaussianData = gaussianKernelSmoothing(parsedData, 0.66); // sigma=2 (approx similar smoothing to k=5)
    const desData = doubleExponentialSmoothing(parsedData, 0.4, 0.3); // alpha=0.4, beta=0.3
    const lowessData = calculateLowess(parsedData, 0.3); // bandwidth 0.3

    // --- Draw Lines ---
    const line = d3
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.value));

    const series = [
      { name: "Centered Moving Avg (k=5)", data: cmaData, color: "#1f78b4" },
      { name: "One-sided Moving Avg (k=5)", data: osmaData, color: "#33a02c" },
      {
        name: "Gaussian Kernel (sigma=0.66)",
        data: gaussianData,
        color: "#e31a1c",
      }, // Rouge
      { name: "Double Exp. Smoothing", data: desData, color: "#6a3d9a" },
      { name: "LOWESS (bw=0.3)", data: lowessData, color: "#ff7f00" },
    ];

    series.forEach((s) => {
      if (s.data.length > 0) {
        svg
          .append("path")
          .datum(s.data)
          .attr("fill", "none")
          .attr("stroke", s.color)
          .attr("stroke-width", 2)
          .attr("d", line)
          .attr("class", "line-series"); // Class for potential interactivity
      }
    });

    // --- Legend ---
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width + 20}, 0)`);

    series.forEach((s, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

      g.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("y1", 5)
        .attr("y2", 5)
        .attr("stroke", s.color)
        .attr("stroke-width", 2);

      g.append("text")
        .attr("x", 25)
        .attr("y", 9)
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .text(s.name);
    });

    // Add original data to legend
    const gOrig = legend
      .append("g")
      .attr("transform", `translate(0, ${series.length * 25})`);
    gOrig
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 5)
      .attr("r", 3)
      .attr("fill", "#4682b4"); // match legend marker to new original color
    gOrig
      .append("text")
      .attr("x", 25)
      .attr("y", 9)
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .text("Original Data");
  })
  .catch((error) => {
    console.error("Error loading data:", error);
  });