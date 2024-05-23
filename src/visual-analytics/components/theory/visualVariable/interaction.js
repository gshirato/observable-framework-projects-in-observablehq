import * as d3 from "npm:d3";



function formatTime(d) {
    return `${d.minute.toString().padStart(2, '0')}:${d.second.toString().padStart(2, '0')}`
}

export function mouseover(thisClass, event, d) {
    thisClass.defaultColors = d3.selectAll(`.${thisClass.createClass(d)}`).nodes().map(n=>n.getAttribute('fill'))
    thisClass.defaultOpacities = d3.selectAll(`.${thisClass.createClass(d)}`).nodes().map(n=>n.getAttribute('opacity'))

    d3.selectAll(`.${thisClass.createClass(d)}`)
        .raise().attr('fill', 'red').attr('opacity', 1)
    thisClass.tooltip.show(event, d);

    console.log(d3.selectAll(`.${thisClass.createClass(d)}-motion`).node())
    d3.selectAll(`.${thisClass.createClass(d)}-motion`)
        .call(repeat.bind(thisClass));
}

export function  mousemove(thisClass, event, d) {
    thisClass.tooltip.setText(`[${formatTime(d)}] <b>${d.player.name}</b> (${d.team.name})<br>xG: ${d.shot.statsbomb_xg.toFixed(2)} → ${d.shot.outcome.name} (${d.shot.technique.name} )`)
    thisClass.tooltip.move(event, d);
}

export function  mouseleave(thisClass, event, d) {
    d3.selectAll(`.${thisClass.createClass(d)}`)
        .attr('fill', (_, i) => thisClass.defaultColors[i])
        .attr('opacity', (_, i) => thisClass.defaultOpacities[i])
    thisClass.tooltip.hide(event, d);
}

export function repeat(sel) {
    const sx = d3.scaleLinear().domain([0, 120]).range([0, 105]);
    const sy = d3.scaleLinear().domain([0, 80]).range([0, 68]);
    sel
        .attr("cx", (d) => sx(d.location[0]))
        .attr("cy", (d) => sy(d.location[1]))
        .transition()
        .duration(d => d.duration * 1000)
        .attr("cx", (d) => sx(d.shot.end_location[0]))
        .attr("cy", (d) => sy(d.shot.end_location[1]))
}