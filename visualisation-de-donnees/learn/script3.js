const svg = d3.select("body")
              .append("svg")
              .attr("width",500)
              .attr("height",500)
              .style("background-color","grey")




const groupe1 = svg.append("g")
                   .attr( "transform" , "translate(20,50)")




d3.csv("us.csv").then(data => {

    p=[1,2,3,4,5,6,7,8]


    groupe1.selectAll("rect")
           .data(data)
           .enter()
           .append("rect")
           .attr("height",10)
           .attr("width",d => d.population/10000)
           .attr("y",(d,i) => i*20+10)
           .attr("fill","blue")

    
    const svg1 = d3.select("body")
                   .append("svg")
                   .attr("height",200)
                   .attr("width",200)
                   .style("background-color","grey")
    width=200
    height=200
    
    svg1.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y",(d,i) => i*20 +10 )
        .attr("height",5)
        .attr("width",d => d.population/100000)
        .attr("fill","blue")
    
    
    const svg2=d3.select("body")
                 .append("svg")
                 .attr("height",100)
                 .attr("width",100)
                 .style("background-color","grey")

    const groups=svg2.selectAll("g")
                   .data(p)
                   .enter()
                   .append("g")
                   .attr("transform" , (d,i) =>`translate(${i*10+20},50)`)
    
    groups.append("circle")
          .attr("r",2)
          .attr("fill","steelblue")
    
    
    
    
    
    
})