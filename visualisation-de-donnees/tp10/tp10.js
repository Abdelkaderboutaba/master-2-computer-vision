const svg = d3.select("#chart");
const width = +svg.attr("width") - 200;
const height = +svg.attr("height") - 60;

const g = svg.append("g").attr("transform", "translate(50,20)");

const parseRow = d => ({
    year: +d.time,
    value: +d.value
});

d3.csv("Boston_marathon.csv", parseRow).then(data => {

    // ========================
    //       SCALES
    // ========================
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.value) - 5, d3.max(data, d => d.value) + 5])
        .range([height, 0]);

    // Axes
    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    g.append("g")
        .call(d3.axisLeft(y));

    // ==========================
    // DOT PLOT
    // ==========================
    g.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.value))
        .attr("r", 3)
        .attr("fill", "black");

    // ==========================
    // SMOOTHING FUNCTIONS
    // ==========================

    // 1️⃣ LOWESS smoothing
    function lowess(data, f = 0.25) {
        const n = data.length;
        const r = Math.ceil(f * n);
        const result = [];

        for (let i = 0; i < n; i++) {
            const x0 = data[i].year;

            const distances = data
                .map(d => ({ d, dist: Math.abs(d.year - x0) }))
                .sort((a, b) => a.dist - b.dist);

            const window = distances.slice(0, r);

            const maxDist = window[window.length - 1].dist;
            const weights = window.map(w => {
                const u = w.dist / maxDist;
                return Math.pow(1 - Math.pow(u, 3), 3);
            });

            let sumW = 0, sumWX = 0, sumWY = 0;
            for (let j = 0; j < window.length; j++) {
                const w = weights[j];
                sumW += w;
                sumWX += w * window[j].d.year;
                sumWY += w * window[j].d.value;
            }

            const xBar = sumWX / sumW;
            const yBar = sumWY / sumW;

            let num = 0, den = 0;
            for (let j = 0; j < window.length; j++) {
                const w = weights[j];
                num += w * (window[j].d.year - xBar) * (window[j].d.value - yBar);
                den += w * Math.pow(window[j].d.year - xBar, 2);
            }

            const beta = num / den;
            const alpha = yBar - beta * xBar;

            result.push({ year: x0, value: alpha + beta * x0 });
        }

        return result;
    }

    // 2️⃣ Centered Moving Average
    function centeredMA(data, window = 5) {
        const result = [];
        const half = Math.floor(window / 2);

        for (let i = 0; i < data.length; i++) {
            if (i < half || i >= data.length - half) continue;

            const slice = data.slice(i - half, i + half + 1);
            const avg = d3.mean(slice, d => d.value);
            result.push({ year: data[i].year, value: avg });
        }
        return result;
    }

    // 3️⃣ One-sided Moving Average
    function oneSidedMA(data, window = 5) {
        const result = [];
        for (let i = window; i < data.length; i++) {
            const slice = data.slice(i - window, i);
            const avg = d3.mean(slice, d => d.value);
            result.push({ year: data[i].year, value: avg });
        }
        return result;
    }

    // 4️⃣ Gaussian kernel smoothing
    function gaussian(data, bandwidth = 5) {
        const result = [];
        const kernel = x => Math.exp(-0.5 * (x / bandwidth) ** 2);

        for (let i = 0; i < data.length; i++) {
            const x0 = data[i].year;

            let num = 0, den = 0;
            data.forEach(d => {
                const w = kernel(d.year - x0);
                num += w * d.value;
                den += w;
            });

            result.push({ year: x0, value: num / den });
        }
        return result;
    }

    // 5️⃣ Double exponential smoothing
    function doubleExp(data, alpha = 0.4, beta = 0.3) {
        let l = data[0].value;
        let b = data[1].value - data[0].value;

        const result = [{ year: data[0].year, value: l }];

        for (let i = 1; i < data.length; i++) {
            const value = data[i].value;
            const oldL = l;
            l = alpha * value + (1 - alpha) * (l + b);
            b = beta * (l - oldL) + (1 - beta) * b;
            result.push({ year: data[i].year, value: l + b });
        }

        return result;
    }

    // =================================================
    // DRAW LINES
    // =================================================

    function drawLine(data, color) {
        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("stroke", color)
            .attr("d", d3.line()
                .x(d => x(d.year))
                .y(d => y(d.value))
            );
    }

    drawLine(lowess(data), "red");
    drawLine(centeredMA(data), "green");
    drawLine(oneSidedMA(data), "blue");
    drawLine(gaussian(data), "orange");
    drawLine(doubleExp(data), "purple");

    // ===========================
    //  TOP-RIGHT LABEL
    // ===========================
    svg.append("text")
        .attr("x", width + 40)
        .attr("y", 25)
        .attr("class", "top-label")
        .text("Smoothing Techniques Applied");

});
