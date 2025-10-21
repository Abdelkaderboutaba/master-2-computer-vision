const svg = d3.select("body")
              .append("svg")
              .attr("height",1000)
              .attr("width",1000)
              .style("background-color","grey")




d3.csv("d.csv").then(data => {


    const groupe=svg.append("g")
                .attr("transform" , "translate(70,70)")

    const yscale=d3.scaleLinear()
               .domain([0,d3.max(data,d => d.Value)])
               .range([500,0])

    const xscale=d3.scaleBand()
               .domain(data.map(d=>d.id))
               .range([0,800])
               .padding(0.3)
    
    const axeygroupe=groupe.append("g")
                     .attr("transform" , "translate(0,0)")
                     .call(d3.axisLeft(yscale))
    const axexgroupe=groupe.append("g")
                           .attr("transform" , "translate(0,500)")
                           .call(d3.axisBottom(xscale))

    groupe.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("y",d => yscale(d.Value))
          .attr("x",d=>xscale(d.id))
          .attr("height",d=> 500-yscale(d.Value))
          .attr("width",xscale.bandwidth())
          .attr("fill","red")
    
    groupe.append("text")
              .attr("x",500)
              .attr("y",500)
              .text("(id)")
              .attr("font-size","20px")
    
    groupe.append("text")
              .attr("x",0)
              .attr("y",0)
              .text("(value)")
              .attr("font-size","20px")
})



