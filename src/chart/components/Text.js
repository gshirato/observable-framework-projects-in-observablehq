export default function drawDots(sel, config) {
    sel
        .selectAll('text')
        .data(config.data)
        .join('text')
        .attr('x', config.x)
        .attr('y', config.y)
        .attr('fill', config.fill)
        .attr('stroke', config.stroke)
        .attr('opacity', config.opacity)
        .attr("text-anchor", config['text-anchor'])
        .attr("font-size", config['font-size'])
        .attr("font-weight", config['font-weight'])
        .attr('pointer-events', config['pointer-events'])
        .text(config.text)
}
