import * as d3 from "npm:d3";
import GeneralChart from "../../../GeneralChart.js";
import _ from "npm:lodash";
import { mouseover, mousemove, mouseleave } from "./interaction.js";

export default class Motion extends GeneralChart {
  constructor(data, selector, config) {
    super(data, selector, config);
    this.soccer = config['soccerModule']
    this.setAxes();
  }


  drawPitch(sel) {
    this.pitch = this.soccer.pitch()
        .height(this.height)
        .clip([[0, -5], [110, 73]]);
    sel.append("g").call(this.pitch)
  }
  drawWatermark(sel) {
    sel
      .append("image")
      .attr(
        "xlink:href",
        "https://dtai.cs.kuleuven.be/sports/static/ee39fa2918398059e9be62c32c1b48c4/74404/statsbomb_logo.png"
      )
      .attr("opacity", 0.2)
      .attr("x", this.pitch.width() - this.margin.right - 180)
      .attr("y", this.pitch.height() - 20)
      .attr("width", 200)
      .attr("height", 20);
  }

  setAxes() {
    this.sx = d3
      .scaleLinear()
      .domain([0, 120])
      .range([0, 105]);

    this.sy = d3
      .scaleLinear()
      .domain([0, 80])
      .range([0, 68]);
  }


  createClass(d) {
    return `id-${d.id}`
  }

  drawData() {
    const layer = this.svg
      .select('#above')
      .append('g')
      .attr('id', 'layer')

      layer
        .append("g")
        .selectAll("circle")
        .data(this.data)
        .join("circle")
        .attr('class', d=>this.createClass(d)+'-motion')
        .attr("cx", (d) => this.sx(d.location[0]))
        .attr("cy", (d) => this.sy(d.location[1]))
        .attr("r", 0.8)
        .attr("fill", "black")
        .attr("stroke-width", 0.4)
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(mousemove, this))
        .on("mouseleave", _.partial(mouseleave, this))
        .call(this.repeat.bind(this));

      }
    repeat(sel) {
      sel
        .attr("cx", (d) => this.sx(d.location[0]))
        .attr("cy", (d) => this.sy(d.location[1]))
        .transition()
        .duration(d => d.duration * 1000)
        .attr("cx", (d) => this.sx(d.shot.end_location[0]))
        .attr("cy", (d) => this.sy(d.shot.end_location[1]))
      }

  mouseover(thisClass, event, d) {
    d3.select(this).call(thisClass.repeat.bind(thisClass));

    thisClass.defaultColors = d3.selectAll(`.${thisClass.createClass(d)}`).nodes().map(n=>n.getAttribute('fill'))
    thisClass.defaultOpacities = d3.selectAll(`.${thisClass.createClass(d)}`).nodes().map(n=>n.getAttribute('opacity'))

    d3.selectAll(`.${thisClass.createClass(d)}`)
        .raise().attr('fill', 'red').attr('opacity', 1)
    thisClass.tooltip.show(event, d);
  }

  drawTitle() {
    this.svg
      .append("text")
      .attr("x", this.margin.left)
      .attr("y", this.margin.top)
      .attr("text-anchor", "start")
      .attr("font-size", "16px")
      .text("Positions of players in the freeze frame of a shot");

  }

  draw() {
    this.svg.call(this.drawPitch.bind(this));
    this.svg.call(this.drawWatermark.bind(this));
    this.drawData();
    this.drawTitle();
  }
}