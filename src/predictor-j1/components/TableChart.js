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
      console.log(this.differences)
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
      this.sc = d3.scaleLinear().domain([0, this.nTeams - 1]).range(["white", "#de2d26"]);
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
        headerRow.append("th").text(i);
      }
      headerRow.append("th").text("スコア");

      const thisClass = this;
      // Add data rows

      this.differences.forEach((item) => {
        console.log(item)
          const row = this.table.append("tr");
          row.append("td").style("font-weight", "bold").text(item.予想);
          for (let i = 1; i <= this.nTeams + 1; i++) {
            row.append("td").text(item[i]);
          }
          // sum
          const differences = Object.values(thisClass.differences.find(d=>d.予想 === item.予想)['diff']);
          row.append('td').text(d3.sum(differences));
        });
    }

    colorCells() {

      this.table
        .selectAll("tr:not(:first-child)")
        .data(this.differences)
        .selectAll("td:not(:first-child)")
        .data((d) => Object.values(d["diff"]))
        .style("background-color", (d, i) => this.sc(d));

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