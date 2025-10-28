const svg = d3.select("body")
  .append("svg")
  .attr("height", 1000)
  .attr("width", 1000)
  .style("background-color", "grey")

d3.csv("d.csv").then(data => {
  const groupe = svg.append("g")
    .attr("transform", "translate(70,70)")

  const yscale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Value)])
    .range([500, 0])

  const xscale = d3.scaleBand()
    .domain(data.map(d => d.id))
    .range([0, 800])
    .padding(0.3)

  const axeygroupe = groupe.append("g")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yscale))

  const axexgroupe = groupe.append("g")
    .attr("transform", "translate(0,500)")
    .call(d3.axisBottom(xscale))

  // Créer les barres
  const bars = groupe.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", d => yscale(d.Value))
    .attr("x", d => xscale(d.id))
    .attr("height", d => 500 - yscale(d.Value))
    .attr("width", xscale.bandwidth())
    .attr("fill", "red")

  groupe.append("text")
    .attr("x", 500)
    .attr("y", 500)
    .text("(id)")
    .attr("font-size", "20px")

  groupe.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .text("(value)")
    .attr("font-size", "20px")

  // Fonction de tri avec animation
  function bubbleSortWithAnimation() {
    let sortedData = [...data];
    let swaps = [];

    // Générer toutes les permutations nécessaires
    for (let i = 0; i < sortedData.length; i++) {
      for (let j = 0; j < sortedData.length - i - 1; j++) {
        if (+sortedData[j].Value > +sortedData[j + 1].Value) {
          // Enregistrer l'échange
          swaps.push({ i: j, j: j + 1 });
          // Effectuer l'échange
          [sortedData[j], sortedData[j + 1]] = [sortedData[j + 1], sortedData[j]];
        }
      }
    }

    // Animer chaque échange
    let delay = 0;
    const duration = 800;

    swaps.forEach((swap, index) => {
      setTimeout(() => {
        // Échanger les positions dans le tableau de données
        [data[swap.i], data[swap.j]] = [data[swap.j], data[swap.i]];

        // Mettre à jour la position x de toutes les barres
        bars.data(data)
          .transition()
          .duration(duration)
          .attr("x", (d, i) => {
            const ids = data.map(item => item.id);
            return xscale(ids[i]);
          })
          .attr("fill", (d, i) => {
            // Colorer les barres en cours d'échange
            if (i === swap.i || i === swap.j) return "yellow";
            return "red";
          })
          .transition()
          .duration(200)
          .attr("fill", "red");
      }, delay);

      delay += duration + 200;
    });
  }

  // Démarrer l'animation après 1 seconde
  setTimeout(bubbleSortWithAnimation, 1000);
})