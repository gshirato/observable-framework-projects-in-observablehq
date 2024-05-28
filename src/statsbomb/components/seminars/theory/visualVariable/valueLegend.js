import * as d3 from "npm:d3";
import GeneralChart from "../../../../../chart/components/GeneralChart.js";
import _ from "npm:lodash";

export default class ValueLegend extends GeneralChart {
  constructor(data, selector, config) {
    super(data, selector, config);
    this.chart = config['chart'];
    this.setAxes();
  }

  setAxes() {
    this.sx = d3
      .scaleBand()
      .domain(d3.range(0, 0.5, 0.1))
      .range([this.margin.left, this.width - this.margin.right]);

    this.sy = d3
      .scaleBand()
      .domain(this.chart.sy.domain())
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.sv = d3
      .scaleLinear()
      .domain(this.chart.sv.domain())
      .range(this.chart.sv.range());
  }


  drawLegend() {
    this.svg
      .append("g")
      .selectAll("circle")
      .data(this.sx.domain())
      .join("circle")
      .attr("cx", (d) => this.sx(d) + this.sx.bandwidth() / 2)
      .attr("cy", this.sy(0) + this.sy.bandwidth() / 2)
      .attr("r", 3)
      .attr('stroke', 'none')
      .attr('opacity', d=>this.sv(d))
      .attr("stroke-width", 1);

    this.svg
      .append("g")
      .selectAll("circle")
      .data(this.sx.domain())
      .join("circle")
      .attr("cx", (d) => this.sx(d) + this.sx.bandwidth() / 2)
      .attr("cy", this.sy(0) + this.sy.bandwidth() / 2)
      .attr("r", 3)
      .attr('stroke', '#333')
      .attr('fill', 'none')
      .attr('opacity', 0.8)
      .attr("stroke-width", 1);

    this.svg
      .append("g")
      .selectAll("text")
      .data(this.sx.domain())
      .join("text")
      .attr("x", (d) => this.sx(d) + this.sx.bandwidth() / 2)
      .attr("y", this.sy(0) + this.sy.bandwidth() / 2)
      .attr("dy", "1.2em")
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif")
      .text(d=>d.toFixed(1))
  }

  drawTitle() {
    this.svg
      .append("g")
      .selectAll("text")
      .data([0])
      .join("text")
      .attr("x", this.width - this.margin.right)
      .attr("y", this.margin.top)
      .attr("dx", "-0.5em")
      .attr("dy", "1em")
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif")
      .text('xG')

  }

  draw() {
    this.svg.call(this.paintBG, {stroke: '#333', strokeDasharray: '2 2'})
    this.drawLegend();
    this.drawTitle();
  }
}