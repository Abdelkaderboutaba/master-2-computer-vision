const container = d3.select("#container");
const containerWidth = 800;
const containerHeight = 500;
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = containerWidth - margin.left - margin.right;
const height = containerHeight - margin.top - margin.bottom;

const svg = container
  .append("svg")
  .attr("width", 1000)
  .attr("height", 1000)
  .style("background-color","grey")

const chart = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));

const xScale = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([0, width])
  .padding(0.2);

const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

let bars = chart
  .selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => xScale(i))
  .attr("y", d => yScale(d))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d))
  .attr("fill", "blue")
  

let labels = chart
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(d => d)
  .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(d) - 5)
  .attr("text-anchor", "middle")
  .attr("font-size", "14px")
  .attr("fill", "black");

chart
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(xScale).tickFormat(() => ""));
chart.append("g").call(d3.axisLeft(yScale));

// Sort Button
container
  .append("button")
  .text("start")
  .style("margin", "20px")
  .on("click", permutationSort);

async function permutationSort() {
  let swapped = true;

  while (swapped) {
    swapped = false;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i] > data[i + 1]) {
        await animateSwap(i, i + 1);

        [data[i], data[i + 1]] = [data[i + 1], data[i]];
        swapped = true;

        // update
        bars
          .data(data)
          .transition()
          .duration(3000)
          .attr("y", d => yScale(d))
          .attr("height", d => height - yScale(d));

        labels
          .data(data)
          .text(d => d)
          .transition()
          .duration(3000)
          .attr("y", d => yScale(d) - 5);
      }
    }
  }
}

function animateSwap(i, j) {
  return new Promise(resolve => {
    const barI = bars.filter((d, k) => k === i);
    const barJ = bars.filter((d, k) => k === j);
    const labelI = labels.filter((d, k) => k === i);
    const labelJ = labels.filter((d, k) => k === j);

    const xI = +barI.attr("x");
    const xJ = +barJ.attr("x");

    barI.transition().duration(800).attr("x", xJ);
    barJ.transition().duration(800).attr("x", xI);
    labelI.transition().duration(800).attr("x", xJ + xScale.bandwidth() / 2);
    labelJ.transition().duration(800).attr("x", xI + xScale.bandwidth() / 2);

    setTimeout(() => {
      const barNodes = bars.nodes();
      const labelNodes = labels.nodes();
      [barNodes[i], barNodes[j]] = [barNodes[j], barNodes[i]];
      [labelNodes[i], labelNodes[j]] = [labelNodes[j], labelNodes[i]];
      bars = d3.selectAll(barNodes);
      labels = d3.selectAll(labelNodes);
      resolve();
    }, 800);
  });
}
