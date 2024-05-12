import * as d3 from "npm:d3";
import GeneralChart from "../../../GeneralChart.js";
import _ from "npm:lodash";
import { mouseover, mousemove, mouseleave } from "./interaction.js";

export default class Position extends GeneralChart {
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
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.shot.statsbomb_xg)])
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
        .append('text')
        .attr("fill", "#000")
        .attr("y", this.margin.top)
        .attr("dx", "2em")
        .attr("dy", "0.72em")
        .attr("text-anchor", "end")
        .text("xG");

  }


  createClass(d) {
    return `id-${d.id}`
  }

  drawData() {
    this.svg
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr('class', d=>this.createClass(d))
      .attr("cx", (d) => this.sx(d.index))
      .attr("cy", (d)=> this.sy(d.shot.statsbomb_xg))
      .attr("r", (d) => 3)
      .attr("fill", (d) => '#333')
      .attr("stroke", "#333")
      .attr("stroke-width", 1)
      .on("mouseover", _.partial(mouseover, this))
      .on("mousemove", _.partial(mousemove, this))
      .on("mouseleave", _.partial(mouseleave, this));
  }

  formatTime(d) {
    return `${d.minute.toString().padStart(2, '0')}:${d.second.toString().padStart(2, '0')}`
  }


  draw() {
    this.drawAxes();
    this.drawData();
  }
}