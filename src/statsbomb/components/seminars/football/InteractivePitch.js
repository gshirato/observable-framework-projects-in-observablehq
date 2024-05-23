import * as d3 from "npm:d3";
import GeneralChart from "../../../../chart/components/GeneralChart.js";
import _ from "npm:lodash";


export default class InteractivePitch extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.teamId = this.config["teamId"];
        this.teamName = this.config["teamName"];
        this.teamColor = this.config["teamColor"];
        this.soccer = this.config["soccerModule"];
        this.pitch = this.soccer.pitch()
            .height(this.height)
            .rotate(true)
            .clip([[0, 0], [68, 52.5]]);
        this.setAxes();
        this.values = []
    }

    drawPitch(sel) {
        sel
            .append("g")
            .call(this.pitch);
    }

    setAxes() {

        this.sx = d3
            .scaleBand()
            .domain(d3.range(105))
            .range([0, 105]);

        this.sy = d3
            .scaleBand()
            .domain(d3.range(68))
            .range([0, 68]);
    }

    drawSample(sel) {
        const layer = sel.select('#above')
        layer
            .append('g')
            .selectAll('rect')
            .data(d3.range(105 * 68))
            .join('rect')
            .attr('x', (d) => this.sx(d % 105))
            .attr('y', (d) => this.sy(Math.floor(d / 105)))
            .attr('width', this.sx.bandwidth())
            .attr('height', this.sy.bandwidth())
            .attr('fill', '#ccc')
            .attr('opacity', 0.3)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this))
            .on('click', _.partial(this.click, this));
    }

    click(thisClass, event, d) {
        //TODO: make it to a table
        const cell = d3.select(this);

        thisClass.values.push([cell.attr('y'), cell.attr('x')]);
        d3.select(this).attr('fill', 'red').attr('opacity', 0.8);
        d3.select(`${thisClass.rootSelector} .locationList`).html(thisClass.values.map((d, i) => `[${i}] (${d[0]}, ${d[1]})`).join(', \n'));
    }

    mouseover(thisClass, event, d) {
    }

    mousemove(thisClass, event, d) {
        const cell = d3.select(this);
        d3.select(`${thisClass.rootSelector} .currentLocation`).text(`(${cell.attr('y')}, ${cell.attr('x')})`);
    }

    mouseleave(thisClass, event, d) {}

    draw() {
        this.svg.call(this.drawPitch.bind(this));
        this.svg.call(this.drawSample.bind(this));
    };
}