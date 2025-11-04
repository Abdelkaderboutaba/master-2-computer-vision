
const margin = { top: 40, right: 30, bottom: 60, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .style("background", "#f9f9f9");

const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


d3.csv("titanic-data.csv").then(data => {

  
  const sexKey = data.columns.includes("Sex") ? "Sex" :
                 data.columns.includes("Gender") ? "Gender" : null;
  if (!sexKey) {
    console.error("Aucune colonne 'Sex' ou 'Gender' trouvée !");
    return;
  }

  const filtered = data
    .map(d => ({
      age: d.Age === "" || d.Age === null ? NaN : +d.Age,
      sex: (d[sexKey] || "").trim().toLowerCase()
    }))
    .filter(d => !isNaN(d.age) && (d.sex === "male" || d.sex === "female"));


  const males = filtered.filter(d => d.sex === "male").map(d => d.age);
  const females = filtered.filter(d => d.sex === "female").map(d => d.age);

  const minAge = d3.min(filtered, d => d.age);
  const maxAge = d3.max(filtered, d => d.age);

  
  function gaussianKernel(t) {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * t * t);
  }


  function density(sample, x, h) {
    const n = sample.length;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const t = (sample[i] - x) / h; 
      sum += gaussianKernel(t);
    }
    return sum / (n * h);
  }

  const h = 3; // bandwith
  const xValues = d3.range(minAge, maxAge, 0.5);

  const densityMale = xValues.map(x => ({ x: x, y: density(males, x, h) }));
  const densityFemale = xValues.map(x => ({ x: x, y: density(females, x, h) }));

  const xscale = d3.scaleLinear()
    .domain([minAge, maxAge])
    .range([0, width]);

  const yscale = d3.scaleLinear()
    .domain([0, d3.max([
      d3.max(densityMale, d => d.y),
      d3.max(densityFemale, d => d.y)
    ])]).nice()
    .range([height, 0]);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xscale));

  g.append("g")
    .call(d3.axisLeft(yscale));

  
  const area = d3.area()
    .x(d => xscale(d.x))
    .y0(height)
    .y1(d => yscale(d.y))
    .curve(d3.curveBasis);


  g.append("path")
    .datum(densityMale)
    .attr("fill", "steelblue")
    .attr("opacity", 0.4)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", area);

  g.append("path")
    .datum(densityFemale)
    .attr("fill", "pink")
    .attr("opacity", 0.4)
    .attr("stroke", "deeppink")
    .attr("stroke-width", 2)
    .attr("d", area);

  const legend = g.append("g")
    .attr("transform", `translate(${width - 150},20)`);

  const items = [
    { color: "steelblue", label: "Hommes" },
    { color: "deeppink", label: "Femmes" }
  ];

  items.forEach((item, i) => {
    const lg = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);
    lg.append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("fill", item.color)
      .attr("opacity", 0.5);
    lg.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(item.label)
      .attr("font-size", "12px");
  });

  svg.append("text")
    .attr("x", margin.left + width / 2)
    .attr("y", height + margin.top + 50)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text("Âge des passagers");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2) - margin.top)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text("Densité estimée");

  svg.append("text")
    .attr("x", margin.left + width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .text("Distribution de l'âge des passagers du Titanic");

}).catch(err => {
  console.error("Erreur de chargement du CSV :", err);
});
