d3.csv("iris.csv")
  .then(data => {

    const CATEGORY_COL = "species"; // Nom exact colonne
    const VALUE_COL = "sepal_length"; // Nom exact colonne

    data = data.map(d => ({
        species: d[CATEGORY_COL],
        sepal_length: +d[VALUE_COL]
    })).filter(d => d.species && !isNaN(d.sepal_length));

    if (data.length === 0) {
        console.error("ERREUR: Aucune donnée valide.");
        return;
    }

    const statsBySpecies = d3.group(data, d => d.species);

    const errorData = Array.from(statsBySpecies, ([species, values]) => {
      const lengths = values.map(d => d.sepal_length);
      const mean = d3.mean(lengths);
      const stdDev = d3.deviation(lengths);
      const n = lengths.length;
      const sem = stdDev / Math.sqrt(n);

      return {
        species: species,
        mean: mean,
        sem: sem,
        upper: mean + sem,
        lower: mean - sem
      };
    }).sort((a, b) => d3.ascending(a.mean, b.mean));

    // --- SVG ---
    const margin = { top: 30, right: 30, bottom: 50, left: 100 };
    const width = 600;
    const height = 250;
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- Scales ---
    const xMin = d3.min(errorData, d => d.lower);
    const xMax = d3.max(errorData, d => d.upper);

    const xScale = d3.scaleLinear()
      .domain([xMin * 0.9, xMax * 1.05])
      .range([0, innerW]);

    const speciesNames = errorData.map(d => d.species);
    const yScale = d3.scaleBand()
      .domain(speciesNames)
      .range([0, innerH])
      .padding(0.5);

    // --- Axes ---
    svg.append("g")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Label X
    svg.append("text")
        .attr("transform", `translate(${innerW/2}, ${innerH + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Longueur des Sépales (cm)");

    // --- Barres d'erreur ---
    const errorBars = svg.selectAll(".error-bar")
      .data(errorData)
      .enter()
      .append("g")
      .attr("class", "error-bar")
      .attr("transform", d => `translate(0, ${yScale(d.species) + yScale.bandwidth()/2})`);

    const capSize = 5;

    // Ligne principale
    errorBars.append("line")
      .attr("x1", d => xScale(d.lower))
      .attr("x2", d => xScale(d.upper))
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Capuchon gauche
    errorBars.append("line")
      .attr("x1", d => xScale(d.lower))
      .attr("x2", d => xScale(d.lower))
      .attr("y1", -capSize)
      .attr("y2", capSize)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Capuchon droit
    errorBars.append("line")
      .attr("x1", d => xScale(d.upper))
      .attr("x2", d => xScale(d.upper))
      .attr("y1", -capSize)
      .attr("y2", capSize)
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // --- Points de moyenne ---
    svg.selectAll(".dot")
      .data(errorData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.mean))
      .attr("cy", 0)
      .attr("r", 6)
      .attr("fill", "#1f77b4");

  })
  .catch(error => {
    console.error("Erreur de chargement CSV ou autre :", error);
  });
