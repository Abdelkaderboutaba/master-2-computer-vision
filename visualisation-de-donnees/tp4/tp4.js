// stacked_titanic.js — code robuste
const margin = { top: 50, right: 70, bottom: 80, left: 80 };
const outerWidth = 700;
const outerHeight = 500;
const width = outerWidth - margin.left - margin.right;
const height = outerHeight - margin.top - margin.bottom;

const svg = d3.select("body")
  .append("svg")
  .attr("width", outerWidth)
  .attr("height", outerHeight)
  .style("background", "#f7f7f7");

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// helper: run local server if you open file:// (see checklist below)
d3.csv("titanic-data.csv").then(raw => {
  if (!raw || raw.length === 0) {
    console.error("CSV vide ou non chargé. Vérifie le chemin et le serveur.");
    return;
  }

  // --- Normalize column names and values ---
  const sexKey = raw.columns.includes("Sex") ? "Sex"
                : raw.columns.includes("Gender") ? "Gender"
                : null;
  if (!sexKey) {
    console.error("Aucune colonne 'Sex' ou 'Gender' trouvée dans le CSV. colonnes:", raw.columns);
    return;
  }

  // map utile
  const data = raw.map(d => ({
    Pclass: d.Pclass,
    sex: (d[sexKey] || "").toString().trim().toLowerCase() // male / female
  }));

  // --- Grouping: count per Pclass and sex ---
  const grouped = d3.group(data, d => d.Pclass, d => d.sex);
  // build counts array with deterministic Pclass order
  const classes = Array.from(new Set(data.map(d => d.Pclass))).sort((a,b)=> +a - +b);

  const counts = classes.map(cls => {
    const genders = grouped.get(cls) || new Map();
    return {
      Pclass: cls,
      male: (genders.get("male") || []).length,
      female: (genders.get("female") || []).length,
      other: (genders.get("other") || []).length // in case extra values
    };
  });

  console.log("classes:", classes);
  console.log("counts:", counts);

  // Decide keys to stack: only those present (male/female)
  const keys = ["male","female"].filter(k => counts.some(c => c[k] !== undefined));
  console.log("stack keys:", keys);

  // --- Stack generator ---
  const stackGen = d3.stack().keys(keys);
  const series = stackGen(counts);
  console.log("series (stack output):", series);

  // --- scales ---
  const x = d3.scaleBand()
    .domain(classes)
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(counts, d => keys.reduce((s,k)=> s + (d[k]||0), 0))]).nice()
    .range([height, 0]);

  const color = d3.scaleOrdinal().domain(keys).range(["#1f77b4","#ff7f0e"]);

  // axes
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .call(d3.axisLeft(y));

  // --- draw stacked bars ---
  const layer = g.selectAll(".layer")
    .data(series)
    .enter()
    .append("g")
    .attr("class", "layer")
    .attr("fill", d => color(d.key));

  // for each series (key) append rects for all classes
  layer.selectAll("rect")
    .data(d => d) // d is an array of pairs for each class: [ [y0,y1], ... ]
    .enter()
    .append("rect")
    .attr("x", (d, i) => x(classes[i]))
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .attr("stroke", "white");

  // legend
  const legend = svg.append("g").attr("transform", `translate(${margin.left + width + 10}, ${margin.top})`);
  keys.forEach((k, i) => {
    const lg = legend.append("g").attr("transform", `translate(0, ${i*20})`);
    lg.append("rect").attr("width", 12).attr("height", 12).attr("fill", color(k));
    lg.append("text").attr("x", 16).attr("y", 10).text(k).attr("font-size","12px");
  });

  // title
  svg.append("text")
    .attr("x", outerWidth/2)
    .attr("y", 20)
    .attr("text-anchor","middle")
    .attr("font-size","16px")
    .text("Titanic: stacked by sex per Pclass");

}).catch(err => {
  console.error("Erreur chargement CSV:", err);
});
