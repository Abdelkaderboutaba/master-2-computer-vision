const svg = d3.select("body")
              .append("svg")
              .attr("height", 1000)
              .attr("width", 1500)
              .style("background-color", "grey");

const group1 = svg.append("g")
                  .attr("transform", "translate(150,50)");

group1.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 20)
      .attr("fill", "white");

d3.csv("us.csv").then(data => {


    data=data.slice(9,25)


    let ypadding = 20;

    // // 1️⃣ Convertir la population en nombre
    // data.forEach(d => {
    //     d.population = +d.population;
    // });

   
    const xscale= d3.scaleLinear()
                    .domain([0,d3.max(data,d => d.population)])
                    .range([0,800])


    const yscale =d3.scaleBand()
                    .domain(data.map(d => d.place))
                    .range([0,700])
                    .padding(0.5)
    
    

    // // 3️⃣ Créer les barres
    // group1.selectAll("rect")
    //       .data(data)
    //       .enter()
    //       .append("rect")
    //       .attr("x", 0)
    //       .attr("y", d => yscale(d.place))
    //       .attr("height", yscale.bandwidth())
    //       .attr("width", d => xscale(d.population))
    //       .attr("fill", "steelblue");

    group1.append("g")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yscale));

    group1.append("g")
    .attr("transform", "translate(0,700)")
    .call(d3.axisBottom(xscale));
 
    group1.append("text")
          .attr("x",20)
          .attr("y",0)
          .text("(place)")
          .attr("font-size","30px")
    
});
