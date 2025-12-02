const width = 800;
const height = 800;

// Sélection du SVG
const svg = d3.select("#map");

// Projection pour l'Algérie
const projection = d3.geoMercator()
    .scale(900)                // Ajuste le zoom
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Couleurs différentes pour chaque wilaya
const color = d3.scaleOrdinal(d3.schemeCategory20);

// Charger le fichier TopoJSON
d3.json("algeria.json").then(function(data) {
    // Convertir TopoJSON en GeoJSON
    const wilayas = topojson.feature(data, data.objects.countries).features;

    // Dessiner chaque wilaya
    svg.selectAll("path")
        .data(wilayas)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .append("title")
        .text(d => d.properties.NAME_1);  // Nom de la wilaya au survol
})
.catch(error => {
    console.error("Erreur de chargement du fichier JSON :", error);
});
