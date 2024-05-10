import * as d3 from "npm:d3";
import GeneralChart from "../../GeneralChart.js";
import _ from "npm:lodash";


export default class PossessionTimeSeriesChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.data = this.filterData(this.data);
        this.homeTeamId = config['homeTeamId'];
        this.awayTeamId = config['awayTeamId'];
        this.homeColor = config['homeColor'];
        this.awayColor = config['awayColor'];
        this.data.map(d=>console.log(d))

        this.timestamps = this.data.map(possession=>(possession.map(d=>this.parseTime(d.timestamp))))
        this.periods = this.data.map(possession=>(possession.map(d=>d.period)))
    }

    parseTime(time) {
        return d3.timeParse('%H:%M:%S.%f')(time);
    }

    setAxes() {
        this.sx = d3
            .scaleTime()
            .domain([d3.min(this.timestamps, d => d3.min(d)), d3.max(this.timestamps, d => d3.max(d))])
            .range([this.margin.left, this.width - this.margin.right]);

        this.sy = d3
            .scaleBand()
            .domain([1, 2])
            .range([this.margin.top, this.height - this.margin.bottom])
            .paddingInner(0.1)
            .paddingOuter(0.1);
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


        const yAxis = d3.axisLeft(this.sy)
            .tickFormat(d => ['1st', '2nd'][d - 1]);
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
                    possession[1].filter(d=>!["Substitution", "Half Start"].includes(d.type.name))
                ))
            .filter(d=>d.length>0)
    }


    drawTS() {
        this.svg
            .append('g')
            .selectAll('rect')
            .data(this.data)
            .join('rect')
            .attr('x', (d, i) => this.sx(d3.min(this.timestamps[i])))
            .attr('y', (d, i) => this.sy(this.periods[i][0]))
            .attr('width', (d, i) => this.sx(d3.max(this.timestamps[i])) - this.sx(d3.min(this.timestamps[i])))
            .attr('height', this.sy.bandwidth())
            .attr('fill', (d, i) => this.sc(d[0].possession_team.id))
            .attr('opacity', 0.8)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this))

    }

    draw() {
        this.setAxes();
        this.drawAxes();
        this.drawTS();
    }
}