import * as d3 from "npm:d3";
import GeneralChart from "../GeneralChart.js";
import calculateDifferences, { calculateCumulativeDifferences } from "./utils.js";

class TimelineChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.config = config;
      this.setAxes();
    }

    setAxes() {
      this.sx = d3
        .scaleBand()
        .domain(this.config["teams"])
        .range([this.margin.left, this.width - this.margin.right])
        .padding(0.1);

      this.sy = d3
        .scaleLinear()
        .domain([0, 120])
        .range([this.height - this.margin.bottom, this.margin.top]);
    }

    drawAxes() {
      const xaxis = d3.axisBottom(this.sx);
      this.svg
        .append("g")
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(xaxis);

      const yaxis = d3.axisLeft(this.sy);
      this.svg
        .append("g")
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(yaxis);
    }

    drawBars() {
      const data = Object.entries(
        this.data.find((d) => d.予想 === this.config["predictor"])["cumsum"]
      );
      this.svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (_, i) => this.sx(this.config["teams"][i]))
        .attr("width", this.sx.bandwidth())
        .attr("y", (d) => this.sy(d[1]))
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", (d, i) => {
          if (i == 0) return "4 4";
          if (this.sy(data[i - 1][1]) - this.sy(d[1]) == 0) return "4 4";
          else return "";
        })
        .attr("height", (d, i) => {
          if (i == 0) return this.sy(0) - this.sy(d[1]);
          if (this.sy(data[i - 1][1]) - this.sy(d[1]) == 0) return 2;
          else return this.sy(data[i - 1][1]) - this.sy(d[1]);
        })
        .attr("stroke", (d, i) => {
          if (i == 0) return "none";
          if (this.sy(data[i - 1][1]) - this.sy(d[1]) == 0) return "#777";
          else return "none";
        })
        .attr("fill", (d, i) => {
          if (i == 0) return "steelblue";
          if (this.sy(data[i - 1][1]) - this.sy(d[1]) == 0) return "none";
          else return "steelblue";
        });
    }

    draw() {
      this.drawAxes();
      this.drawBars();
    }
  }

export default function drawTimelineChart(results, selector, config) {
    const cumsum = calculateCumulativeDifferences(calculateDifferences(results));
new TimelineChart(cumsum, selector, config).draw();
}