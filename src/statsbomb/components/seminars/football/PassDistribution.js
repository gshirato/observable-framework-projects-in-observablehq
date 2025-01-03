import * as d3 from "npm:d3";
import GeneralChart from "../../../../chart/components/GeneralChart.js";
import _ from "npm:lodash";
import zones from "./zones.js";

export default class PassDistributionChart extends GeneralChart {
    constructor(data, selector, config) {
    super(data, selector, config);
    this.teamId = this.config["teamId"];
    this.teamName = this.config["teamName"];
    this.teamColor = this.config["teamColor"];
    this.soccer = this.config["soccerModule"];
    this.pitch = this.soccer.pitch()
        .height(this.height)
        .showDirOfPlay(true)
        .clip([[-10, -10], [115, 78]]);

    this.zones = zones;
    this.type = this.config["type"]
    this.colorMapType = this.config['colorMapType'] || 'outcome'
    }

    getColorMap() {
        if (this.colorMapType === 'team') {
            return d3.scaleOrdinal()
                .domain([this.teamId])
                .range([this.teamColor])
        }
        if (this.colorMapType === 'outcome') {
            return d3.scaleOrdinal()
                .domain([true, false])
                .range(['#1b9e77', '#d95f02'])
        }
        console.error(new Error(`Unknown colorMapType: ${this.colorMapType}`));
    }

    setAxes() {
        this.sx = d3
            .scaleLinear()
            .domain([0, 120])
            .range([0, 105]);

        this.sy = d3
            .scaleLinear()
            .domain([0, 80])
            .range([0, 68]);

        this.sc = this.getColorMap();

        this.svg.append("g")
          .append('text')
          .attr('x', this.pitch.width() / 2)
          .attr('y', this.margin.top - 5)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'bottom')
          .style('font-size', 16)
          .text(`${this.teamName} (Attacking→)`)
    }

    drawPitch(sel) {
      sel.append("g")
        .call(this.pitch)
    }
    drawWatermark(sel) {
      sel
        .append("image")
        .attr(
          "xlink:href",
          "https://dtai.cs.kuleuven.be/sports/static/ee39fa2918398059e9be62c32c1b48c4/74404/statsbomb_logo.png"
        )
        .attr("opacity", 0.2)
        .attr("x", this.pitch.width() - this.margin.right - 200)
        .attr("y", this.pitch.height() - 30)
        .attr("width", 200);
    }

    area(location, zones) {
        for (let i = 0; i < zones.length; i++) {
            const zone = zones[i];
            if (this.sx(location[0]) >= zone[0] && this.sx(location[0]) <= zone[2] && this.sy(location[1]) >= zone[1] && this.sy(location[1]) <= zone[3]) {
                return i;
            }
        }
        console.error(new Error('Location not in any zone:' + location));
    }

    createClass(d) {
        if (this.type === 'origin') {
            return `pass-zone${this.area(d.location, this.zones)}`;
        }
        if (this.type === 'destination') {
            return `pass-zone${this.area(d.pass.end_location, this.zones)}`;
        }
    }

    drawEvents(sel) {
        function color(d) {
            if (this.colorMapType === 'team') {
                return this.sc(d.team.id);
            }
            if (this.colorMapType === 'outcome') {
                return this.sc(d.pass.outcome == null);
            }
            return null;
        }

        const layer = sel.select('.above')

        layer.append('g')
            .selectAll('line')
            .data(this.data)
            .join('line')
            .attr('x1', d=>this.sx(d.location[0]))
            .attr('y1', d=>this.sy(d.location[1]))
            .attr('x2', d=>this.sx(d.pass.end_location[0]))
            .attr('y2', d=>this.sy(d.pass.end_location[1]))
            .attr('class', d=>this.createClass(d))
            .attr('stroke', d=>color.bind(this)(d))
            .attr('pointer-events', 'none')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.5)

        layer.append('g')
            .selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('cx', d=>this.sx(d.location[0]))
            .attr('cy', d=>this.sy(d.location[1]))
            .attr('stroke', d=>color.bind(this)(d))
            .attr('class', d=>this.createClass(d))
            .attr('pointer-events', 'none')
            .attr('r', 0.5)
            .attr('opacity', 0.5)
    }



    drawZones(sel) {
        const layer = sel.select('.above')
        layer.append('g')
            .selectAll('rect')
            .data(this.zones)
            .join('rect')
            .attr('x', d=>d[0])
            .attr('y', d=>d[1])
            .attr('class', (_, i)=>`zone${i}`)
            .attr('width', d=>d[2] - d[0])
            .attr('height', d=>d[3] - d[1])
            .attr('stroke', '#444')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', '2,2')
            .attr('fill', '#fefefe')
            .attr('opacity', 0.5)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this))
    }

    mouseover(thisClass, event, d) {
        const zone = d3.select(this).attr('class')
        d3.selectAll(`${thisClass.rootSelector} line`)
            .attr('opacity', 0.1)
        d3.selectAll(`${thisClass.rootSelector} circle`)
            .attr('opacity', 0.1)
        d3.selectAll(`${thisClass.rootSelector} .pass-${zone}`)
            .attr('opacity', 1)
    }
    mousemove(thisClass, event, d) {
    }
    mouseleave(thisClass, event, d) {
        d3.selectAll(`${thisClass.rootSelector} line`)
            .attr('opacity', 0.5)
        d3.selectAll(`${thisClass.rootSelector} circle`)
            .attr('opacity', 0.5)

    }

    draw() {
        this.setAxes();
        this.svg.call(this.drawPitch.bind(this));
        this.svg.call(this.drawWatermark.bind(this));
        this.svg.call(this.drawZones.bind(this));
        this.svg.call(this.drawEvents.bind(this));
    }
}