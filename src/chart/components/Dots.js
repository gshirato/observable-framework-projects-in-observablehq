export default function drawDots(sel, config) {
    sel
        .selectAll('circle')
        .data(config.data)
        .join('circle')
        .attr('cx', config.cx)
        .attr('cy', config.cy)
        .attr('r', config.r)
        .attr('fill', config.fill)
        .attr('stroke', config.stroke)
        .attr('opacity', config.opacity)
}
