d3.csv("Boston_marathon.csv", d3.autoType)
  .then(data => {

    // Sort by year
    data = data.sort((a, b) => d3.ascending(a.time, b.time));

    const xVals = data.map(d => d.time);
    const yVals = data.map(d => d.value);
    const n = xVals.length;

    
    const loess = science.stats.loess();
    loess.bandwidth((n - 1) / 3 /n); 
   

    const loessY = loess(xVals, yVals);

   
    function centeredMA(arr, w = 5) {
      const out = new Array(arr.length).fill(NaN);
      const h = Math.floor(w / 2);
      for (let i = 0; i < arr.length; i++) {
        if (i - h < 0 || i + h >= arr.length) continue;
        let sum = 0;
        for (let j = i - h; j <= i + h; j++) sum += arr[j];
        out[i] = sum / w;
      }
      return out;
    }

    const cmaY = centeredMA(yVals, 5);

   
    function oneSidedMA(arr, w = 5) {
      const out = new Array(arr.length).fill(NaN);
      let sum = 0;
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        if (i >= w) sum -= arr[i - w];
        if (i >= w - 1) out[i] = sum / w;
      }
      return out;
    }

    const osmaY = oneSidedMA(yVals, 5);

    
    function gaussian(arr, sigma = 2) {
      const radius = Math.ceil(sigma * 3);
      const kernel = [];
      for (let i = -radius; i <= radius; i++) {
        kernel.push(Math.exp(-(i * i) / (2 * sigma * sigma)));
      }
      const sumKernel = kernel.reduce((a, b) => a + b, 0);
      const out = new Array(arr.length).fill(NaN);

      for (let i = 0; i < arr.length; i++) {
        let s = 0, wsum = 0;
        for (let k = -radius; k <= radius; k++) {
          const j = i + k;
          if (j >= 0 && j < arr.length) {
            const w = kernel[k + radius];
            s += arr[j] * w;
            wsum += w;
          }
        }
        out[i] = s / wsum;
      }
      return out;
    }

    const gaussY = gaussian(yVals, 2);

  
    function holt(values, alpha = 0.4, beta = 0.3) {
      const out = [];
      let level = values[0];
      let trend = values[1] - values[0];

      out[0] = level;

      for (let t = 1; t < values.length; t++) {
        const prevLevel = level;

        level = alpha * values[t] + (1 - alpha) * (level + trend);
        trend = beta * (level - prevLevel) + (1 - beta) * trend;

        out[t] = level + trend;
      }
      return out;
    }

    const holtY = holt(yVals, 0.3, 0.4);

   

    const width = 1100, height = 550;
    const margin = { top: 40, right: 200, bottom: 40, left: 70 };

    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("font-family", "Arial");

    const plot = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain(d3.extent(xVals))
      .range([0, innerW]);

    const y = d3.scaleLinear()
      .domain([d3.min(yVals) - 5, d3.max(yVals) + 5])
      .range([innerH, 0]);

    plot.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    plot.append("g").call(d3.axisLeft(y));

    // Raw points
    plot.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d.value))
      .attr("r", 3)
      .attr("fill", "black")
      .style("opacity", 0.5);

    const line = d3.line()
      .defined(d => !isNaN(d.y))
      .x(d => x(d.x))
      .y(d => y(d.y));

    const legendData = [];

    function drawLine(name, arr, color, w = 2) {
      const series = xVals.map((xx, i) => ({ x: xx, y: arr[i] }));
      plot.append("path")
        .datum(series)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", w)
        .attr("d", line);

      legendData.push({ name, color });
    }

    drawLine("LOESS", loessY, "#1f77b4", 3);
    drawLine("Centered MA", cmaY, "#ff7f0e");
    drawLine("One-sided MA", osmaY, "#2ca02c");
    drawLine("Gaussian", gaussY, "#9467bd");
    drawLine("Double Exp (Holt)", holtY, "#d62728");

    // legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right + 20},${margin.top})`);

    legendData.forEach((d, i) => {
      const g = legend.append("g")
        .attr("transform", `translate(0, ${i * 22})`);

      g.append("rect")
        .attr("width", 20)
        .attr("height", 4)
        .attr("fill", d.color);

      g.append("text")
        .attr("x", 28)
        .attr("y", 4)
        .text(d.name)
        .style("font-size", "13px");
    });
  });