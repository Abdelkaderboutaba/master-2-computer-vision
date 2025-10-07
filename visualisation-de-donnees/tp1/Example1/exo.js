const svg =d3.select("body")
  .append("svg")
  .attr("width",800)
  .attr("height",800)
  .style("background-color","grey")

// // d3.csv("mon.csv").then(data => {

// //     data.forEach((d,i) => {
// //         svg.append("rect")
// //            .attr("x",i*50)
// //            .attr("y",800-d.Value)
// //            .attr("width",20)
// //            .attr("height",d.Value)
// //            .attr("fill","blue")

// //         svg.append("text")
// //            .attr("x",i*50)
// //            .attr("y",800-d.Value-5)
// //            .text(d.Country)
// //            .attr("font-size","10px")
        

// //     });


       
// })

const groupe = svg.append("g")
                  .attr("transform" , "translate(200,200)")
    
groupe.append("circle")
      .attr("cx",0)
      .attr("cy",0)
      .attr("r",20)
      .attr("fill","red")
groupe.append("text")
      .attr("x",-9)
      .attr("y",19)
      .attr("font-size","10px")
      .text("cicle")


let data = [10,20,30,40,50] 

const groups = svg.selectAll("g")
                  .data(data)
                  .enter()
                  .append("g")
                  .attr("transform" , (d,i) => `translate(${i*50},300)`)

groups.append("rect")
      .attr("width",20)
      .attr("height",d => d)
      .attr("fill" , "black")

d3.csv("nc.csv").then(data => {
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx",(d,i) => i*20)
       .attr("cy",(d,i) => i*10 )
       .attr("r",5)
       .attr("fill" , "red")
       

})