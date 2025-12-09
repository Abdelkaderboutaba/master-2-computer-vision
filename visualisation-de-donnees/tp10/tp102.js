// Tricube weight function
function tricube(x) {
    return (x >= 1) ? 0 : Math.pow(1 - Math.pow(x, 3), 3);
}

// LOWESS function
function loess(xval, yval, bandwidth) {
    const n = xval.length;
    const res = [];
    const bandwidthInPoints = Math.floor(bandwidth * n);
    
    for (let i = 0; i < n; i++) {
        const x = xval[i];
        let left = Math.max(0, i - Math.floor(bandwidthInPoints / 2));
        let right = Math.min(n - 1, i + Math.floor(bandwidthInPoints / 2));
        
        while (right - left + 1 < bandwidthInPoints && (left > 0 || right < n - 1)) {
            if (left > 0) left--;
            if (right < n - 1) right++;
        }
        
        const edge = (xval[i] - xval[left]) > (xval[right] - xval[i]) ? left : right;
        const denom = Math.abs(1 / (xval[edge] - x));
        
        let sumWeights = 0;
        let sumX = 0;
        let sumXSquared = 0;
        let sumY = 0;
        let sumXY = 0;
        
        for (let k = left; k <= right; k++) {
            const xk = xval[k];
            const yk = yval[k];
            const dist = Math.abs(xk - x);
            const w = tricube(dist * denom);
            const xkw = xk * w;
            
            sumWeights += w;
            sumX += xkw;
            sumXSquared += xk * xkw;
            sumY += yk * w;
            sumXY += yk * xkw;
        }
        
        const meanX = sumX / sumWeights;
        const meanY = sumY / sumWeights;
        const meanXY = sumXY / sumWeights;
        const meanXSquared = sumXSquared / sumWeights;
        
        const beta = (Math.abs(meanXSquared - meanX * meanX) < 1e-12) 
            ? 0 
            : ((meanXY - meanX * meanY) / (meanXSquared - meanX * meanX));
        
        const alpha = meanY - beta * meanX;
        res[i] = beta * x + alpha;
    }
    
    return res;
}

// Load CSV
d3.csv("Boston_marathon.csv").then(data => {

    data.forEach(d => {
        d.year = +d.time;    // Year column is "time" in your CSV
        d.value = +d.value;  // Marathon time
    });

    const width = 1000;
    const height = 600;
    const margin = {top: 40, right: 150, bottom: 70, left: 80};

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

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .attr("class", "x-axis");

    // X Axis Label
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", (margin.left + width - margin.right) / 2)
        .attr("y", height - margin.bottom + 40)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .text("Year");

    // Y Axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .attr("class", "y-axis");

    // Y Axis Label
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -(margin.top + height - margin.bottom) / 2)
        .attr("y", margin.left - 50)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .text("Time (minutes)");

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
    function gaussianKernel(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function gaussianSmooth(data, windowSize) {
    const result = [];
    const bandwidth = windowSize / 6;

    for (let i = 0; i < data.length; i++) {
        let weightedSum = 0;
        let totalWeight = 0;

        for (let j = 0; j < data.length; j++) {
            const distance = (i - j) / bandwidth;
            const weight = gaussianKernel(distance);
            weightedSum += weight * data[j];
            totalWeight += weight;
        }

        result.push(weightedSum / totalWeight);
    }

    return result;
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
    function doubleExpSmooth(values, alpha = 0.4, beta = 0.3) {
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
    // LOWESS using custom loess function
    // ==========================
    const xValues = data.map(d => d.year);
    const yValues = data.map(d => d.value);
    
    // Use custom loess function with bandwidth of 0.3
    const lowessResult = loess(xValues, yValues, 0.3);
    
    const lowessData = data.map((d, i) => ({
        year: d.year,
        value: lowessResult[i]
    }));

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

    // ==========================
    // TITLE
    // ==========================
    svg.append("text")
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("fill", "#333")
        .text("Boston Marathon Winning Times (1897-1925)");

});