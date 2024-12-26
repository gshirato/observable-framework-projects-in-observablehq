import * as d3 from "npm:d3";
import {calculateDifferences} from "./utils.js";

class TableChart {
    constructor(data, selector, config) {
      // super(data, selector, config);
      this.data = data;
      this.selector = selector;
      this.config = config;
      this.nTeams = Object.keys(this.data[0]).length - 1;
      this.differences = calculateDifferences(this.data);
      this.differences = this.sortData(this.differences);
      this.setAxis();
      this.createTable();
    }

    sortData(data) {
      return data.sort((a, b) => d3.ascending(d3.sum(Object.values(a['diff'])), d3.sum(Object.values(b['diff']))));
    }

    score(raw) {
      return d3.sum(Object.values(raw['diff']));
    }

    setAxis() {
      this.sc = d3.scaleLinear()
        .domain([(this.nTeams / 2), 0, -(this.nTeams / 2)])
        .range(["#2f0", "white", "#f51"]);
    }

    createClassName(name, i) {
      const formattedName = name
        .replace('(', '_')
        .replace(')', '_')
        .replace('\n', '_')
        .replace(' ', '_')
      return `id${formattedName}-${i}`
    }

    createTable() {
      // Check if the table already exists
      let table = d3.select(this.selector).select("table");
      // If the table does not exist, create it
      if (table.empty()) {
        table = d3.select(this.selector).append("table");
      } else {
        // If the table exists, clear its contents before redrawing
        table.selectAll("*").remove();
      }

      this.table = table;

      // Add header row
      const headerRow = this.table.append("tr");
      headerRow.append("th").text("予想者");
      for (let i = 1; i <= this.nTeams; i++) {
        headerRow.append("th").text(`${i}位`);
      }
      headerRow.append("th").text("スコア (予想との順位差分)");

      const thisClass = this;
      // Add data rows

      this.differences.forEach((item) => {
          const row = this.table.append("tr");
          row.append("td").style("font-weight", "bold").text(item.予想);
          for (let i = 1; i <= this.nTeams; i++) {
            row.append("td")
              .attr('class', thisClass.createClassName(item.予想, i))
              .text(item[i]);
          }
          // sum
          const differences = Object.values(thisClass.differences.find(d=>d.予想 === item.予想)['diff']);
          row.append('td').text(d3.sum(differences));
        });
    }

    findKeyByValue(obj, targetValue) {
      return Object.keys(obj).find(key => obj[key] === targetValue);
    }


    colorCells() {
      console.log(this.differences.map(d=>d.予想))
      for (const pred of this.differences.map(d=>d.予想)) {
        for (let i = 1; i <= this.nTeams; i++) {
          const predictedIthPosition = this.differences.find(d=>d.予想 === pred)[i];
          const actual = this.differences.find(d=>d.予想 === '結果');
          const actualPosition = this.findKeyByValue(actual, predictedIthPosition)

          const diff = i - parseInt(actualPosition);
          const sc = this.sc(diff);
          this.table.select(`.${this.createClassName(pred, i)}`).style("background-color", sc);
        }
      }

      this.table
        .selectAll("tr:nth-child(2)")
        .data(this.differences)
        .selectAll("td")
        .data(d3.range(this.nTeams + 1))
        .style("background-color", "#def");
    }

    draw() {
      this.colorCells();
    }
  }

export default TableChart;