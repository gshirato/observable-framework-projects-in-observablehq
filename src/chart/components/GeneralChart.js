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
      this.innerWidth = this.width - this.margin.left - this.margin.right;
      this.innerHeight = this.height - this.margin.top - this.margin.bottom;
      this.domainLeftToRight = [this.margin.left, this.width - this.margin.right];
      this.domainRightToLeft = [this.width - this.margin.right, this.margin.left];
      this.domainBottomToTop = [this.height - this.margin.bottom, this.margin.top];
      this.domainTopToBottom = [this.margin.top, this.height - this.margin.bottom];


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

    paintBG = (sel, config) => {
      sel
        .append("g")
        .append("rect")
        .attr("class", "bg")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top)
        .attr("width", this.innerWidth)
        .attr("height", this.innerHeight)
        .attr("fill", config.fill || "none")
        .attr('stroke', config.stroke || 'none')
        .attr('stroke-width', config.strokeWidth || 1)
        .attr('stroke-dasharray', config.strokeDasharray || '')
        .attr('pointer-events', 'all');
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
