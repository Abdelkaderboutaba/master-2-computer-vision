const svg = d3.select("body")
              .append("svg")
              .attr("height",500)
              .attr("width",500)
              .style("background-color","black")


const group1= svg.append("g")
                 .attr("transform" , "translate(100,200)")
    
group1.append("circle")
      .attr("cx",0)
      .attr("cy",0)
      .attr("r",20)
      .attr("fill","white")
    




d3.csv("mon.csv").then(data =>{

    let xpadding=100
    let ypadding=20

    group1.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x",0 )
       .attr("y",(d,i) => i*20+ypadding)
       .attr("height",10)
       .attr("width",d =>d.Value)
       .attr("fill","white")
    

    
    
    

    
    


    
    
})


