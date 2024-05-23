import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../chart/components/GeneralChart.js";

export default class Episode extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
    }

    setAxes() {

    }


    drawEpisode(sel) {
        sel
            .append('g')
            .append('text')
            .datum(this.data)
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('font-family', 'sans-serif')
            .attr('x', this.margin.left)
            .attr('y', this.margin.top)
            .text(d => `${d.Title} (#${d.Number})`)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this))

        sel
            .append('g')
            .append('text')
            .datum(this.data)
            .attr('font-size', '15px')
            .attr('font-family', 'sans-serif')
            .attr('x', this.margin.left)
            .attr('y', this.margin.top)
            .attr('dy', '1.5em')
            .text(d => `${Object.keys(d.Starr)}`)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this))

        sel
            .append('g')
            .selectAll('text')
            .data(this.data.Topics)
            .join('text')
            .attr('font-size', '15px')
            .attr('font-family', 'sans-serif')
            .attr('x', this.margin.left)
            .attr('y', this.margin.top)
            .attr('dy', (d, i) => `${i + 3}em`)
            .text(d => d)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this))
    }

    draw() {
        this.svg.call(this.drawEpisode.bind(this));
    }

    mouseover(thisClass, event, d) {

        function makeReferences(references) {
            return Object.entries(references).map(([key, value]) => {
                return `<a href="${value}" target="_blank">${key}</a>`
            }).join('<br>')
        }

        const references = thisClass.data.References

        thisClass.tooltip.setText(makeReferences(references))
      thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
        thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }
}