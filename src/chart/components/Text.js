import getAttr from './getAttr.js';

export default function drawDots(sel, config) {
    sel
        .selectAll('text')
        .data(config.data)
        .join('text')
        .attr('x', getAttr(config, 'x'))
        .attr('y', getAttr(config, 'y'))
        .attr('fill', getAttr(config, 'fill', 'black'))
        .attr('stroke', getAttr(config, 'stroke', 'none'))
        .attr('opacity', getAttr(config, 'opacity', 1))
        .attr("text-anchor", getAttr(config, 'text-anchor', 'middle'))
        .attr("font-size", getAttr(config, 'font-size', '12px'))
        .attr("font-weight", getAttr(config, 'font-weight', 'normal'))
        .attr("font-family", getAttr(config, 'font-family', 'sans-serif'))
        .attr('pointer-events', getAttr(config, 'pointer-events', 'none'))
        .text(getAttr(config, 'text', ''))
}
