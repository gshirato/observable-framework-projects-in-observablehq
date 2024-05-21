

import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import DetailChart from "./detail.js";
import getEmoji from "./countryEmojis.js";

export default class EpisodeSummaryChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.rollup = Array.from(
          d3.rollup(this.data, x => ({
            count: x.length,
            avg: d3.mean(x, d => d.possession_duration),
            min: d3.min(x, d => d.possession_duration),
            max: d3.max(x, d => d.possession_duration)
          }),
          d => d.match_id,
          d => d.episode
        )).map(d=>Array.from(d[1])).flat();

        this.histogram = d3.histogram()
          .value(d => d[1].count)
          .domain([0, 60])
          .thresholds(40);

        this.bins = this.histogram(this.rollup);
        this.setAxes();
    }
    setAxes() {
      this.sx = d3.scaleLinear()
        .domain([0, d3.max(this.rollup, d => d[1].count)])
        .range(this.domainLeftToRight)

      this.sy = d3.scaleLinear()
        .domain([0, 1500])
        .range(this.domainBottomToTop)
    }

    drawAxes(sel) {
      const xAxis = d3.axisBottom(this.sx);
      const yAxis = d3.axisLeft(this.sy);

      this.svg
        .append('g')
        .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
        .call(xAxis)
        .append('g')
        .append('text')
        .attr('x', this.width - this.margin.right)
        .attr('y', 0)
        .attr('dy', 10)
        .attr('text-anchor', 'end')
        .attr('font-size', 100)
        .text('Number of episodes');


      sel
        .append('g')
        .attr("transform", `translate(${this.margin.left}, 0)`)
        .call(yAxis)
        .append('text')
        .attr('x', -10)
        .attr('y', this.margin.top)
        .attr('text-anchor', 'start')
        .attr('font-size', 100)
        .text('Number of matches')

    }

    drawHistogram(sel) {
      sel
        .append("g")
        .selectAll('rect')
        .data(this.bins)
        .join('rect')
        .attr('x', d => this.sx(d.x0))
        .attr('y', d => this.sy(d.length))
        .attr('width', d => this.sx(d.x1) - this.sx(d.x0))
        .attr('height', d =>  this.sy(0) - this.sy(d.length))
        .attr('fill', 'steelblue')
        .attr('opacity', 0.5)
    }

    drawStats(sel) {
      const stats = [
        {label: 'Median', value: d3.median(this.rollup, d => d[1].count).toFixed(2), anchor: 'middle'},
        {label: 'Min.', value: d3.min(this.rollup, d => d[1].count), anchor: 'start'},
        {label: 'Max.', value: d3.max(this.rollup, d => d[1].count), anchor: 'end'}
      ]
      sel
        .append('g')
        .selectAll('text')
        .data(stats)
        .join('text')
        .attr('x', d=>this.sx(d.value))
        .attr('y', this.sy.range()[1])
        .attr('text-anchor', d=>d.anchor)
        .attr('font-size', 10)
        .text(d => `${d.label}: ${d.value}`)

      sel
        .append('g')
        .selectAll('line')
        .data(stats)
        .join('line')
        .attr('x1', d=>this.sx(d.value))
        .attr('x2', d=>this.sx(d.value))
        .attr('y1', this.sy.range()[0])
        .attr('y2', this.sy.range()[1])
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2')
    }

    draw() {
      this.svg.call(this.drawAxes.bind(this));
      this.svg.call(this.drawHistogram.bind(this));
      this.svg.call(this.drawTitle.bind(this));
      this.svg.call(this.drawStats.bind(this));
    }

    drawTitle(sel) {
    }

    mouseover(thisClass, event, d) {
      thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
      thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }
  }