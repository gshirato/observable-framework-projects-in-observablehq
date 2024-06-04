import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../../chart/components/GeneralChart.js";


export default class EventTimelineChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.config = config;
    }

    setAxes() {
        this.sx = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d[0]))
            .range(this.domainLeftToRight)

        this.sy = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d[1]))
            .range(this.domainBottomToTop)
    }

    drawAxes(sel) {

    }


    draw() {
        this.svg.call(this.drawAxes.bind(this));
        this.svg.call(this.drawTitle.bind(this));

    }


    drawTitle(sel) {
    }

    mouseover(thisClass, event, d) {
        thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
        thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }
  }