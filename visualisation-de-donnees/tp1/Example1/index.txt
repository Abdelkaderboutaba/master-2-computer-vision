const main = (container) => {
    const svg = d3.select(container)
                  .selectAll('svg')
                  .data([null])
                  .join('svg')
                  .attr('width', 960)
                  .attr('height', 500);
    svg.style('background-color', 'grey');

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const faceGroup = svg.append('g')
                      .attr('transform', `translate(${width/2}, ${height/2})`);

    const face = faceGroup.append('circle');
    face.attr('stroke', 'black')
        .attr('stroke-width', '5')
        .attr('r', height/2 - face.attr('stroke-width'))    
        .attr('fill', 'yellow');

    const eyesGroup = faceGroup.append('g')
                                .attr('transform', 'translate(0, -60)');

    const leftEye = eyesGroup.append('circle')
                            .attr('r', 30)
                            .attr('cx', -80);
        
    const rightEye = eyesGroup.append('circle')
                            .attr('r', 30)
                            .attr('cx', 80);

    const leftEyeBrow = eyesGroup.append('line')
                            .attr('x1', +leftEye.attr('cx')-50)
                            .attr('y1', -80)
                            .attr('x2', +leftEye.attr('cx')+50)
                            .attr('y2', -80)
                            .attr('stroke-width', '5')
                            .attr('stroke', 'black');

    const rightEyeBrow = eyesGroup.append('line')
                            .attr('x1', +rightEye.attr('cx')-50)
                            .attr('y1', -80)
                            .attr('x2', +rightEye.attr('cx')+50)
                            .attr('y2', -80)
                            .attr('stroke-width', '5')
                            .attr('stroke', 'black');

    const mouth_arc = d3.arc()
                        .innerRadius(+face.attr('r')-60)
                        .outerRadius(+face.attr('r')-70)
                        .startAngle(Math.PI/2)
                        .endAngle(3*Math.PI/2);

    const mouth = faceGroup.append('path')
                            .attr('d', mouth_arc()); 
}
const container = document.getElementById('container');
main(container);