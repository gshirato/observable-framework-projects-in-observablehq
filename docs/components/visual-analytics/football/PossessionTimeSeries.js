import * as d3 from "npm:d3";
import GeneralChart from "../../GeneralChart.js";
import _ from "npm:lodash";


export default class PossessionTimeSeriesChart extends GeneralChart {
    constructor(data, selector, config) {
    super(data, selector, config);
    }

    setAxes() {
        this.sx = d3
            .scaleLinear()
            .domain([0, 120])
            .range([0, 105]);

        this.sy = d3
            .scaleLinear()
            .domain([0, 80])
            .range([0, 68]);

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


    draw() {
        this.setAxes();
        this.svg.call(this.drawPitch.bind(this));
        this.svg.call(this.drawWatermark.bind(this));
        this.svg.call(this.drawZones.bind(this));
        this.svg.call(this.drawEvents.bind(this));
    }
}