// const svg = d3.select("body")
//               .append("svg")
//               .attr("width",800)
//               .attr("height",800)
//               .style("background-color","grey")

// xpadding=50
// ypading=50



// // const xaxis=d3.axixBotton(xscale)

// const g1 = svg.append("g")
//               .attr("transform" ,  "translate(50,30)");



// d3.csv("us.csv").then(data => {


//     const xscale = d3.scaleLinear()
//                  .domain([0,d3,max(data,(d) => +d.population)])
//                  .range([xpadding,800-xpadding])

//     const yscale=d3.scaleLinear()
//                    .domain(data.map(d =>d.place))
//                    .range([xpadding,800-xpadding])
//                    .padding(0.1);


//     g1.selectAll("rect")
//        .data(data)
//        .enter()
//        .append("rect")
//        .attr("x",50)
//        .attr("y",(d,i) => i*30+10)
//        .attr("height",20)
//        .attr("width",d => xscale(d.population)-xpadding)
//        .attr("fill" , "blue")
// })



const svg = d3.select("body")
  .append("svg")
  .attr("width", 800)
  .attr("height", 800)
  .style("background-color", "lightgrey");

const xpadding = 50;
const ypadding = 50;

const g1 = svg.append("g")
  .attr("transform", "translate(50,30)");

d3.csv("us.csv").then(data => {

    data=data.slice(0,20)

  
//   data.forEach(d => d.population = +d.population);


  const xscale = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.population)])
    .range([50, 1200]);  

  
  const yscale = d3.scaleBand()
    .domain(data.map(d => d.place))
    .range([xpadding, 500])
    .padding(0.2);

  g1.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", xpadding)
    .attr("y", d => yscale(d.place))
    .attr("height", yscale.bandwidth())
    .attr("width", d => xscale(+d.population) - xpadding)
    .attr("fill", "steelblue");

  g1.append("g")
    .attr("transform", "translate(0,700)")
    .call(d3.axisBottom(xscale));
  
//   g1.append("text")
//     .attr("x")
//     .attr()

  g1.append("g")
    .attr("transform", "translate(50,0)")
    .call(d3.axisLeft(yscale));

    // d3.axisBOttom(xscale)
    // d3.axisleft(yscale)
});
