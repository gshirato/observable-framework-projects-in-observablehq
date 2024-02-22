import * as d3 from "npm:d3";
import calculateDifferences from "./utils.js";

class TableChart {
    constructor(data, selector, config) {
      // super(data, selector, config);
      this.data = data;
      this.selector = selector;
      this.config = config;
      this.setAxis();
      this.createTable();
    }

    setAxis() {
      this.sc = d3.scaleLinear().domain([0, 17]).range(["white", "#de2d26"]);
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
      for (let i = 1; i <= 18; i++) {
        headerRow.append("th").text(i);
      }

      // Add data rows
      this.data.forEach((item) => {
        const row = this.table.append("tr");
        row.append("td").style("font-weight", "bold").text(item.予想);
        for (let i = 1; i <= 18; i++) {
          row.append("td").text(item[i]);
        }
      });
    }

    colorCells() {
      const differences = calculateDifferences(this.data);

      this.table
        .selectAll("tr:not(:first-child)")
        .data(differences)
        .selectAll("td:not(:first-child)")
        .data((d) => Object.values(d["diff"]))
        .style("background-color", (d, i) => this.sc(d));

      this.table
        .selectAll("tr:nth-child(2)")
        .data(differences)
        .selectAll("td")
        .data(d3.range(19))
        .style("background-color", "#def");
    }

    draw() {
      this.colorCells();
    }
  }

export default TableChart;