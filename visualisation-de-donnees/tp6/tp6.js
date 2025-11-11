const main = async (container) => {
    const data = await d3.csv("abalone.csv", d3.autoType);
    
    const attributes = ["Length", "Diameter", "Height", "Whole_weight", 
                       "Shucked_weight", "Viscera_weight", "Shell_weight", "Rings"];
    
    const boxPlotData = attributes.map(attr => {
        const values = data.map(d => d[attr]);
        
        const meanValue = d3.mean(values);
        const stdDev = d3.deviation(values);
        let standardizedValues = values.map(v => (v - meanValue) / stdDev);
        
        standardizedValues = standardizedValues.filter(v => Math.abs(v) <= 7).sort(d3.ascending);
        
        const q1 = d3.quantile(standardizedValues, 0.25);
        const median = d3.quantile(standardizedValues, 0.5);
        const q3 = d3.quantile(standardizedValues, 0.75);
        const iqr = q3 - q1;
        const mean = d3.mean(standardizedValues); 

        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;
        
        const min = d3.min(standardizedValues.filter(v => v >= lowerBound));
        const max = d3.max(standardizedValues.filter(v => v <= upperBound));
        
        const outliers = standardizedValues.filter(v => v < lowerBound || v > upperBound);
        
        return {
            attribute: attr,
            min: min,
            q1: q1,
            median: median,
            q3: q3,
            max: max,
            mean: mean,
            outliers: outliers
        };
    });
    
    const margin = { top: 40, right: 30, bottom: 80, left: 60 };
    const width = 1000 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const xScale = d3.scaleBand()
        .domain(attributes)
        .range([0, width])
        .padding(0.2);
    
    const allValues = boxPlotData.flatMap(d => [d.min, d.max, ...d.outliers]);
    const yScale = d3.scaleLinear()
        .domain([d3.min(allValues) - 0.5, d3.max(allValues) + 0.5])
        .range([height, 0]);
    
    const boxWidth = xScale.bandwidth();
    
    boxPlotData.forEach(d => {
        const x = xScale(d.attribute);
        const centerX = x + boxWidth / 2;
        
        svg.append("line")
            .attr("x1", centerX)
            .attr("x2", centerX)
            .attr("y1", yScale(d.min))
            .attr("y2", yScale(d.q1))
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        
        svg.append("line")
            .attr("x1", centerX)
            .attr("x2", centerX)
            .attr("y1", yScale(d.q3))
            .attr("y2", yScale(d.max))
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        
        svg.append("line")
            .attr("x1", x + boxWidth * 0.3)
            .attr("x2", x + boxWidth * 0.7)
            .attr("y1", yScale(d.min))
            .attr("y2", yScale(d.min))
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        
        svg.append("line")
            .attr("x1", x + boxWidth * 0.3)
            .attr("x2", x + boxWidth * 0.7)
            .attr("y1", yScale(d.max))
            .attr("y2", yScale(d.max))
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        
        svg.append("rect")
            .attr("x", x)
            .attr("y", yScale(d.q3))
            .attr("width", boxWidth)
            .attr("height", yScale(d.q1) - yScale(d.q3))
            .attr("fill", "lightblue")
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        
        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(d.median))
            .attr("y2", yScale(d.median))
            .attr("stroke", "black")
            .attr("stroke-width", 3);
        
        svg.append("line")
            .attr("x1", x)
            .attr("x2", x + boxWidth)
            .attr("y1", yScale(d.mean))
            .attr("y2", yScale(d.mean))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5");
        
        d.outliers.forEach(outlier => {
            svg.append("circle")
                .attr("cx", centerX)
                .attr("cy", yScale(outlier))
                .attr("r", 3)
                .attr("fill", "black");
        });
    });
    
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "12px");
    
    svg.append("g")
        .call(d3.axisLeft(yScale));
    
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Box Plots of Abalone Dataset Attributes");
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -45)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Standardized Value (z-score)");
    
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 150}, 20)`);
    
    legend.append("line")
        .attr("x1", 0)
        .attr("x2", 30)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke", "black")
        .attr("stroke-width", 3);
    
    legend.append("text")
        .attr("x", 35)
        .attr("y", 5)
        .text("Median")
        .style("font-size", "12px");
    
    legend.append("line")
        .attr("x1", 0)
        .attr("x2", 30)
        .attr("y1", 20)
        .attr("y2", 20)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");
    
    legend.append("text")
        .attr("x", 35)
        .attr("y", 25)
        .text("Mean")
        .style("font-size", "12px");
}

const container = document.getElementById("container");
main(container);