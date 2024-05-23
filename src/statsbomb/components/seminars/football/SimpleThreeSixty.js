import * as d3 from "npm:d3";
import GeneralChart from "../../../../chart/components/GeneralChart.js";
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
            .range([this.margin.left, this.pitch.width() - this.margin.right]);

        this.sy = d3
            .scaleLinear()
            .domain([0, 80])
            .range([this.margin.top, this.pitch.height() - this.margin.bottom]);

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
        .attr("opacity", 0.15)
        .attr("stroke-dasharray", "4 4");
    }
    drawWatermark(sel) {
      sel
        .append("image")
        .attr(
          "xlink:href",
          "https://dtai.cs.kuleuven.be/sports/static/ee39fa2918398059e9be62c32c1b48c4/74404/statsbomb_logo.png"
        )
        .attr("opacity", 0.2)
        .attr("x", this.pitch.width() - this.margin.right - 200)
        .attr("y", this.pitch.height() - this.margin.bottom - 22)
        .attr("width", 200);
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
        sel
            .append('g')
            .selectAll('circle')
            .data(this.data.freeze_frame)
            .join('circle')
            .attr('cx', d => this.sx(d.location[0]))
            .attr('cy', d => this.sy(d.location[1]))
            .attr('r', 5)
            .attr('fill', d=>this.sc(d.teammate))

        sel
            .append('g')
            .append('circle')
            .datum(this.data.freeze_frame.find(d=>d.actor))
            .attr('cx', d => this.sx(d.location[0]))
            .attr('cy', d => this.sy(d.location[1]))
            .attr('r', 10)
            .attr('fill', 'none')
            .attr('stroke', d=>this.sc(d.actor))
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4 4')
            .attr('opacity', 0.8)



    }

    draw() {

      this.setAxes();
      this.svg.call(this.drawPitch.bind(this));
      this.svg.call(this.draw360.bind(this));
      this.svg.call(this.drawWatermark.bind(this));
      this.svg.call(this.drawfreezeFrame.bind(this));
    }
  }