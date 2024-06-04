import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../../chart/components/GeneralChart.js";


export default class UmapChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.config = config;
        this.setAxes();
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
        const xAxis = d3.axisBottom(this.sx);
        const yAxis = d3.axisLeft(this.sy);


        sel.append("g")
            .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
            .call(xAxis);

        sel
            .append('g')
            .attr("transform", `translate(${this.margin.left}, 0)`)
            .call(yAxis)
    }

    drawPoints(sel) {
        sel.selectAll("circle")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("cx", d => this.sx(d[0]))
            .attr("cy", d => this.sy(d[1]))
            .attr("r", 2)
            .attr("fill", "black")
            .on("mouseover", _.partial(this.mouseover, this))
            .on("mousemove", _.partial(this.mousemove, this))
            .on("mouseleave", _.partial(this.mouseleave, this))
    }

    draw() {
        this.svg.call(this.drawAxes.bind(this));
        this.svg.call(this.drawPoints.bind(this));
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