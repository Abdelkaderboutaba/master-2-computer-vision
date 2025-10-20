const svg = d3.select("body")
              .append("svg")
              .attr("width",1500)
              .attr("height",1500)
              .style("background-color","grey")


const gr = svg.append("g")
              .attr("transform","translate(70,70)")




d3.csv("us.csv").then(data => {

    data=data.slice(9,25)

    const yscale = d3.scaleLinear()
                     .domain([0,d3.max(data,d => d.population)])
                     .range([0,700])

    const xscale=d3.scaleBand()
                   .domain(data.map(d => d.place))
                   .range([0,600])
                   .padding(0.5)
    
    gr.append("g")
      .attr("transform" , "translate(0,0)")
      .call(d3.axisLeft(yscale))

    gr.append("g")
      .attr("transform","translate(0,700)")
      .call(d3.axisBottom(xscale))

    // gr.selectAll("rect")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("x",d => xscale(d.place))
    //   .attr("y",d =>700 - yscale(d.population))
    //   .attr("height",d => yscale(d.population))
    //   .attr("width",xscale.bandwidth)
    //   .attr("fill" , "steelblue")

    gr.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx",d=>xscale(d.place))
      .attr("cy",d=>700-yscale(d.population))
      .attr("r",10)
      .attr("fill","red")




})