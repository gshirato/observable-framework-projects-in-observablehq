import * as d3 from "npm:d3";
import GeneralChart from "../../../../../chart/components/GeneralChart.js";
import ColorLegend from './colorLegend.js';
import _ from "npm:lodash";
import { mouseover, mousemove, mouseleave } from "./interaction.js";

export default class Color extends GeneralChart {
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


    this.sc = d3
      .scaleOrdinal()
      .domain(["Goal", "Saved", "Off T", "SavedShot", "Blocked", "Wayward"])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]);
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
        .data(this.data)
        .join("circle")
        .attr('class', d=>this.createClass(d))
        .attr("cx", (d) => this.sx(d.index))
        .attr("cy", this.sy(0) + this.sy.bandwidth() / 2)
        .attr("r", 3)
        .attr("fill", d=>this.sc(d.shot.outcome.name))
        .attr('default-color', d=>this.sc(d.shot.outcome.name))
        .attr('stroke', 'none')
        .attr('opacity', 0.8)
        .attr("stroke-width", 1)
        .on("mouseover", _.partial(mouseover, this))
        .on("mousemove", _.partial(mousemove, this))
        .on("mouseleave", _.partial(mouseleave, this));

  }


  drawLegend() {
    const legend = new ColorLegend(this.sc.domain(), `${this.rootSelector} .legend`, {
      width: this.width,
      height: 50,
      margin: this.margin,
      chart: this
    }).draw();
  }

  draw() {
    this.drawAxes();
    this.drawData();
    this.drawLegend();
  }
}