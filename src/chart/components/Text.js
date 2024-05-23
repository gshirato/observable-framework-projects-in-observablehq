import getAttr from './getAttr.js';

export default function drawText(sel, config) {
    sel
        .selectAll('text')
        .data(config.data)
        .join('text')
        .attr('x', getAttr(config, 'x'))
        .attr('y', getAttr(config, 'y'))
        .attr('dx', getAttr(config, 'dx', 0))
        .attr('dy', getAttr(config, 'dy', 0))
        .attr('fill', getAttr(config, 'fill', 'black'))
        .attr('stroke', getAttr(config, 'stroke', 'none'))
        .attr('opacity', getAttr(config, 'opacity', 1))
        .attr("text-anchor", getAttr(config, 'text-anchor', 'start'))
        .attr("font-size", getAttr(config, 'font-size', '12px'))
        .attr("font-weight", getAttr(config, 'font-weight', 'normal'))
        .attr("font-family", getAttr(config, 'font-family', 'sans-serif'))
        .attr('pointer-events', getAttr(config, 'pointer-events', 'none'))
        .attr('writing-mode', getAttr(config, 'writing-mode', ''))
        .text(getAttr(config, 'text', ''))
}
