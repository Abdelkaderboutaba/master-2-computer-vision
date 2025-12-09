// Load CSV
d3.csv("Boston_marathon.csv").then(data => {

    data.forEach(d => {
        d.year = +d.time;    // Year column is "time" in your CSV
        d.value = +d.value;  // Marathon time
    });

    const width = 1000;
    const height = 600;
    const margin = {top: 40, right: 150, bottom: 50, left: 60};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.value) - 5, d3.max(data, d => d.value) + 5])
        .range([height - margin.bottom, margin.top]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    // Dot plot
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.value))
        .attr("r", 3)
        .attr("fill", "#2c3e50");

    // ==========================
    // Centered Moving Average
    // ==========================
    function centeredMA(values, window) {
        const half = Math.floor(window / 2);
        return values.map((v, i) => {
            const start = Math.max(0, i - half);
            const end = Math.min(values.length, i + half + 1);
            return d3.mean(values.slice(start, end));
        });
    }

    const cma = centeredMA(data.map(d => d.value), 5);
    const cmaData = data.map((d, i) => ({year: d.year, value: cma[i]}));

    const line = d3.line()
        .defined(d => d.value !== null && !isNaN(d.value))
        .x(d => x(d.year))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(cmaData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // ==========================
    // One-sided Moving Average
    // ==========================
    function oneSidedMA(values, window) {
        return values.map((v, i) => {
            const start = Math.max(0, i - window + 1);
            return d3.mean(values.slice(start, i + 1));
        });
    }

    const oma = oneSidedMA(data.map(d => d.value), 5);
    const omaData = data.map((d, i) => ({year: d.year, value: oma[i]}));

    svg.append("path")
        .datum(omaData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line);

    // ==========================
    // Gaussian Kernel Smoothing
    // ==========================
    function gaussianKernel(x, xi, h) {
        return Math.exp(-0.5 * Math.pow((x - xi) / h, 2));
    }

    function gaussianSmooth(xs, ys, bandwidth = 2.5) {
        return xs.map((x, i) => {
            let weights = ys.map((_, j) => gaussianKernel(i, j, bandwidth));
            let sumW = d3.sum(weights);
            let smoothed = d3.sum(weights.map((w, j) => w * ys[j])) / sumW;
            return smoothed;
        });
    }

    const gSmooth = gaussianSmooth(
        data.map((_, i) => i),
        data.map(d => d.value),
        4
    );

    const gData = data.map((d, i) => ({year: d.year, value: gSmooth[i]}));

    svg.append("path")
        .datum(gData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("d", line);

    // ==========================
    // Double Exponential Smoothing
    // ==========================
    function doubleExpSmooth(values, alpha = 0.4, beta = 0.2) {
        let s = [values[0]];
        let b = [values[1] - values[0]];
        let result = [values[0]];

        for (let i = 1; i < values.length; i++) {
            s.push(alpha * values[i] + (1 - alpha) * (s[i - 1] + b[i - 1]));
            b.push(beta * (s[i] - s[i - 1]) + (1 - beta) * b[i - 1]);
            result.push(s[i]);
        }
        return result;
    }

    const des = doubleExpSmooth(data.map(d => d.value));
    const desData = data.map((d, i) => ({year: d.year, value: des[i]}));

    svg.append("path")
        .datum(desData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "orange")
        .attr("stroke-width", 2)
        .attr("d", line);

    // ==========================
    // LOWESS (Manual Implementation)
    // ==========================
    function lowess(data, bandwidth = 0.3) {
        const n = data.length;
        const smoothed = [];
        
        for (let i = 0; i < n; i++) {
            const x0 = data[i].year;
            const distances = data.map(d => Math.abs(d.year - x0));
            const maxDist = d3.quantile(distances.sort((a, b) => a - b), bandwidth);
            
            let sumWeights = 0;
            let sumWeightedY = 0;
            
            for (let j = 0; j < n; j++) {
                const dist = Math.abs(data[j].year - x0);
                if (dist <= maxDist) {
                    const weight = Math.pow(1 - Math.pow(dist / maxDist, 3), 3);
                    sumWeights += weight;
                    sumWeightedY += weight * data[j].value;
                }
            }
            
            smoothed.push({
                year: x0,
                value: sumWeightedY / sumWeights
            });
        }
        
        return smoothed;
    }

    const lowessData = lowess(data);

    svg.append("path")
        .datum(lowessData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", line);

    // ==========================
    // LEGEND (Top Right)
    // ==========================
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

    const legendItems = [
        { label: "Original Data", color: "#2c3e50", type: "circle" },
        { label: "LOWESS", color: "red", type: "line" },
        { label: "Centered MA", color: "blue", type: "line" },
        { label: "One-sided MA", color: "green", type: "line" },
        { label: "Gaussian Kernel", color: "purple", type: "line" },
        { label: "Double Exp", color: "orange", type: "line" }
    ];

    legendItems.forEach((item, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(0, ${i * 25})`);

        if (item.type === "circle") {
            legendRow.append("circle")
                .attr("cx", 5)
                .attr("cy", 0)
                .attr("r", 4)
                .attr("fill", item.color);
        } else {
            legendRow.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 20)
                .attr("y2", 0)
                .attr("stroke", item.color)
                .attr("stroke-width", 2);
        }

        legendRow.append("text")
            .attr("x", 25)
            .attr("y", 4)
            .attr("font-size", "12px")
            .attr("font-family", "Arial, sans-serif")
            .text(item.label);
    });

});