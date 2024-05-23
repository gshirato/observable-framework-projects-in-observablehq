import * as d3 from "npm:d3";
import GeneralChart from "../GeneralChart.js";
import calculateDifferences from "./utils.js";

class PositionScatterChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.teams = config['teams'];
      this.setAxes();
    }

    setAxes() {
      this.sx = d3
        .scaleBand()
        .domain(this.data.map((d) => d.team))
        .range([this.margin.left, this.width - this.margin.right])
        .padding(0.1);

      this.sy = d3
        .scaleLinear()
        .domain([1, 18])
        .range([this.margin.top, this.height - this.margin.bottom]);
    }

    drawAxes() {
      const xaxis = d3.axisBottom(this.sx);
      this.svg
        .append("g")
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(xaxis);

      const yaxis = d3.axisLeft(this.sy).ticks(18);
      this.svg
        .append("g")
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(yaxis);
    }

    draw() {
      this.drawAxes();
      for (const datum of this.data) {
        this.svg
          .append("g")
          .selectAll("circle")
          .data(datum["positions"])
          .join("circle")
          .attr("cx", this.sx(datum["team"]) + this.sx.bandwidth() / 2)
          .attr("cy", (d) => this.sy(d))
          .attr("r", 4)
          .attr("fill", "#7B0323")
          .attr("opacity", 0.1);
      }

      this.svg
        .append("g")
        .selectAll("circle")
        .data(this.data)
        .join("circle")
        .attr("cx", (d) => this.sx(d["team"]) + this.sx.bandwidth() / 2)
        .attr("cy", (_, i) => this.sy(i + 1))
        .attr("r", 4)
        .attr("fill", "none")
        .attr("stroke", "blue");
    }
  }

  function getPositions(data, teams) {
    const res = [];
    for (const team of teams) {
      const dict = {};
      dict["team"] = team;
      dict["positions"] = [];
      for (const datum of data) {
        const pos = +findKeyByValue(datum, team);
        dict["positions"].push(pos);
      }
      res.push(dict);
    }
    return res;

}
function findKeyByValue(obj, queryValue) {
  /**
   * FIXIT: This function is duplicated in the original code and should be moved to a separate file
   */
  for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] === queryValue) {
          return key;
      }
  }
  return null;
}

function drawPositionScatterChart(results, selector, config) {
  const differences = calculateDifferences(results).filter((d) => d["予想"] !== "結果")
  const positions = getPositions(differences, config['teams']);

  new PositionScatterChart(positions, selector, config).draw();
}

export default drawPositionScatterChart;