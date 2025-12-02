// ===========================
// LOAD CSV
// ===========================
d3.csv("coffee_analysis.csv").then(data => {

    // --- Select only numeric columns ---
    // Add/remove depending on your dataset
    const numericCols = ["100g_USD", "rating", "review_date"];

    // Convert numerical values
    data.forEach(d => {
        numericCols.forEach(col => {
            d[col] = +d[col];   // Convert to number
        });
    });

    // ===========================
    // COMPUTE CORRELATION MATRIX
    // ===========================
    function correlation(x, y) {
        let n = x.length;
        let meanX = d3.mean(x);
        let meanY = d3.mean(y);
        let num = 0, denX = 0, denY = 0;

        for (let i = 0; i < n; i++) {
            let dx = x[i] - meanX;
            let dy = y[i] - meanY;
            num += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }
        return num / Math.sqrt(denX * denY);
    }

    // Build matrix
    let matrix = [];
    for (let i = 0; i < numericCols.length; i++) {
        for (let j = 0; j < numericCols.length; j++) {
            matrix.push({
                row: numericCols[i],
                col: numericCols[j],
                value: correlation(
                    data.map(d => d[numericCols[i]]),
                    data.map(d => d[numericCols[j]])
                )
            });
        }
    }

    // ===========================
    // DRAW CORRELOGRAM
    // ===========================
    const size = 80;  // Adjust dot spacing
    const padding = 50;

    const width = numericCols.length * size + padding;
    const height = numericCols.length * size + padding;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + 100)
        .attr("height", height + 100)
        .append("g")
        .attr("transform", "translate(60,40)");

    // Colors (-1 to 1)
    const color = d3.scaleDiverging()
        .domain([-1, 0, 1])
        .interpolator(d3.interpolateRdBu);

    // Circle size
    const radius = d3.scaleSqrt()
        .domain([0, 1])
        .range([0, size / 2 - 5]);

    // LABELS (left)
    svg.selectAll(".rowLabel")
        .data(numericCols)
        .enter()
        .append("text")
        .attr("x", -10)
        .attr("y", (d, i) => i * size + size / 2)
        .attr("text-anchor", "end")
        .attr("alignment-baseline", "middle")
        .text(d => d);

    // LABELS (top)
    svg.selectAll(".colLabel")
        .data(numericCols)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * size + size / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text(d => d);

    // DOTS (upper triangle only)
    svg.selectAll(".dot")
        .data(matrix)
        .enter()
        .filter(d => numericCols.indexOf(d.col) > numericCols.indexOf(d.row)) // upper triangle
        .append("circle")
        .attr("cx", d => numericCols.indexOf(d.col) * size + size / 2)
        .attr("cy", d => numericCols.indexOf(d.row) * size + size / 2)
        .attr("r", d => radius(Math.abs(d.value)))
        .attr("fill", d => color(d.value))
        .attr("stroke", "#222");
});
