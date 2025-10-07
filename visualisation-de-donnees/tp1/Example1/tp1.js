const svg = d3.select("body")
              .append("svg")
              .attr("width",800)
              .attr("height",800)
              .style("background-color","grey")



d3.csv("nc.csv").then(data => {

    let x=30
    let y=20
    data.forEach((d,i) => {
        
       svg.append("circle")
       .attr("cx",x)
       .attr("cy",y)
       .attr("r",15)
       .attr("fill",d.Hex)


    

       svg.append("text")
          .attr("x",x-20)
          .attr("y",y+25)
          .text(d.Name)
          .style("font-size","12px")


       x=x+90;
       if(x>700){
        x=30;
        y=y+80;
       }

    });
    
});
































































// // const svg = d3.select("body")
// //               .append("svg")
// //               .attr("width",500)
// //               .attr("height",500)
// //               .style("background-color","grey")



// // d3.csv("nc.csv").then(data =>{
    
// //     console.log(data)

// // svg.selectALL("circle")
// //    .data(data)
// //    .enter()
// //    .append("circle")
// //    .attr("cx",(d,i) => i*30 +20)
// //    .attr("cy", 50)
// //    .attr("r",5)
// //    .attr("fill" , d => d.Hex )
// // });

// // const svg = d3.select("body")
// //   .append("svg")
// //   .attr("width", 500)
// //   .attr("height", 500)
// //   .style("background-color", "grey");

// // d3.csv("nc.csv").then(data => {
// //   console.log("✅ Données chargées :", data);

// //   svg.selectALL("circle")
// //     .data(data)
// //     .enter()
// //     .append("circle")
// //     .attr("cx", (d, i) => i * 30 + 20)
// //     .attr("cy", 50)
// //     .attr("r", 10)
// //     .attr("fill", d => d.Hex);  // respecte la casse exacte du CSV
// // });



// // const svg = d3.select("body")
// //   .append("svg")
// //   .attr("width", 500)
// //   .attr("height", 500)
// //   .style("background-color", "grey");

// // d3.csv("nc.csv").then(data => {
// //   console.log(data);

// //   svg.selectAll("circle")   // ✅ correct
// //     .data(data)
// //     .enter()
// //     .append("circle")
// //     .attr("cx", (d, i) => i * 30 + 20)
// //     .attr("cy", 50)
// //     .attr("r", 10)
// //     .attr("fill", d => d.Hex);
// // });






// // const svg = d3.select("body")
// //               .append("svg")
// //               .attr("width",500)
// //               .attr("height",500)
// //               .style("background-color","grey")



// // d3.csv("nc.csv").then(data =>{
    
// //     console.log(data)

// // svg.selectAll("circle")
// //    .data(data)
// //    .enter()
// //    .append("circle")
// //    .attr("cx",(d,i) => i<15?i*30 +20:i=1)
// //    .attr("cy", 50)
// //    .attr("r",5)
// //    .attr("fill" , d => d.Hex )
// // });


// // d3.csv("nc.csv").then(data => {
// //   const svg = d3.select("body")
// //                 .append("svg")
// //                 .attr("width", 500)
// //                 .attr("height", 500)
// //                 .style("background-color", "lightgrey");

// //   const groups = chunkArray(data, 15);  // Découpe le CSV en groupes de 15

// //   groups.forEach((group, rowIndex) => {
// //     svg.selectAll(`circle.row${rowIndex}`)
// //        .data(group)
// //        .enter()
// //        .append("circle")
// //        .attr("cx", (d, i) => i * 30 + 20)         // position X
// //        .attr("cy", rowIndex * 30 + 30)            // position Y par ligne
// //        .attr("r", 10)
// //        .attr("fill", d => d.Hex);
// //   });
// // });

// const svg = d3.select("body")
//   .append("svg")
//   .attr("width", 500)
//   .attr("height", 500)
//   .style("background-color", "white");

// d3.csv("nc.csv").then(data => {
//   console.log("✅ Données chargées :", data);

//   const circlesPerRow = 15;   // nombre de cercles par ligne
//   const spacing = 30;         // distance entre cercles

//   svg.selectAll("circle")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("cx", (d, i) => (i % circlesPerRow) * spacing + 20) // colonne
//     .attr("cy", (d, i) => Math.floor(i / circlesPerRow) * spacing + 20) // ligne
//     .attr("r", 10)
//     .attr("fill", d => d.Hex);
// });


// const svg1 = d3.select("body")
//                .append("svg")
//                .attr("width",200)
//                .attr("height",200)
//                .style("background-color","grey")

// d3.csv("nc.csv").then(data => {

//     svg1.selectAll("circle")
//         .data(data)
//         .enter()
//         .append("circle")
//         .attr("cx",(d,i) => i*20)
//         .attr("cy",(d,i) => i*20)
//         .attr("r",7)
//         .attr("fill",d => d.Hex)


// })