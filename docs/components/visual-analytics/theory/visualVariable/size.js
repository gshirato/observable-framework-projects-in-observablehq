import * as d3 from "npm:d3";
import GeneralChart from "../../../GeneralChart.js";
import _ from "npm:lodash";

export default class Size extends GeneralChart {
  constructor(data, selector, config) {
    super(data, selector, config);

    this.setAxes();
  }

  setAxes() {
    this.sx = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.index)])
      .range([this.margin.left, this.width - this.margin.right]);

    this.sy = d3
      .scaleBand()
      .domain([0])
      .range([this.height - this.margin.bottom, this.margin.top]);

    this.sr = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.shot.statsbomb_xg)])
      .range([3, 10]);
  }

  drawAxes() {
    const xaxis = d3.axisBottom(this.sx);
    this.svg
      .append("g")
      .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
      .call(xaxis)
      .append("text")
      .attr("fill", "#000")
      .attr("x", this.width - this.margin.right)
      .attr("y", -6)
      .attr("text-anchor", "end")
      .text("Index");

    const yaxis = d3.axisLeft(this.sy);
    this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(yaxis)
      .selectAll("text")
      .attr('opacity', 0);
  }

  drawData() {
    this.svg
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr("cx", (d) => this.sx(d.index))
      .attr("cy", this.sy(0) + this.sy.bandwidth() / 2)
      .attr("l", (d) => console.log(d.shot.statsbomb_xg))
      .attr("r", (d) => this.sr(d.shot.statsbomb_xg))
      .attr("fill", (d) => 'black')
      .attr("stroke", "black")
      .attr("stroke-width", 1);
  }

  draw() {
    this.drawAxes();
    this.drawData();
  }
}