import * as d3 from "npm:d3";
import GeneralChart from "../GeneralChart.js";
/**
 * Class for creating a scatter chart of the predicted positions of the teams
 * Almost identical to PositionScatterChart, but with a different color for the circles
 * TODO: This should be refactored to use the same class as PositionScatterChart
 *
 */
class PredictionScatterChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);

      this.sortedTeams = this.data
        .sort((a, b) =>
          d3.ascending(d3.median(a["positions"]), d3.median(b["positions"]))
        )
        .map((d) => d.team);

      this.setAxes();
    }

    setAxes() {
      this.sx = d3
        .scaleBand()
        .domain(this.sortedTeams)
        .range([this.margin.left, this.width - this.margin.right])
        .padding(0.1);

      this.sy = d3
        .scaleLinear()
        .domain([1, 20])
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
          .attr("opacity", 0.2);
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

function getPredictions(predictions) {
    const res = [];
    for (const team of Object.values(predictions[0])) {
      if (team == "2023年") continue;
      const data = { team: team, positions: [] };
      for (const pred of predictions) {
          data["positions"].push(+findKeyByValue(pred, team));
        }
        res.push(data);
    }
    return res;
}

function drawPredictionScatterChart(data, selector, config) {
    const pred = getPredictions(data);
    new PredictionScatterChart(pred, selector, config).draw();
}
export default drawPredictionScatterChart;