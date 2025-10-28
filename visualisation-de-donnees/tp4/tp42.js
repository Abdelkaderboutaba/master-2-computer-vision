const width = 600;
const height = 400;
const margin = {top: 20, right: 20, bottom: 40, left: 50};

const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("titanic-data.csv").then(data => {

  // 🔹 Convertir les âges en nombres
  const ages = data
    .map(d => +d.Age)
    .filter(age => !isNaN(age)); // retirer les NaN

  // 🔹 Créer un histogramme avec D3
  const histogram = d3.histogram()
    .value(d => d)          // quelle valeur on analyse (ici l'âge)
    .domain([0, d3.max(ages)]) // domaine de l'axe X
    .thresholds(10);        // nombre d’intervalles (tu peux ajuster)

  const bins = histogram(ages);

  // 🔹 Échelles
  const xscale = d3.scaleLinear()
    .domain([0, d3.max(ages)])
    .range([0, width]);

  const yscale = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)]) // nombre de personnes par groupe
    .range([height, 0]);

  // 🔹 Dessiner les barres
  svg.selectAll("rect")
    .data(bins)
    .join("rect")
    .attr("x", d => xscale(d.x0))
    .attr("y", d => yscale(d.length))
    .attr("width", d => xscale(d.x1) - xscale(d.x0) - 1)
    .attr("height", d => height - yscale(d.length))
    .attr("fill", "steelblue");

  // 🔹 Axe X (âges)
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xscale));

  // 🔹 Axe Y (nombre de personnes)
  svg.append("g")
    .call(d3.axisLeft(yscale));

  // 🔹 Titre des axes
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + 35)
    .attr("text-anchor", "middle")
    .text("Âge des passagers");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .text("Nombre de passagers");
});
