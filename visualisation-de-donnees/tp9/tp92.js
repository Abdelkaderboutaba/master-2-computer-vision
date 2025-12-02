const width = 800;
const height = 800;

const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("algeria.json").then(data => {
    const algeria = topojson.feature(data, data.objects.countries);

    // Projection
    const projection = d3.geoMercator()
        .fitExtent([[20, 20], [width - 20, height - 20]], algeria);

    const path = d3.geoPath().projection(projection);

    // Calculate the bounding box of the entire country to determine the center
    const bounds = path.bounds(algeria);
    const xMid = (bounds[0][0] + bounds[1][0]) / 1.5;
    const yMid = (bounds[0][1] + bounds[1][1]) / 4.5;

    // Define colors for the 4 regions
    const colors = {
        "NW": "#0061f3ff", // North West - Purple
        "NE": "#00f919ff", // North East - Green
        "SW": "#dfff0eff", // South West - Orange
        "SE": "#7e0b0bff"  // South East - Red
    };

    // Draw Wilayas
    svg.selectAll("path")
        .data(algeria.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => {
            // Calculate centroid of the current wilaya
            const centroid = path.centroid(d);
            const x = centroid[0];
            const y = centroid[1];
            
            if (y < yMid) {
                // North
                return x < xMid ? colors.NW : colors.NE;
            } else {
                // South
                return x < xMid ? colors.SW : colors.SE;
            }
        })
        .attr("stroke", "#d3d3d3")
        .attr("stroke-width", 1)

    // Legend
    const legend = svg.append("g")
        .attr("transform", "translate(100, 60)");
    
    const regions = [
        {code: "NW", label: "North West", color: colors.NW},
        {code: "NE", label: "North East", color: colors.NE},
        {code: "SW", label: "South West", color: colors.SW},
        {code: "SE", label: "South East", color: colors.SE}
    ];

    regions.forEach((region, i) => {
        const g = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`);
        
        g.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", region.color);
            
        g.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .style("font-family", "sans-serif")
            .style("font-size", "12px")
            .text(region.label);
    });

}).catch(error => {
    console.error("Error loading map data:", error);
});