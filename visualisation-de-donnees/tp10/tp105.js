// TP12.js

// Dimensions
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// SVG
const svg = d3
  .select("#visualization")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Load Data
d3.csv("Boston_marathon.csv")
  .then((data) => {
    // Parse Data
    // Using time (x) vs value (y)
    const parsedData = data
      .map((d) => ({
        x: +d.time,
        y: +d.value,
      }))
      .filter((d) => !isNaN(d.x) && !isNaN(d.y));

    // Scales
    const x = d3
      .scaleLinear()
      .domain(d3.extent(parsedData, (d) => d.x))
      .range([0, width]);

    const y = d3.scaleLinear().domain([125, 175]).range([height, 0]);

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(-height).tickFormat(""));

    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g").call(d3.axisLeft(y));

    // Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .text("Year");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .text("Winning Time (minutes)");

    // --- Linear Regression (OLS) ---
    const n = parsedData.length;
    const xBar = d3.mean(parsedData, (d) => d.x);
    const yBar = d3.mean(parsedData, (d) => d.y);

    // Calculate SSxx and SSxy
    let SSxx = 0;
    let SSxy = 0;
    parsedData.forEach((d) => {
      SSxx += (d.x - xBar) ** 2;
      SSxy += (d.x - xBar) * (d.y - yBar);
    });

    const beta1 = SSxy / SSxx;
    const beta0 = yBar - beta1 * xBar;

    // --- Confidence Band ---
    // 1. Calculate Sum of Squared Errors (SSE)
    let SSE = 0;
    parsedData.forEach((d) => {
      const yHat = beta0 + beta1 * d.x;
      SSE += (d.y - yHat) ** 2;
    });

    // 2. Standard Error of Estimate (sigma residuals)
    // df = n - 2 (2 parameters estimated: beta0, beta1)
    const df = n - 2;
    const se = Math.sqrt(SSE / df);

    // --- Confidence Bands (80%, 95%, 99%) ---
    const confidenceLevels = [0.99, 0.95, 0.8]; // Draw widest first (99%) to narrowest (80%)
    const bandColors = {
      0.99: "#cf58aeff", // Lightest Purple/Pink
      0.95: "#f90bf1ff", // Medium Purple
      0.8: "#910cc5ff", // Darkest Purple
    };

    // Generate points for x-axis
    const xMin = d3.min(parsedData, (d) => d.x);
    const xMax = d3.max(parsedData, (d) => d.x);
    const numPoints = 100;
    const step = (xMax - xMin) / (numPoints - 1);

    // Calculate bands
    const bands = confidenceLevels.map((level) => {
      const alpha = 1 - level;
      let tCrit = 1.96;
      if (typeof jStat !== "undefined") {
        tCrit = jStat.studentt.inv(1 - alpha / 2, df);
      }

      const bandData = [];
      for (let i = 0; i < numPoints; i++) {
        const xi = xMin + i * step;
        const yi = beta0 + beta1 * xi;

        // Confidence Interval Width at xi
        const width = tCrit * se * Math.sqrt(1 / n + (xi - xBar) ** 2 / SSxx);

        bandData.push({
          x: xi,
          y: yi, // Regression line value
          ciLower: yi - width,
          ciUpper: yi + width,
        });
      }
      return { level, data: bandData };
    });

    // Use the data from the first band for the regression line (y values are the same)
    const regressionData = bands[0].data;

    // --- Drawing ---

    // 1. Confidence Bands (with clipping to chart boundaries)
    const area = d3
      .area()
      .x((d) => x(d.x))
      .y0((d) => Math.max(0, Math.min(height, y(d.ciLower))))
      .y1((d) => Math.max(0, Math.min(height, y(d.ciUpper))));

    bands.forEach((band) => {
      svg
        .append("path")
        .datum(band.data)
        .attr("fill", bandColors[band.level])
        .attr("stroke", "none")
        .attr("d", area)
        .attr("opacity", 0.8);
    });

    // Legend for bands
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 120}, 20)`);

    confidenceLevels
      .slice()
      .reverse()
      .forEach((level, i) => {
        const g = legend
          .append("g")
          .attr("transform", `translate(0, ${i * 20})`);

        g.append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", bandColors[level])
          .attr("opacity", 0.8);

        g.append("text")
          .attr("x", 20)
          .attr("y", 12)
          .style("font-family", "sans-serif")
          .style("font-size", "12px")
          .text(`${level * 100}% CI`);
      });

    // 2. Scatter Plot (only plot points within Y range)
    svg
      .selectAll("circle")
      .data(parsedData.filter((d) => d.y >= 125 && d.y <= 175))
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 3)
      .attr("fill", "#204971ff")
      .attr("opacity", 0.6);

    // 3. Regression Line
    const line = d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y));

    svg
      .append("path")
      .datum(regressionData)
      .attr("fill", "none")
      .attr("stroke", "#ff0741ff")
      .attr("stroke-width", 3)
      .attr("d", line);

    // Add statistics to stats box
    const statsHTML = `
        <strong>Regression Equation:</strong> ŷ = ${beta0.toFixed(
          4
        )} + ${beta1.toFixed(4)}x<br>
        <strong>Standard Error (s):</strong> ${se.toFixed(4)}<br>
        <strong>Sample Size (n):</strong> ${n}<br>
        <strong>Degrees of Freedom:</strong> ${df}<br>
        <strong>Confidence Bands:</strong> 80%, 95%, 99%<br>
        <strong>Interpretation:</strong> On average, winning time decreases by ${Math.abs(
          beta1
        ).toFixed(4)} minutes per year.
    `;
    document.getElementById("stats").innerHTML = statsHTML;
  })
  .catch((error) => {
    console.error("Error loading data:", error);
  });
