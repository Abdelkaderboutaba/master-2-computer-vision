// Fonction pour calculer la moyenne
function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Fonction pour calculer la corrélation de Pearson
function correlation(x, y) {
  const n = x.length;
  const meanX = mean(x);
  const meanY = mean(y);
  
  let numerator = 0;
  let sumX2 = 0;
  let sumY2 = 0;
  
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    sumX2 += dx * dx;
    sumY2 += dy * dy;
  }
  
  const denominator = Math.sqrt(sumX2 * sumY2);
  return denominator === 0 ? 0 : numerator / denominator;
}

// Fonction pour calculer la matrice de corrélation
function correlationMatrix(data, features) {
  const n = features.length;
  const matrix = Array(n).fill(0).map(() => Array(n).fill(0));
  
  // Extraire les colonnes
  const columns = {};
  features.forEach(feature => {
    columns[feature] = data.map(d => +d[feature]);
  });
  
  // Calculer les corrélations
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      matrix[i][j] = correlation(columns[features[i]], columns[features[j]]);
    }
  }
  
  return matrix;
}

// Créer le corrélogramme
function createCorrelogram(corrMatrix, features) {
  const margin = { top: 80, right: 180, bottom: 150, left: 80 };
  const cellSize = 70;
  const n = features.length;
  const width = cellSize * (n - 1);
  const height = cellSize * (n - 1);
  
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Échelle de couleur divergente (bleu - blanc - rouge)
  const colorScale = d3.scaleLinear()
    .domain([-1, 0, 1])
    .range(["#2166ac", "#f7f7f7", "#b2182b"]);
  
  // Échelle de taille (rayon des cercles)
  const sizeScale = d3.scaleLinear()
    .domain([0, 1])
    .range([2, cellSize / 2.2]);
  
  // Tooltip
  const tooltip = d3.select("#tooltip");
  
  // Créer les cellules (triangle supérieur)
  // Maintenant: axe Y (vertical) = Fe, Ba, Ca... (inversé)
  // axe X (horizontal) = RI, Na, Mg... (normal)
  for (let i = 0; i < n - 1; i++) {  // i = ligne (de haut en bas)
    for (let j = i + 1; j < n; j++) {  // j = colonne (de gauche à droite)
      // Inverser: on veut Fe en haut, donc on utilise (n-1-j) pour l'axe Y
      // et i pour l'axe X
      const rowIdx = n - 1 - j;  // Inverser les lignes (Fe en haut)
      const colIdx = i;           // Colonnes normales (RI à gauche)
      
      const corr = corrMatrix[i][j];
      const absCorr = Math.abs(corr);
      
      const xPos = colIdx * cellSize + cellSize / 2;
      const yPos = (j - i - 1) * cellSize + cellSize / 2;
      
      const g = svg.append("g")
        .attr("transform", `translate(${xPos}, ${yPos})`);
      
      // Rectangle de fond
      g.append("rect")
        .attr("x", -cellSize / 2)
        .attr("y", -cellSize / 2)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", "white")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 1);
      
      // Cercle représentant la corrélation
      g.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", sizeScale(absCorr))
        .attr("fill", colorScale(corr))
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("mouseover", function(event) {
          d3.select(this)
            .attr("stroke-width", 3)
            .attr("stroke", "black");
          
          tooltip
            .style("display", "block")
            .html(`
              <strong>${features[i]} × ${features[j]}</strong><br>
              <strong>Corrélation:</strong> ${corr.toFixed(3)}<br>
              ${corr > 0 ? "Corrélation positive" : corr < 0 ? "Corrélation négative" : "Pas de corrélation"}
            `);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 30) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke-width", 1)
            .attr("stroke", "#333");
          tooltip.style("display", "none");
        });
    }
  }
  
  // Labels de l'axe X (en bas) - RI, Na, Mg, Al, Si, K, Ca, Ba (sans Fe)
  for (let i = 0; i < n - 1; i++) {
    svg.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "start")
      .attr("transform", `rotate(30, ${i * cellSize + cellSize / 2}, ${height + 20})`)
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(features[i]);
  }
  
  // Labels de l'axe Y (à droite) - Fe, Ba, Ca, K, Si, Al, Mg, Na (inversé, sans RI)
  for (let j = 1; j < n; j++) {
    const yPos = (j - 1) * cellSize + cellSize / 2;
    const label = features[n - j];  // Inverser l'ordre: Fe, Ba, Ca...
    
    svg.append("text")
      .attr("x", -30)
      .attr("y", yPos)
      .attr("text-anchor", "start")
      .attr("dy", "0.35em")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(label);
  }
  
  // Titre
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .text("Matrice de Corrélation (Triangle Supérieur)");
  
  // ========== LÉGENDE DE COULEUR ==========
  const legendWidth = 30;
  const legendHeight = 200;
  
  const legend = svg.append("g")
    .attr("transform", `translate(${width + 100}, ${height / 2 - legendHeight / 2})`);
  
  legend.append("text")
    .attr("x", 0)
    .attr("y", -15)
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Corrélation");
  
  // Gradient pour la légende de couleur
  const defs = svg.append("defs");
  const linearGradient = defs.append("linearGradient")
    .attr("id", "color-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");
  
  linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#b2182b");
  
  linearGradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", "#f7f7f7");
  
  linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#2166ac");
  
  legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#color-gradient)")
    .attr("stroke", "black")
    .attr("stroke-width", 1);
  
  // Labels de la légende de couleur
  const colorLabels = [
    { value: "+1", y: 0 },
    { value: "+0.5", y: legendHeight * 0.25 },
    { value: "0", y: legendHeight * 0.5 },
    { value: "-0.5", y: legendHeight * 0.75 },
    { value: "-1", y: legendHeight }
  ];
  
  colorLabels.forEach(item => {
    legend.append("text")
      .attr("x", legendWidth + 10)
      .attr("y", item.y)
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .text(item.value);
  });
  
  // ========== LÉGENDE DE TAILLE ==========
  const sizeLegend = svg.append("g")
    .attr("transform", `translate(${width + 100}, ${height / 2 + legendHeight / 2 + 60})`);
  
  sizeLegend.append("text")
    .attr("x", 0)
    .attr("y", -15)
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Force de corrélation");
  
  const sizeValues = [0.2, 0.5, 0.8, 1.0];
  
  sizeValues.forEach((value, i) => {
    const g = sizeLegend.append("g")
      .attr("transform", `translate(${sizeScale(1.0) / 2}, ${i * 50 + 30})`);
    
    g.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", sizeScale(value))
      .attr("fill", "#999")
      .attr("stroke", "#333")
      .attr("stroke-width", 1);
    
    g.append("text")
      .attr("x", sizeScale(1.0) + 10)
      .attr("y", 0)
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .text(value.toFixed(1));
  });
}

// Fonction principale
async function main() {
  try {
    // Charger les données
    const data = await d3.csv("glass.csv");
    
    console.log("Données chargées:", data.length, "lignes");
    
    // Features (toutes les colonnes sauf Type)
    const features = ['RI', 'Na', 'Mg', 'Al', 'Si', 'K', 'Ca', 'Ba', 'Fe'];
    
    // Calculer la matrice de corrélation
    console.log("Calcul de la matrice de corrélation...");
    const corrMatrix = correlationMatrix(data, features);
    
    console.log("Matrice de corrélation:", corrMatrix);
    
    // Créer le corrélogramme
    createCorrelogram(corrMatrix, features);
    
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// Exécuter
main();