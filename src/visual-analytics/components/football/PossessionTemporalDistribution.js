import * as d3 from "npm:d3";
import GeneralChart from "../../GeneralChart.js";
import _ from "npm:lodash";


export default class PossessionTimeSeriesChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.period = config['period'];
        this.homeTeamId = config['homeTeamId'];
        this.awayTeamId = config['awayTeamId'];
        this.homeColor = config['homeColor'];
        this.awayColor = config['awayColor'];
        this.data = this.filterData(this.data).flat();


        this.setAxes();
        this.histHome = this.getHistogram(this.data.filter(d=>d.possession_team.id==this.homeTeamId));
        this.histAway = this.getHistogram(this.data.filter(d=>d.possession_team.id==this.awayTeamId));
    }

    getDurations(data) {
        const extent = d3.extent(data, d=>this.parseTime(d.timestamp));
        return extent.map(d=>d[1]-d[0]);
    }

    getHistogram(data) {
        const histogram = d3
            .histogram()
            .value(d=>this.parseTime(d.timestamp))
            .domain(this.sx.domain())
            .thresholds(d3.timeMinute.every(5).range(...this.sx.domain()));
        return histogram(data);
    }

    parseTime(time) {
        return d3.timeParse('%H:%M:%S.%f')(time);
    }

    setAxes() {
        this.sx = d3
            .scaleTime()
            .domain([this.parseTime("00:00:00.000"), this.parseTime("00:57:00.000")])
            .range([this.margin.left, this.width - this.margin.right]);

        this.sy = d3
            .scaleLinear()
            .domain([-200, 200])
            .range([this.height - this.margin.bottom, this.margin.top])

        this.sc = d3
            .scaleOrdinal()
            .domain([this.homeTeamId, this.awayTeamId])
            .range([this.homeColor, this.awayColor])
    }

    drawAxes() {
        const xAxis = d3.axisBottom(this.sx)
            .tickFormat(d3.timeFormat('%M:%S'));
        this.svg
            .append('g')
            .attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
            .call(xAxis);


        const yAxis = d3.axisLeft(this.sy).tickFormat(d=>Math.abs(d));
        this.svg
            .append('g')
            .attr('transform', `translate(${this.margin.left}, 0)`)
            .call(yAxis);
    }

    mouseover(thisClass, event, d) {
        thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
        thisClass.tooltip.setText(`${d[0].possession_team.name} -> ${d.slice(-1)[0].type.name}`)
        thisClass.tooltip.move(event, d);
    }

    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }

    filterData(data) {
        return data
            .map(
                possession=>(
                    possession[1]
                        .filter(d=>d.period === this.period)
                        .filter(d=>d.possession_team.id === d.team.id)
                ))
            .filter(d=>d.length>0)
    }


    drawHistogram() {
        this.svg
            .append('g')
            .selectAll('rect')
            .data(this.histHome)
            .join('rect')
            .attr('x', d=>this.sx(d.x0))
            .attr('y', d=>this.sy(d.length))
            .attr('width', d=>this.sx(d.x1) - this.sx(d.x0))
            .attr('height', d=>this.sy(0) - this.sy(d.length))
            .attr('fill', this.homeColor)

        this.svg
            .append('g')
            .selectAll('rect')
            .data(this.histAway)
            .join('rect')
            .attr('x', d=>this.sx(d.x0))
            .attr('y', d=>this.sy(0))
            .attr('width', d=>this.sx(d.x1) - this.sx(d.x0))
            .attr('l', d=>console.log(d.length))
            .attr('height', d=>this.sy(0) - this.sy(d.length))
            .attr('fill', this.awayColor)
    }

    drawTitle() {
        this.svg
            .append('text')
            .attr('x', this.width/2)
            .attr('y', this.margin.top)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .text(['1st Half', '2nd Half'][this.period-1])
    }

    draw() {
        this.drawAxes();
        this.drawHistogram();
        this.drawTitle();
    }
}