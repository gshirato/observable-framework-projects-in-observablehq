import * as d3 from "npm:d3";
import GeneralChart from "../../chart/components/GeneralChart.js";

class ChangeFromPrevYearChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.predictor = config["predictor"];
      this.prediction = this.data.find((d) => d["予想"] == this.predictor);
      this.predLastYear = this.data.find((d) => d["予想"] == "2023年");
      this.teams = Object.values(this.prediction).slice(0, 20);
      this.setAxes();
    }

    setAxes() {
      this.sx = d3
        .scaleBand()
        .domain(this.teams)
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
      const combined = d3.zip([
        Object.entries(this.prediction),
        Object.entries(this.predLastYear)
      ]);
      this.svg
        .append("g")
        .selectAll("line")
        .data(d3.range(20))
        .join("line")
        .attr(
          "x1",
          (i) => this.sx(combined[0][0][i][1]) + this.sx.bandwidth() / 2
        )
        .attr("y1", (i) => this.sy(+combined[0][0][i][0]))
        .attr(
          "x2",
          (i) => this.sx(combined[0][0][i][1]) + this.sx.bandwidth() / 2
        )
        .attr("y2", (i) => {
          const team = combined[0][0][i][1];
          const pos = findKeyByValue(this.predLastYear, team);
          return this.sy(+pos);
        })
        .attr("fill", "#eee")
        .attr("stroke", "#333")
        .attr("stroke-width", "1");

      this.svg
        .append("g")
        .selectAll("circle")
        .data(Object.entries(this.prediction).filter((d) => d[0] != "予想"))
        .join("circle")
        .attr("cx", (d) => this.sx(d[1]) + this.sx.bandwidth() / 2)
        .attr("cy", (d) => this.sy(+d[0]))
        .attr("r", 5)
        .attr("fill", "#eee")
        .attr("stroke", "#333")
        .attr("stroke-width", "2");

      this.svg
        .append("g")
        .selectAll("circle")
        .data(Object.entries(this.predLastYear).filter((d) => d[0] != "予想"))
        .join("circle")
        .attr("cx", (d) => this.sx(d[1]) + this.sx.bandwidth() / 2)
        .attr("cy", (d) => this.sy(+d[0]))
        .attr("r", 3)
        .attr("fill", "#eee")
        .attr("stroke", "#333")
        .attr("stroke-width", "1");
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

export default ChangeFromPrevYearChart;