const svg=d3.select("body")
            .append("svg")
            .attr("height",1000)
            .attr("width",1000)
            .style("background-color","grey")


d3.csv("us.csv").then(data =>{

    data = data.slice(9,25)

    const groupe=svg.append("g")
               .attr("transform" , "translate(200,100)")

    const xscale=d3.scaleLinear()
                   .domain([0,d3.max(data,d=>d.population)])
                   .range([0,500])
    
    const yscale=d3.scaleBand()
                   .domain(data.map(d=>d.place))
                   .range([0,500])
                   .padding(0.2)
    
    groupe.append("g")
      .attr("transform" , "translate(0,0)")
      .call(d3.axisLeft(yscale))
    
    groupe.append("g")
          .attr("transform","translate(0,500)")
          .call(d3.axisBottom(xscale))

    groupe.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx",d => xscale(d.population))
          .attr("cy",d => yscale(d.place)+16)
          .attr("r",5)
          .attr("fill","red")

    groupe.append("text")
          .attr("x",10)
          .attr("y",0)
          .text("(place)")
          .attr("font-size","20px")

    groupe.append("text")
          .attr("x",500)
          .attr("y",500)
          .text("(population)")
          .attr("font-size","20px")
          
    
})


