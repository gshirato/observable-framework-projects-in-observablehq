import * as d3 from "npm:d3";
import GeneralChart from "../../../../../chart/components/GeneralChart.js";
import _ from "npm:lodash";

export default class PositionOnPitch extends GeneralChart {
  constructor(data, selector, config) {
    super(data, selector, config);
    this.soccer = config['soccerModule']
    this.players = this.data.shot.freeze_frame;
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
      .select('.above')
      .append('g')
      .attr('id', 'layer')

      layer
        .append("g")
        .append("text")
        .datum(this.data)
        .attr("x", (d) => this.sx(d.location[0]))
        .attr("y", (d) => this.sy(d.location[1]))
        .attr('font-size', '4px')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('font-family', 'sans-serif')
        .text('x')



      layer
        .append("g")
        .selectAll("circle")
        .data(this.players)
        .join("circle")
        .attr("cx", (d) => this.sx(d.location[0]))
        .attr("cy", (d) => this.sy(d.location[1]))
        .attr("r", 0.9)
        .attr("fill", 'none')
        .attr("stroke", "black")
        .attr("stroke-width", 0.4);

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