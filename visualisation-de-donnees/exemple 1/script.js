// // let data = [10,90,150]

// // const svg = d3.select("body")
// //               .append("svg")
// //               .attr("width",700)
// //               .attr("height",700)
// //               .style("background-color","#b7afafff")



// // svg.selectAll("circle")
// //    .data(data)
// //    .enter()
// //    .append("circle")
// //    .attr("cx",(d,i) => d+150)
// //    .attr("cy",d => d+100)
// //    .attr("r",30)
// //    .attr("fill",d => d>140?"red" : d>80? "orange" : "green")



// // const svg = d3.select("body")
// //               .append("svg")
// //               .attr("width",300)
// //               .attr("height",300)
// //               .style("background-color","#b7afafff")

// // const group = svg.append("g")
// //                  .attr("transform" , "translate (80,80)");

// // group.append("rect")
// //      .attr("width",100)
// //      .attr("height",50)
// //      .attr("fill", "lightblue");

// // group.append("text")
// //      .attr("x",-5)
// //      .attr("y",60)
// //      .text("je suis dans un groupe")
// //      .style("font-size","14px")
// //      .style("fill","black");


// // const g2=svg.append("g")
// //             .attr("transform" , "translate (180,200)");

// // g2.append("rect")
// //   .attr("width",50)
// //   .attr("height",50)
// //   .attr("fill","black")

// // g2.append("text")
// //   .attr("x",10)
// //   .attr("y",60)
// //   .text("hello ")
// //   .style("fill","blue")
// //   .style("font-size","10px")

  
// // g2.append("circle")
// //   .attr("cx",30)
// //   .attr("cy",30)
// //   .attr("r",10)
// //   .attr("fill","blue")

// // const d=[10,20,30,40,50,60,70,80]

// // const svg3=d3.select("body")
// //              .append("svg")
// //              .attr("width","800")
// //              .attr("height","800")
// //              .style("background-color","#b7afafff")




// // svg3.selectAll("rect")
// //     .data(d)
// //     .enter()
// //     .append("rect")
// //     .attr("width",20)
// //     .attr("height",d => d)
// //     .attr("x",(d,i) => i*30)
// //     .attr("y",d => 800-d)
// //     .style("fill","blue")
  

// // svg3.selectAll("text")
// //     .data(d)
// //     .enter()
// //     .append("text")
// //     .attr("x",(d,i) => i*30+10)
// //     .attr("y",d => 800-d-10)
// //     .text(d => d)
// //     .attr("text-anchor", "middle")
// //     .style("fill" , "black")
   


// const svg=d3.select("body")
//             .append("svg")
//             .attr("width",700)
//             .attr("height",800)
//             .style("background-color","grey")

// svg.append("circle")
//    .attr("cx",80)
//    .attr("cy",80)
//    .attr("r",40)
//    .attr("fill","white")

// svg.append("rect")
//    .attr("x",100)
//    .attr("y",150)
//    .attr("width",50)
//    .attr("height",50)
//    .attr("fill","white")

// const groupe1=svg.append("g")
//                  .attr("transform" , "translate(300,200)")

// groupe1.append("circle")
//        .attr("cx",80)
//        .attr("cy",80)
//        .attr("r",40)
//        .attr("fill","white")

// groupe1.append("rect")
//        .attr("x",100)
//        .attr("y",150)
//        .attr("width",50)
//        .attr("height",50)
//        .attr("fill","white")




// let data=[10,20,30,40,50,60,70,80]

// groupe1.selectAll("circle")
//        .data(data)
//        .enter()
//        .append("circle")
//        .attr("cx",(d,i) => i*50)
//        .attr("cy",400)
//        .attr("r",20)
//        .attr("fill","white")



// d3.csv("nc").then(data =>{
//     console.log(data)
// })
const svg = d3.select("body")
              .append("svg")
              .attr("width",500)
              .attr("height",500)
              .style("background-color","grey")
