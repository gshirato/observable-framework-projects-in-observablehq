import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import PLChart from "./PLChart.js";
import getPLKeys from "./utils.js";

class TsneChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.teams = config["teams"];
      this.plData = config['plData']
      this.setAxes();
    }

    setAxes() {
      this.sx = d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d[0]))
        .range([this.margin.left, this.width - this.margin.right]);

      this.sy = d3
        .scaleLinear()
        .domain(d3.extent(this.data, (d) => d[1]))
        .range([this.height - this.margin.bottom, this.margin.top]);
    }

    drawAxes() {
      const xaxis = d3.axisBottom(this.sx).ticks(0);
      this.svg
        .append("g")
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(xaxis);

      const yaxis = d3.axisLeft(this.sy).ticks(0);
      this.svg
        .append("g")
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(yaxis);
    }

    drawMain() {
      this.svg
        .append("g")
        .selectAll("circle")
        .data(this.data)
        .join("circle")
        .attr("cx", (d) => this.sx(d[0]))
        .attr("cy", (d) => this.sx(d[1]))
        .attr("stroke", "#ccc")
        .attr("fill", "#fff")
        .attr("r", 5)
        .attr("index", (_, i) => i)
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this));

      this.svg
        .append("g")
        .selectAll("text")
        .data(this.data)
        .join("text")
        .attr("x", (d) => this.sx(d[0]))
        .attr("y", (d) => this.sx(d[1]))
        .attr("dy", -5)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .text((_, i) => this.teams[i]);
    }
    draw() {
      this.drawAxes();
      this.drawMain();
    }

    mouseover(thisClass, event, d) {
      new PLChart(thisClass.plData, `${thisClass.rootSelector} .detail`, {
        height: 500,
        width: thisClass.width,
        margin: { top: 10, bottom: 20, left: 50, right: 50 },
        team: thisClass.teams[d3.select(this).attr("index")],
        yExtent: [-10000, 10000],
        plKeys: getPLKeys(thisClass.plData),
        detail: false
      }).draw();
    }
  }

export default TsneChart;