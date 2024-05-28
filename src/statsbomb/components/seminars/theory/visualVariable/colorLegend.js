import * as d3 from "npm:d3";
import GeneralChart from "../../../../../chart/components/GeneralChart.js";
import _ from "npm:lodash";
import { mouseover, mousemove, mouseleave } from "./interaction.js";

export default class ColorLegend extends GeneralChart {
  constructor(data, selector, config) {
    super(data, selector, config);
    this.chart = config['chart'];
    this.setAxes();
  }

  setAxes() {
    this.sx = d3
      .scaleBand()
      .domain(this.chart.sc.domain())
      .range([this.margin.left, this.width - this.margin.right]);

    this.sy = d3
      .scaleBand()
      .domain(this.chart.sy.domain())
      .range([this.height - this.margin.bottom, this.margin.top]);


    this.sc = d3
      .scaleOrdinal()
      .domain(this.chart.sc.domain())
      .range(this.chart.sc.range());
  }


  drawData() {
    this.svg
        .append("g")
        .selectAll("circle")
        .data(this.chart.sc.domain())
        .join("circle")
        .attr("cx", (d) => this.sx(d) + this.sx.bandwidth() / 2)
        .attr("cy", this.sy(0) + this.sy.bandwidth() / 2)
        .attr("r", 3)
        .attr("fill", d=>this.sc(d))
        .attr('default-color', d=>this.sc(d))
        .attr('stroke', 'none')
        .attr('opacity', 0.8)
        .attr("stroke-width", 1);

    this.svg
        .append("g")
        .selectAll("text")
        .data(this.chart.sc.domain())
        .join("text")
        .attr("x", (d) => this.sx(d) + this.sx.bandwidth() / 2)
        .attr("y", this.sy(0) + this.sy.bandwidth() / 2)
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif")
        .text(d=>d)
  }


  draw() {
    this.svg.call(this.paintBG, {fill: '#eee'})
    this.drawData();
  }
}