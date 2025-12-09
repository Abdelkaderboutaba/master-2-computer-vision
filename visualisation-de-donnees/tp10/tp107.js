// Configuration
const margin = { top: 40, right: 40, bottom: 60, left: 120 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Color scale for species
const colorScale = d3
  .scaleOrdinal()
  .domain(["Setosa", "Versicolor", "Virginica"])
  .range(["#ff00ccff", "#0aff33ff", "#b5fc02ff"]);

let data = [];

// Statistical functions
function mean(arr) {
  return d3.mean(arr);
}

function standardDeviation(arr) {
  const avg = mean(arr);
  const squareDiffs = arr.map((value) => Math.pow(value - avg, 2));
  const avgSquareDiff = mean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

// Calculate statistics by species with confidence intervals
function calculateStatistics(data, variable) {
  const grouped = d3.group(data, (d) => d.species);
  const stats = [];

  grouped.forEach((values, species) => {
    const measurements = values.map((d) => +d[variable]);
    const avg = mean(measurements);
    const sd = standardDeviation(measurements);
    const n = measurements.length;
    const df = n - 1; // degrees of freedom
    const se = sd / Math.sqrt(n); // standard error

    // Calculate t-values for different confidence levels
    const t80 = jStat.studentt.inv(0.9, df); // 80% CI (two-tailed: 1 - 0.20/2 = 0.90)
    const t95 = jStat.studentt.inv(0.975, df); // 95% CI (two-tailed: 1 - 0.05/2 = 0.975)
    const t99 = jStat.studentt.inv(0.995, df); // 99% CI (two-tailed: 1 - 0.01/2 = 0.995)

    stats.push({
      species: species,
      mean: avg,
      sd: sd,
      se: se,
      count: n,
      // Confidence intervals
      ci80_lower: avg - t80 * se,
      ci80_upper: avg + t80 * se,
      ci95_lower: avg - t95 * se,
      ci95_upper: avg + t95 * se,
      ci99_lower: avg - t99 * se,
      ci99_upper: avg + t99 * se,
    });
  });

  return stats;
}

// Draw visualization
function drawVisualization(variable) {
  // Clear previous visualization
  d3.select("#visualization").selectAll("*").remove();

  const svg = d3
    .select("#visualization")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Calculate statistics
  const stats = calculateStatistics(data, variable);

  // Create scales
  const xExtent = d3.extent(stats.flatMap((d) => [d.ci99_lower, d.ci99_upper]));
  const xPadding = (xExtent[1] - xExtent[0]) * 0.05;

  const xScale = d3
    .scaleLinear()
    .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
    .range([0, width]);

  const yScale = d3
    .scaleBand()
    .domain(stats.map((d) => d.species))
    .range([0, height])
    .padding(0.3);

  // Add grid
  svg
    .append("g")
    .attr("class", "grid")
    .call(d3.axisBottom(xScale).tickSize(height).tickFormat(""))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .attr("stroke-opacity", 0.1)
        .attr("stroke-dasharray", "2,2")
    );

  // Add axes
  const xAxis = svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  const yAxis = svg.append("g").attr("class", "axis").call(d3.axisLeft(yScale));

  // Add axis labels
  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .attr("text-anchor", "middle")
    .text(getVariableLabel(variable));

  // Add tooltip
  const tooltip = d3.select(".tooltip");

  // Draw confidence interval bars
  const ciGroup = svg
    .selectAll(".ci-group")
    .data(stats)
    .enter()
    .append("g")
    .attr("class", "ci-group");

  const yCenter = (d) => yScale(d.species) + yScale.bandwidth() / 2;

  // 99% CI (thickest, lightest)
  ciGroup
    .append("line")
    .attr("class", "ci-99")
    .attr("x1", (d) => xScale(d.ci99_lower))
    .attr("x2", (d) => xScale(d.ci99_upper))
    .attr("y1", yCenter)
    .attr("y2", yCenter)
    .attr("stroke", (d) => colorScale(d.species))
    .attr("stroke-width", 8)
    .attr("stroke-opacity", 0.2);

  // 95% CI (medium)
  ciGroup
    .append("line")
    .attr("class", "ci-95")
    .attr("x1", (d) => xScale(d.ci95_lower))
    .attr("x2", (d) => xScale(d.ci95_upper))
    .attr("y1", yCenter)
    .attr("y2", yCenter)
    .attr("stroke", (d) => colorScale(d.species))
    .attr("stroke-width", 5)
    .attr("stroke-opacity", 0.4);

  // 80% CI (thinnest, darkest)
  ciGroup
    .append("line")
    .attr("class", "ci-80")
    .attr("x1", (d) => xScale(d.ci80_lower))
    .attr("x2", (d) => xScale(d.ci80_upper))
    .attr("y1", yCenter)
    .attr("y2", yCenter)
    .attr("stroke", (d) => colorScale(d.species))
    .attr("stroke-width", 3)
    .attr("stroke-opacity", 0.7);

  // Draw mean dots
  ciGroup
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.mean))
    .attr("cy", yCenter)
    .attr("r", 5)
    .attr("fill", (d) => colorScale(d.species))
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", 7);
      tooltip
        .html(
          `<strong>${d.species}</strong><br>` +
            `Mean: ${d.mean.toFixed(3)}<br>` +
            `SE: ${d.se.toFixed(3)}<br>` +
            `80% CI: [${d.ci80_lower.toFixed(3)}, ${d.ci80_upper.toFixed(
              3
            )}]<br>` +
            `95% CI: [${d.ci95_lower.toFixed(3)}, ${d.ci95_upper.toFixed(
              3
            )}]<br>` +
            `99% CI: [${d.ci99_lower.toFixed(3)}, ${d.ci99_upper.toFixed(
              3
            )}]<br>` +
            `n = ${d.count}`
        )
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 15 + "px")
        .classed("visible", true);
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 5);
      tooltip.classed("visible", false);
    });

  // Update legend
  updateLegend(stats);
}

// Update legend
function updateLegend(stats) {
  const legendContainer = d3.select("#legend");
  legendContainer.selectAll("*").remove();

  // Add species legend
  stats.forEach((d) => {
    const item = legendContainer.append("div").attr("class", "legend-item");

    item
      .append("div")
      .attr("class", "legend-circle")
      .style("background-color", colorScale(d.species));

    item.append("span").attr("class", "legend-text").text(d.species);
  });

  // Add confidence interval legend
  legendContainer
    .append("div")
    .style("margin-top", "15px")
    .style("border-top", "1px solid #dee2e6")
    .style("padding-top", "15px");

  const ciLevels = [
    { level: "80% CI", opacity: 0.7, width: 3 },
    { level: "95% CI", opacity: 0.4, width: 5 },
    { level: "99% CI", opacity: 0.2, width: 8 },
  ];

  ciLevels.forEach((ci) => {
    const item = legendContainer.append("div").attr("class", "legend-item");

    item
      .append("div")
      .style("width", "30px")
      .style("height", `${ci.width}px`)
      .style("background-color", "#6c757d")
      .style("opacity", ci.opacity)
      .style("border-radius", "2px");

    item.append("span").attr("class", "legend-text").text(ci.level);
  });
}

// Get variable label
function getVariableLabel(variable) {
  const labels = {
    sepalLength: "Sepal Length (cm)",
    sepalWidth: "Sepal Width (cm)",
    petalLength: "Petal Length (cm)",
    petalWidth: "Petal Width (cm)",
  };
  return labels[variable] || variable;
}

// Load data and initialize
d3.csv("iris.csv")
  .then((rawData) => {
    data = rawData.map((d) => ({
      sepalLength: +d.sepalLength,
      sepalWidth: +d.sepalWidth,
      petalLength: +d.petalLength,
      petalWidth: +d.petalWidth,
      species: d.species,
    }));

    // Initial draw
    drawVisualization("petalLength");

    // Add event listener for variable selection
    d3.select("#variable-select").on("change", function () {
      const selectedVariable = this.value;
      drawVisualization(selectedVariable);
    });
  })
  .catch((error) => {
    console.error("Error loading data:", error);
    d3.select(".info-box")
      .style("background", "#fee")
      .style("border-left-color", "#c33")
      .style("color", "#c33")
      .html("<strong>Error:</strong> Failed to load iris.csv dataset.");
  });
