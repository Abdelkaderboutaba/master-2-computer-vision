const main = async (container) => {
	const data = await d3.csv("./glass.csv");
	const attributes = Object.keys(data[0]).slice(0, 9);

	const X = data.map(row => attributes.map(attr => +row[attr]));

	function zscore(arr) {
		const mean = d3.mean(arr);
		const std = d3.deviation(arr);
		return arr.map(v => (v - mean) / std);
	}
	const X_std = numeric.transpose(X).map(zscore);
	const X_std_T = numeric.transpose(X_std);

	function covarianceMatrix(A) {
		const n = A.length;
		const m = A[0].length;
		const cov = numeric.rep([m, m], 0);
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < m; j++) {
				let sum = 0;
				for (let k = 0; k < n; k++) {
					sum += A[k][i] * A[k][j];
				}
				cov[i][j] = sum / (n - 1);
			}
		}
		return cov;
	}
	const covMatrix = covarianceMatrix(X_std_T);

	const eig = numeric.eig(covMatrix);

	const eigenvalues = Array.from(eig.lambda.x);
	const sortedIndices = eigenvalues
		.map((v, i) => [v, i])
		.sort((a, b) => b[0] - a[0])
		.map(pair => pair[1]);
	const pc1 = sortedIndices[0];
	const pc2 = sortedIndices[1];
	const featureVector = [eig.E.x.map(row => row[pc1]), eig.E.x.map(row => row[pc2])]; 
	const projected = X_std_T.map(row => numeric.dot(row, numeric.transpose(featureVector)));

	const width = 800, height = 600;
	const svg = d3.select(container).append("svg")
		.attr("width", width)
		.attr("height", height);

	const xExtent = d3.extent(projected, d => d[0]);
	const yExtent = d3.extent(projected, d => d[1]);
	const xScale = d3.scaleLinear().domain(xExtent).range([60, width - 40]);
	const yScale = d3.scaleLinear().domain(yExtent).range([height - 40, 40]);

	const types = Array.from(new Set(data.map(d => d.Type)));
	const color = d3.scaleOrdinal().domain(types).range(d3.schemeTableau10);

	svg.selectAll("circle")
		.data(projected)
		.join("circle")
		.attr("cx", d => xScale(d[0]))
		.attr("cy", d => yScale(d[1]))
		.attr("r", 4)
		.attr("fill", (d, i) => color(data[i].Type))
		.attr("opacity", 0.7);

	svg.append("g")
		.attr("transform", `translate(0,${height - 40})`)
		.call(d3.axisBottom(xScale));
	svg.append("g")
		.attr("transform", `translate(60,0)`)
		.call(d3.axisLeft(yScale));

	svg.append("text")
		.attr("x", width / 2)
		.attr("y", height - 5)
		.attr("text-anchor", "middle")
		.style("font-size", "18px")
		.text("PCA 1");

	svg.append("text")
		.attr("transform", `rotate(-90)`)
		.attr("x", -height / 2)
		.attr("y", 20)
		.attr("text-anchor", "middle")
		.style("font-size", "18px")
		.text("PCA 2");

	const legend = svg.append("g")
		.attr("class", "legend")
		.attr("transform", `translate(${width - 180}, 50)`);
	types.forEach((type, i) => {
		legend.append("rect")
			.attr("x", 0)
			.attr("y", i * 22)
			.attr("width", 18)
			.attr("height", 18)
			.attr("fill", color(type));
		legend.append("text")
			.attr("x", 26)
			.attr("y", i * 22 + 14)
			.text(type)
			.style("font-size", "15px");
	});
	const arrowWidth = 700, arrowHeight = 700;
	const arrowDiv = d3.select(container)
		.append("div")
		.style("margin-top", "40px");
	const arrowSvg = arrowDiv.append("svg")
		.attr("width", arrowWidth)
		.attr("height", arrowHeight);

	const arrowScaleX = d3.scaleLinear().domain([-1, 1]).range([60, arrowWidth - 40]);
	const arrowScaleY = d3.scaleLinear().domain([-1, 1]).range([arrowHeight - 60, 40]);
	arrowSvg.append("g")
		.attr("transform", `translate(0,${arrowHeight - 60})`)
		.call(d3.axisBottom(arrowScaleX));
	arrowSvg.append("g")
		.attr("transform", `translate(60,0)`)
		.call(d3.axisLeft(arrowScaleY));

	arrowSvg.append("defs").append("marker")
		.attr("id", "arrowhead")
		.attr("viewBox", "0 0 10 10")
		.attr("refX", 8)
		.attr("refY", 5)
		.attr("markerWidth", 6)
		.attr("markerHeight", 6)
		.attr("orient", "auto")
		.append("path")
		.attr("d", "M 0 0 L 10 5 L 0 10 z")
		.attr("fill", "#ff0202ff");

	attributes.forEach((attr, i) => {
		const x = featureVector[0][i];
		const y = featureVector[1][i];
		arrowSvg.append("line")
			.attr("x1", arrowScaleX(0))
			.attr("y1", arrowScaleY(0))
			.attr("x2", arrowScaleX(x))
			.attr("y2", arrowScaleY(y))
			.attr("stroke", "#af05a1ff")
			.attr("stroke-width", 2)
			.attr("marker-end", "url(#arrowhead)");
		arrowSvg.append("text")
			.attr("x", arrowScaleX(x))
			.attr("y", arrowScaleY(y))
			.attr("dx", 5)
			.attr("dy", 5)
			.text(attr)
			.style("font-size", "13px")
			.style("fill", "#1f77b4");
	});

	arrowSvg.append("text")
		.attr("x", arrowWidth / 2)
		.attr("y", arrowHeight - 5)
		.attr("text-anchor", "middle")
		.style("font-size", "16px")
		.text("PCA 1");
	arrowSvg.append("text")
		.attr("transform", `rotate(-90)`)
		.attr("x", -arrowHeight / 2)
		.attr("y", 20)
		.attr("text-anchor", "middle")
		.style("font-size", "16px")
		.text("PCA 2");
}

const container = document.getElementById("container");
main(container);