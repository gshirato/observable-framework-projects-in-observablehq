import getAttr from './getAttr.js';

export default function drawLine(sel, config) {
    sel
        .selectAll('line')
        .data(config.data)
        .join('line')
        .attr('x1', getAttr(config, 'x1'))
        .attr('y1', getAttr(config, 'y1'))
        .attr('x2', getAttr(config, 'x2'))
        .attr('y2', getAttr(config, 'y2'))
        .attr('fill', getAttr(config, 'fill', 'black'))
        .attr('stroke', getAttr(config, 'stroke', 'none'))
        .attr('stroke-dasharray', getAttr(config, 'stroke-dasharray', ''))
        .attr('opacity', getAttr(config, 'opacity', 1))
        .attr("text-anchor", getAttr(config, 'text-anchor', 'middle'))
        .attr("font-size", getAttr(config, 'font-size', '12px'))
        .attr("font-weight", getAttr(config, 'font-weight', 'normal'))
        .attr("font-family", getAttr(config, 'font-family', 'sans-serif'))
        .attr('pointer-events', getAttr(config, 'pointer-events', 'none'))
        .text(getAttr(config, 'text', ''))
}
