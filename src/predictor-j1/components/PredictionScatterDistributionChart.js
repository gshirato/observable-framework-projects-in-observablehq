import * as d3 from "npm:d3";
import GeneralChart from "../../chart/components/GeneralChart.js";
/**
 * Class for creating a scatter chart of the predicted positions of the teams
 * Almost identical to PositionScatterChart, but with a different color for the circles
 * TODO: This should be refactored to use the same class as PositionScatterChart
 *
 */
export class PredictionScatterDistributionChart extends GeneralChart {
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
        .padding(0.3);

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
        for (const position of Array.from(d3.union(datum['positions'])).sort((a, b) => d3.ascending(a, b))) {
          console.log(datum['positions'].filter(d=>d === position).length);
          this.svg
            .append("g")
            .selectAll("circle")
            .data(datum['positions'].filter(d=>d === position))
            .join("circle")
            .attr("cx", (d, i) => this.sx(datum["team"]) + this.sx.bandwidth() * i / datum['positions'].length)
            .attr("cy", (d) => this.sy(d))
            .attr("r", 1)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("opacity", 1);
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

      this.svg
        .append("g")
        .selectAll('rect')
        .data(this.sortedTeams)
        .join('rect')
        .attr('x', (d) => this.sx(d))
        .attr('y', this.margin.top)
        .attr('width', this.sx.bandwidth())
        .attr('height', this.height - this.margin.top - this.margin.bottom)
        .attr('fill', '#ccc')
        .attr('stroke', 'none')
        .attr('opacity', 0.3);



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

export function drawPredictionScatterDistributionChart(data, selector, config) {
    const pred = getPredictions(data);
    new PredictionScatterDistributionChart(pred, selector, config).draw();
}