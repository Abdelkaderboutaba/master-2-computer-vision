// Bubble chart for Abalone dataset
const main = async (container) => {
  // Charger les données
  const data = await d3.csv("abalone.csv", d3.autoType);
  
  // Slicing: prendre seulement les 100 premières lignes
  const slicedData = data.slice(0, 100);

  // Dimensions et marges
  const margin = { top: 50, right: 180, bottom: 60, left: 70 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // Créer le SVG
  const svg = d3.select(container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Échelles
  const xScale = d3.scaleLinear()
    .domain(d3.extent(slicedData, d => d.Length))
    .range([0, width])
    .nice();

  const yScale = d3.scaleLinear()
    .domain(d3.extent(slicedData, d => d.Height))
    .range([height, 0])
    .nice();

  const sizeScale = d3.scaleSqrt()
    .domain(d3.extent(slicedData, d => d.Rings))
    .range([3, 20]); // Taille des bulles

  const colorScale = d3.scaleOrdinal()
    .domain(["M", "F", "I"])
    .range(["#2ca02c", "#ff7f0e", "#1f77b4"]); // Vert, Orange, Bleu

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Length");

  svg.append("g")
    .call(d3.axisLeft(yScale))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -45)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Height");

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background", "rgba(255,255,255,0.9)")
    .style("padding", "8px")
    .style("border-radius", "5px")
    .style("border", "1px solid #ccc")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("display", "none");

  // Dessiner les bulles
  svg.selectAll(".bubble")
    .data(slicedData)
    .enter()
    .append("circle")
    .attr("class", "bubble")
    .attr("cx", d => xScale(d.Length))
    .attr("cy", d => yScale(d.Height))
    .attr("r", d => sizeScale(d.Rings))
    .style("fill", d => colorScale(d.Sex))
    .style("opacity", 0.7)
    .attr("stroke", "black")
    .on("mouseover", function (event, d) {
      d3.select(this).style("stroke-width", 2);
      tooltip
        .style("display", "block")
        .html(`
          <strong>Sex:</strong> ${d.Sex}<br>
          <strong>Length:</strong> ${d.Length}<br>
          <strong>Height:</strong> ${d.Height}<br>
          <strong>Rings (age):</strong> ${d.Rings}
        `);
    })
    .on("mousemove", function (event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("stroke-width", 1);
      tooltip.style("display", "none");
    });

  // Titre
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Abalone Dataset - Bubble Chart (100 premiers)");

  // ========== LÉGENDE DES SEXES (rectangles) ==========
  const legendSex = svg.append("g")
    .attr("class", "legend-sex")
    .attr("transform", `translate(${width + 20}, 0)`);

  legendSex.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Sexe");

  const sexData = [
    { sex: "M", label: "Male", color: "#2ca02c" },
    { sex: "F", label: "Female", color: "#ff7f0e" },
    { sex: "I", label: "Indéterminé", color: "#1f77b4" }
  ];

  const sexLegend = legendSex.selectAll(".sex-legend")
    .data(sexData)
    .enter()
    .append("g")
    .attr("class", "sex-legend")
    .attr("transform", (d, i) => `translate(0, ${i * 25 + 20})`);

  sexLegend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", d => d.color);

  sexLegend.append("text")
    .attr("x", 25)
    .attr("y", 9)
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .text(d => d.label);

  // ========== LÉGENDE DES TAILLES (cercles) ==========
  const legendSize = svg.append("g")
    .attr("class", "legend-size")
    .attr("transform", `translate(${width + 20}, 120)`);

  legendSize.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Âge (Rings)");

  const sizeData = [
    { rings: 4, label: "4 anneaux" },
    { rings: 10, label: "10 anneaux" },
    { rings: 21, label: "21 anneaux" }
  ];

  const sizeLegend = legendSize.selectAll(".size-legend")
    .data(sizeData)
    .enter()
    .append("g")
    .attr("class", "size-legend")
    .attr("transform", (d, i) => `translate(20, ${i * 40 + 30})`);

  sizeLegend.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", d => sizeScale(d.rings))
    .style("fill", "#999")
    .style("opacity", 0.7)
    .attr("stroke", "black");

  sizeLegend.append("text")
    .attr("x", 25)
    .attr("y", 0)
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .text(d => d.label);
};

// Exécuter le graphique
const container = document.getElementById("container");
main(container);