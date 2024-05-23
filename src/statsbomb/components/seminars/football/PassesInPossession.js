import * as d3 from "npm:d3";
import GeneralChart from "../../../../chart/components/GeneralChart.js";
import _ from "npm:lodash";


export default class PassesInPossessionChart extends GeneralChart {
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
    }

    drawPitch(sel) {
      sel.append("g").call(this.pitch);
    }
    drawWatermark(sel) {
      sel
        .append("image")
        .attr(
          "xlink:href",
          "https://dtai.cs.kuleuven.be/sports/static/ee39fa2918398059e9be62c32c1b48c4/74404/statsbomb_logo.png"
        )
        .attr("opacity", 0.2)
        .attr("x", this.pitch.width() - this.margin.right - 180)
        .attr("y", this.pitch.height() - this.margin.bottom - 22)
        .attr("width", 200);
    }

    mouseover(thisClass, event, d) {
      thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
      thisClass.tooltip.setText(
        `[${d.index - d3.min(thisClass.data, d=>d.index)}] ${thisClass.formatTime(d)} ${d.player.name} (${d.possession_team.name}) <br> ${d.type.name}`
      );
      thisClass.tooltip.move(event, d);
    }

    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }

    formatTime(d) {
        return `${d.minute.toString().padStart(2, '0')}:${d.second.toString().padStart(2, '0')}`;
    }



    drawEvents(sel) {
      sel.append('g')
        .selectAll('line')
        .data(this.data)
        .join('line')
        .attr('x1', d => this.sx(d.location[0]))
        .attr('y1', d => this.sy(d.location[1]))
        .attr('x2', d => this.sx(d.location[0] + d.pass.end_location[0] - d.location[0]))
        .attr('y2', d => this.sy(d.location[1] + d.pass.end_location[1] - d.location[1]))
        .attr('stroke', 'orange')

        sel.append('g')
        .selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('cx', d => this.sx(d.location[0]))
            .attr('cy', d => this.sy(d.location[1]))
            .attr('r', 8)
            .attr('fill', 'orange')
            .attr('opacity', 0.2)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this));

        sel.append('g')
            .selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('cx', d => this.sx(d.location[0]))
            .attr('cy', d => this.sy(d.location[1]))
            .attr('r', 8)
            .attr('fill', 'none')
            .attr('stroke', 'orange')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', (_, i) => i === this.data.length - 1 ? '4,2' : 'none')
            .attr('opacity', 0.8)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this));

        sel.append('g')
            .selectAll('text')
            .data(this.data)
            .join('text')
            .attr('x', d => this.sx(d.location[0]))
            .attr('y', d => this.sy(d.location[1]))
            .attr('dy', 0)
            .attr('opacity', 0.8)
            .attr('font-size', 12)
            .attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('pointer-events', 'none')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', 'black')
            .text(d => d.index - d3.min(this.data, d=>d.index));

    }


    draw() {

      this.setAxes();
      this.svg.call(this.drawPitch.bind(this));

      this.svg.call(this.drawWatermark.bind(this));
      this.svg.call(this.drawEvents.bind(this));
    }
  }