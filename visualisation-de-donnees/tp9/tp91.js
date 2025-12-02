const main = async (container) => {
    const width = 1200;
    const height = 600;
  
    const svg = d3.select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    d3.json("algeria.json").then((topojsonData) => {

      const geojsonData = topojson
      .feature(topojsonData, topojsonData.objects.countries);

      const projection = d3.geoMercator()
      .fitSize([width, height], geojsonData);
      const path = d3.geoPath()
      .projection(projection);
  
      const wilayas = geojsonData.features;
  
      // Nombre de territoires
      const numTerritories = 3;
      
      // Couleurs pour chaque territoire (très distinctes)
      const territoryColors = [
        '#e6194b', // Rouge vif - Nord
        '#3cb44b', // Vert vif - Centre
        '#4363d8'  // Bleu vif - Sud
      ];
      
      // Fonction pour assigner une wilaya à un territoire basé sur sa latitude
      const getTerritoryByLatitude = (feature) => {
        const centroid = d3.geoCentroid(feature);
        const latitude = centroid[1];
        
        // Division basée sur la latitude (Nord, Centre, Sud)
        if (latitude > 35) return 0; // Nord
        else if (latitude > 30) return 1; // Centre
        else return 2; // Sud
      };
      
      const colorScale = (feature) => {
        return territoryColors[getTerritoryByLatitude(feature)];
      };
  
            
      const sharedBordersMap = new Map();
  
      // Dessiner les wilayas avec couleurs par territoire (sans bordures internes)
      svg.selectAll("path")
        .data(wilayas)
        .enter()
        .append("path")
        .attr("class", "wilayas")
        .attr("d", path)
        .attr("fill", (d) => {
          const color = colorScale(d);
          return d3.rgb(color).brighter(1.2); // Remplissage plus clair
        })
        .attr("stroke", "none")
        .attr("opacity", 0.8);
  
      // Dessiner uniquement les frontières entre territoires différents
      svg.append("path")
        .datum(topojson.mesh(topojsonData, topojsonData.objects.countries, (a, b) => {
          // Garder les frontières où les territoires sont différents
          if (a !== b) {
            const territoryA = getTerritoryByLatitude(a);
            const territoryB = getTerritoryByLatitude(b);
            return territoryA !== territoryB;
          }
          return false;
        }))
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 3)
        .attr("stroke-linejoin", "round");
  
      // Contours extérieurs en noir
      svg.append("path")
        .datum(topojson.mesh(topojsonData, topojsonData.objects.countries, (a, b) => a === b)) 
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "black") 
        .attr("stroke-width", 3);
        
      // Légende
      const legend = svg.append("g")
        .attr("transform", "translate(20, 20)");
      
      territoryColors.forEach((color, i) => {
        const legendRow = legend.append("g")
          .attr("transform", `translate(0, ${i * 25})`);
        
        legendRow.append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", color)
          .attr("opacity", 0.7);
        
        legendRow.append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text(`${['Nord', 'Centre', 'Sud'][i]}`)
          .style("font-size", "14px")
          .style("font-weight", "bold");
      });
    });
  };
  
  const container = document.getElementById("container");
  main(container);