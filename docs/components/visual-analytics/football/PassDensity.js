import * as d3 from "npm:d3";
import GeneralChart from "../../GeneralChart.js";
import _ from "npm:lodash";


export default class PassDensityChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.teamId = this.config["teamId"];
      this.teamName = this.config["teamName"];
      this.teamColor = this.config["teamColor"];
      this.soccer = this.config["soccerModule"];
      this.pitch = this.soccer.pitch()
        .height(this.height)
        .showDirOfPlay(true)
        .clip([[-10, -10], [115, 78]]);
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

        this.svg.append("g")
          .append('text')
          .attr('x', this.pitch.width() / 2)
          .attr('y', this.margin.top - 5)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'bottom')
          .style('font-size', 16)
          .text(`${this.teamName} (Attacking→)`)
    }

    drawPitch(sel) {
      sel.append("g")
        .call(this.pitch)
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
        .attr("y", this.pitch.height() - 30)
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
      const layer = sel.select('#above')

      layer.append('g')
        .selectAll('circle')
        .data(this.data)
        .join('circle')
        .attr('cx', d=>this.sx(d.location[0]))
        .attr('cy', d=>this.sy(d.location[1]))
        .attr('r', 0.6)
        .attr('fill', this.teamColor)
        .on('mouseover', _.partial(this.mouseover, this))
        .on('mousemove', _.partial(this.mousemove, this))
        .on('mouseleave', _.partial(this.mouseleave, this))
    }

    drawHeatmap(sel) {
      const rectbin = this.soccer.rectbin()
        .x(d => this.sx(d.location[0]))
        .y(d => this.sy(d.location[1]))
        .dx(5)
        .dy(4);

      const bins = rectbin(this.data);
      const heatmap = this.soccer
        .heatmap(this.pitch)
        .colorScale(d3.scaleSequential(d3.interpolate('white', this.teamColor)).domain([0, 1]))
        .parent_el('#above')

      sel.append('g')
        .datum(bins)
        .call(heatmap)
        .attr('opacity', 0.5)
    }

    draw() {

      this.setAxes();
      this.svg.call(this.drawPitch.bind(this));

      this.svg.call(this.drawWatermark.bind(this));
      this.svg.call(this.drawEvents.bind(this));
      this.svg.call(this.drawHeatmap.bind(this));
    }
  }