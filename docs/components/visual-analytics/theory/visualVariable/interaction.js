import * as d3 from "npm:d3";

export function mouseover(thisClass, event, d) {
    thisClass.defaultColors = d3.selectAll(`.${thisClass.createClass(d)}`).attr('fill')
    d3.selectAll(`.${thisClass.createClass(d)}`)
        .raise()
        .attr('fill', 'red')
    thisClass.tooltip.show(event, d);
}

export function  mousemove(thisClass, event, d) {
    thisClass.tooltip.setText(`[${thisClass.formatTime(d)}] <b>${d.player.name}</b> (${d.team.name})<br>xG: ${d.shot.statsbomb_xg.toFixed(2)} → ${d.shot.outcome.name} (${d.shot.technique.name} )`)
    thisClass.tooltip.move(event, d);
}

export function  mouseleave(thisClass, event, d) {
    d3.selectAll(`.${thisClass.createClass(d)}`).attr('fill', thisClass.defaultColors)
    thisClass.tooltip.hide(event, d);
}