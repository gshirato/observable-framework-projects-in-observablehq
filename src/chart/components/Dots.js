import getAttr from './getAttr.js';

export default function drawDots(sel, config) {
    sel
        .selectAll('circle')
        .data(config.data)
        .join('circle')
        .attr('cx', getAttr(config, 'cx'))
        .attr('cy', getAttr(config, 'cy'))
        .attr('r', getAttr(config, 'r', 1))
        .attr('fill', getAttr(config, 'fill', 'black'))
        .attr('stroke', getAttr(config, 'stroke', 'none'))
        .attr('opacity', getAttr(config, 'opacity', 1))
}
