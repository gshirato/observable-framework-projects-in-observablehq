import * as d3 from "npm:d3";
import GeneralChart from "../../../../../chart/components/GeneralChart.js";
import _ from "npm:lodash";

export default class ShapeLegend extends GeneralChart {
  constructor(data, selector, config) {
    super(data, selector, config);
    this.chart = config['chart'];
    this.setAxes();
  }

  setAxes() {
    this.sx = d3
      .scaleBand()
      .domain([0, 1])
      .range([this.margin.left, this.width - this.margin.right]);

    this.sy = d3
      .scaleBand()
      .domain(this.chart.sy.domain())
      .range([this.height - this.margin.bottom, this.margin.top]);

  }


  drawData() {
    this.svg
        .append("g")
        .selectAll("circle")
        .data([0])
        .join("circle")
        .attr("cx", (d) => this.sx(d) + this.sx.bandwidth() / 2)
        .attr("cy", this.sy(0) + this.sy.bandwidth() / 2)
        .attr("r", 3)
        .attr('stroke', 'none')
        .attr('opacity', 0.8)
        .attr("stroke-width", 1);

    this.svg
        .append("g")
        .selectAll("text")
        .data([1])
        .join("text")
        .attr("x", (d) => this.sx(d) + this.sx.bandwidth() / 2)
        .attr("y", this.sy(0) + this.sy.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif")
        .text(d=>'x')

    this.svg
        .append("g")
        .selectAll("text")
        .data([0, 1])
        .join("text")
        .attr("x", (d) => this.sx(d) + this.sx.bandwidth() / 2)
        .attr("y", this.sy(0) + this.sy.bandwidth() / 2)
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-family", "sans-serif")
        .text((_, i)=>['Goal', 'Not Goal'][i])
  }


  draw() {
    this.svg.call(this.paintBG, {fill: '#eee'});
    this.drawData();
  }
}