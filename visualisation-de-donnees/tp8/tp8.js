// =====================================================
// CONFIGURATION
// =====================================================
const csvFile = "glass.csv";

// Labels définis par toi
const verticalLabels = ["Na", "Mg", "Al", "Si", "K", "Ca", "Ba", "Fe"];
const horizontalLabels = ["RI", "Na", "Mg", "Al", "Si", "K", "Ca", "Ba"];

// Taille du graphe
const cellSize = 45;
const padding = 120;

// =====================================================
// LECTURE CSV
// =====================================================
d3.csv(csvFile).then(data => {

    // Convertir toutes les colonnes en nombres
    data.forEach(d => {
        for (let k in d) d[k] = +d[k];
    });

    // Sélectionner uniquement les colonnes utilisées
    const allLabels = Array.from(new Set(horizontalLabels.concat(verticalLabels)));
    const filtered = data.map(row => {
        let obj = {};
        allLabels.forEach(k => obj[k] = row[k]);
        return obj;
    });

    // =====================================================
    // MATRICE DE CORRELATION
    // =====================================================
    function correlation(x, y) {
        const n = x.length;
        const meanX = d3.mean(x);
        const meanY = d3.mean(y);
        const num = d3.sum(x.map((d, i) => (x[i] - meanX) * (y[i] - meanY)));
        const den = Math.sqrt(
            d3.sum(x.map(d => Math.pow(d - meanX, 2))) *
            d3.sum(y.map(d => Math.pow(d - meanY, 2)))
        );
        return num / den;
    }

    // Calcul de la matrice
    const corrMatrix = verticalLabels.map(v => {
        return horizontalLabels.map(h => {
            return correlation(
                filtered.map(d => d[v]),
                filtered.map(d => d[h])
            );
        });
    });

    // =====================================================
    // SCALES
    // =====================================================
    const color = d3.scaleDiverging()
        .domain([-1, 0, 1])
        .interpolator(d3.interpolateRdBu); // Bleu → Blanc → Rouge

    const radiusScale = d3.scaleLinear()
        .domain([0, 1])
        .range([3, cellSize / 2 - 5]); // Taille contrôlée

    // =====================================================
    // SVG
    // =====================================================
    const width = horizontalLabels.length * cellSize + padding;
    const height = verticalLabels.length * cellSize + padding;

    const svg = d3.select("#correlogram")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // =====================================================
    // AXES
    // =====================================================
    // Horizontal (top)
    svg.append("g")
        .attr("transform", `translate(${padding},${padding - 10})`)
        .selectAll("text")
        .data(horizontalLabels)
        .enter()
        .append("text")
        .attr("x", (_, i) => i * cellSize + cellSize / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .text(d => d);

    // Vertical (left)
    svg.append("g")
        .attr("transform", `translate(${padding - 10},${padding})`)
        .selectAll("text")
        .data(verticalLabels)
        .enter()
        .append("text")
        .attr("y", (_, i) => i * cellSize + cellSize / 2)
        .attr("x", 0)
        .attr("text-anchor", "end")
        .text(d => d);

    // =====================================================
    // AFFICHER UNIQUEMENT LA PARTIE SUPÉRIEURE DROITE
    // =====================================================
    const grid = svg.append("g")
        .attr("transform", `translate(${padding},${padding})`);

    verticalLabels.forEach((vLabel, row) => {
        horizontalLabels.forEach((hLabel, col) => {

            // Condition : on garde seulement col > row
            if (col <= row) return;

            const value = corrMatrix[row][col];

            grid.append("circle")
                .attr("cx", col * cellSize + cellSize / 2)
                .attr("cy", row * cellSize + cellSize / 2)
                .attr("r", radiusScale(Math.abs(value)))
                .attr("fill", color(value))
                .attr("opacity", 0.9);
        });
    });
});
