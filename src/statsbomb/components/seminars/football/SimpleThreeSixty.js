import * as d3 from "npm:d3";
import GeneralChart from "../../../../chart/components/GeneralChart.js";
import drawDots from "../../../../chart/components/Dots.js";
import _ from "npm:lodash";


export default class SimpleThreeSixtyChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.soccer = this.config["soccerModule"];
      this.pitch = this.soccer.pitch().height(this.height);
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

        this.sc = d3
            .scaleOrdinal()
            .domain([true, false])
            .range(["#ff0000", "#0000ff"]);
    }

    drawPitch(sel) {
      sel.append("g").call(this.pitch);
    }

    draw360(sel) {
      sel.call(this.drawVisibleArea.bind(this));
    }

    drawVisibleArea(sel) {
      sel
        .append("g")
        .append("path")
        .datum(this.data)
        .attr("d", (d) => d3.line()(this.convertVisibleArea(d.visible_area)))
        .attr("fill", "#888")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.15)
        .attr("stroke-dasharray", "2 2");
    }
    drawWatermark(sel) {
      sel
        .append("image")
        .attr(
          "xlink:href",
          "https://dtai.cs.kuleuven.be/sports/static/ee39fa2918398059e9be62c32c1b48c4/74404/statsbomb_logo.png"
        )
        .attr("opacity", 0.2)
        .attr("x", 52.5)
        .attr("y", 60)
        .attr("width", 52.5);
    }

    mouseoverEvent(thisClass, event, d) {
      thisClass.tooltip.show(event, d);
    }

    mousemoveEvent(thisClass, event, d) {
      thisClass.tooltip.setText(
        ``
      );
      thisClass.tooltip.move(event, d);
    }

    mouseleaveEvent(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }

    convertVisibleArea(d) {
      const res = [];
      for (let i = 0; i < d.length; i += 2) {
        res.push([this.sx(d[i]), this.sy(d[i + 1])]);
      }
      return res;
    }

    drawfreezeFrame(sel) {
        drawDots(sel.append('g'), {
            data: this.data.freeze_frame,
            cx: d => this.sx(d.location[0]),
            cy: d => this.sy(d.location[1]),
            r: 1.5,
            fill: d => this.sc(d.teammate),
        })

        drawDots(sel.append('g'), {
            data: this.data.freeze_frame.filter(d=>d.actor),
            cx: d => this.sx(d.location[0]),
            cy: d => this.sy(d.location[1]),
            r: 4,
            fill: 'none',
            stroke: d=>this.sc(d.actor),
            "stroke-width": 0.5,
            "stroke-dasharray": '4 4',
            opacity: 0.8
        })
    }

    draw() {

      this.setAxes();
      this.svg.call(this.drawPitch.bind(this));
      this.svg.select('#above').append('g').call(this.drawWatermark.bind(this));
      this.svg.select('#above').append('g').call(this.draw360.bind(this));
      this.svg.select('#above').append('g').call(this.drawfreezeFrame.bind(this));
    }
  }