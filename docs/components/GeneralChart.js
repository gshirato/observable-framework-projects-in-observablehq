import * as d3 from "npm:d3";
import Tooltip from "./Tooltip.js";

class GeneralChart {
    /**
     * @param {Object} data - data to be drawn
     * @param {String} selector - html selector
     * @param {Object} config - configuration of the chart
     */
    constructor(data, selector, config) {
      this.data = data;
      this.selector = selector;
      this.config = config;
      this.margin = this.config["margin"] || {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
      };
      this.width = this.config["width"];
      this.height = this.config["height"];
      this.xName = this.config["xName"];
      this.yName = this.config["yName"];
      this.rootSelector = this.selector.split(" ")[0];

      this.tooltip = new Tooltip();
      d3.select(this.selector).select("svg").remove();

      this.svg = d3
        .select(this.selector)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .append("g");
    }

    paintBackground(sel, color) {
      sel.call(this.paintBG.bind(this), color);
    }

    paintBG = (sel, color) => {
      sel
        .append("g")
        .append("rect")
        .attr("class", "bg")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top)
        .attr("width", this.width - this.margin.left - this.margin.right)
        .attr("height", this.height - this.margin.top - this.margin.bottom)
        .attr("fill", color);
    };

    draw() {}

    mouseover(thisClass, event, d) {
      d3.select(this).attr("stroke-width", 5);
      thisClass.tooltip.show(event, d);
    }
    mousemove(thisClass, event, d) {
      thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
      d3.select(this).attr("stroke-width", 1);
      thisClass.tooltip.hide(event, d);
    }
  }

export default GeneralChart;