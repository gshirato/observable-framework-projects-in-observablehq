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
      this.type = this.config["type"];
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

        this.sc = d3.scaleSequential(d3.interpolate('white', this.teamColor)).domain([0, 1])

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

    passLocation(d) {
      if (this.type === 'from') return d.location;
      if (this.type === 'to') return d.pass.end_location;
      console.error(new Error(`Unknown type: ${this.type}`));
    }

    drawEvents(sel) {
      const layer = sel.select('#above')

      layer.append('g')
        .selectAll('circle')
        .data(this.data)
        .join('circle')
        .attr('cx', d=>this.sx(this.passLocation(d)[0]))
        .attr('cy', d=>this.sy(this.passLocation(d)[1]))
        .attr('r', 0.6)
        .attr('fill', this.teamColor)
      }

      drawHeatmap(sel) {
        const rectbin = this.soccer.rectbin()
          .x(d => this.sx(this.passLocation(d)[0]))
          .y(d => this.sy(this.passLocation(d)[1]))
          .dx(5)
          .dy(4);

        const layer = sel.select('#above')
        layer
          .append('g')
          .selectAll('rect')
          .data(rectbin(this.data))
          .join('rect')
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .attr('width', d => d.width)
          .attr('height', d => d.height)
          .attr('fill', d => this.sc(d.value))
          .attr('opacity', 0.5)
          .on('mouseover', _.partial(this.mouseover, this))
          .on('mousemove', _.partial(this.mousemove, this))
          .on('mouseleave', _.partial(this.mouseleave, this))

    }

    mouseover(thisClass, event, d) {
      d3.select(this).attr('stroke', 'black').attr('stroke-width', 1);
      thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
      thisClass.tooltip.setText(d.value)
      thisClass.tooltip.move(event, d);
    }

    mouseleave(thisClass, event, d) {
      d3.select(this).attr('stroke', 'none').attr('stroke-width', 0);
      thisClass.tooltip.hide(event, d);
    }



    draw() {

      this.setAxes();
      this.svg.call(this.drawPitch.bind(this));

      this.svg.call(this.drawWatermark.bind(this));
      this.svg.call(this.drawEvents.bind(this));
      this.svg.call(this.drawHeatmap.bind(this));
    }
  }