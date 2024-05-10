import * as d3 from "npm:d3";
import GeneralChart from "../../GeneralChart.js";
import _ from "npm:lodash";


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
                .range(['black', '#fc8d59'])
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

    formatTime(d) {
        return `${d.minute.toString().padStart(2, '0')}:${d.second.toString().padStart(2, '0')}`;
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

    drawEvents(sel) {
        const layer = sel.select('#above')

        layer.append('g')
            .selectAll('line')
            .data(this.data)
            .join('line')
            .attr('x1', d=>this.sx(d.location[0]))
            .attr('y1', d=>this.sy(d.location[1]))
            .attr('x2', d=>this.sx(d.pass.end_location[0]))
            .attr('y2', d=>this.sy(d.pass.end_location[1]))
            .attr('class', d=>'pass-zone' + this.area(d.location, this.zones))
            .attr('stroke', this.teamColor)
            .attr('pointer-events', 'none')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.5)

        layer.append('g')
            .selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('cx', d=>this.sx(d.location[0]))
            .attr('cy', d=>this.sy(d.location[1]))
            .attr('stroke', this.teamColor)
            .attr('class', d=>'pass-zone' + this.area(d.location, this.zones))
            .attr('pointer-events', 'none')
            .attr('r', 0.5)
            .attr('opacity', 0.5)



    }

    drawZones(sel) {
        const layer = sel.select('#above')
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
        d3.selectAll('line')
            .attr('opacity', 0.1)
        d3.selectAll('circle')
            .attr('opacity', 0.1)
        d3.selectAll(`.pass-${zone}`)
            .attr('opacity', 1)
        thisClass.tooltip.show(event, d);
    }
    mousemove(thisClass, event, d) {
        thisClass.tooltip.setText(
            `[${d.index - d3.min(thisClass.data, d=>d.index)}] ${thisClass.formatTime(d)} ${d.player.name} (${d.possession_team.name}) <br> ${d.type.name}`
          );
          thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
        d3.selectAll('line')
            .attr('opacity', 0.5)
        d3.selectAll('circle')
            .attr('opacity', 0.5)
        thisClass.tooltip.hide(event, d);
    }

    draw() {
        this.setAxes();
        this.svg.call(this.drawPitch.bind(this));
        this.svg.call(this.drawWatermark.bind(this));
        this.svg.call(this.drawZones.bind(this));
        this.svg.call(this.drawEvents.bind(this));
    }
}