const svg = d3.select("body")
              .append("svg")
              .attr("height",800)
              .attr("width",800)
              .style("background-color","grey")




d3.csv("d.csv").then(data => {


    const groupe=svg.append("g")
                .attr("transform" , "translate(70,70)")

    const xscale=d3.scaleLinear()
               .domain(0,d3.max(data,d => d.Value))
               .range(0,500)

    const yscale=d3.scaleBand()
               .domain(data.map(d=>d.id))
               .range(0,500)
    
    const axeygroupe=groupe.append("g")
                     .attr("trnasform" , "translate(0,0)")
                     .call(d3.axisLeft(yscale))
    const axexgroupe=groupe.append("g")
                           .attr("transform" , "translate(0,500)")
                           .call(d3.axisBottom(xscale))
            
})



