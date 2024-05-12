import * as d3 from "npm:d3";
import GeneralChart from "../../../GeneralChart.js";
import _ from "npm:lodash";
import { mouseover, mousemove, mouseleave } from "./interaction.js";

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
  }

  createClass(d) {
    return `id-${d.id}`
  }

  drawData() {
    this.svg
        .append("g")
        .selectAll("circle")
        .data(this.data.filter((d) => d.shot.outcome.name === "Goal"))
        .join("circle")
        .attr('class', d=>this.createClass(d))
        .attr("cx", (d) => this.sx(d.index))
        .attr("cy", this.sy(0) + this.sy.bandwidth() / 2)
        .attr("r", 3)
        .attr("stroke", "#333")
        .attr('opacity', 0.8)
        .attr("stroke-width", 1)
        .on("mouseover", _.partial(mouseover, this))
        .on("mousemove", _.partial(mousemove, this))
        .on("mouseleave", _.partial(mouseleave, this));

    this.svg
        .append("g")
        .selectAll("text")
        .data(this.data.filter((d) => d.shot.outcome.name !== "Goal"))
        .join("text")
        .attr("x", (d) => this.sx(d.index))
        .attr("y", this.sy(0) + this.sy.bandwidth() / 2)
        .attr('class', d=>this.createClass(d))
        .attr("fill", '#333')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '12px')
        .attr('font-family', 'sans-serif')
        .attr('opacity', 0.8)
        .attr('cursor', 'default')
        .text('x')
        .on("mouseover", _.partial(mouseover, this))
        .on("mousemove", _.partial(mousemove, this))
        .on("mouseleave", _.partial(mouseleave, this));
  }

  draw() {
    this.drawAxes();
    this.drawData();
  }
}