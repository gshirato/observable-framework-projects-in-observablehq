import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../chart/components/GeneralChart.js";
import addEmoji from "./countryEmojis.js";
import sec2mmss from './sec2mmss.js';
export default class SingleEventChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.soccer = config['soccerModule'];
        this.initPitch();
        this.setAxes();
    }
    initPitch() {
      this.pitch = this.soccer.pitch()
        .height(this.height)
        .clip([[-10, -5], [115, 75]])
        .showDirOfPlay(true)

    }
    setAxes() {
      this.sc = d3.scaleOrdinal()
        .domain(['Pass', 'Shot', 'Duel', 'Free Kick', 'Save Attempt', 'Goalkeeper leaving line', 'Offside'])
        .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'])
        .unknown('grey')
    }

    drawPitch(sel) {
      sel.append("g").call(this.pitch);
    }

    drawEpisode(sel) {
      const layer = sel.select('#above').append('g')

      layer
        .append('g')
        .selectAll('circle')
        .data(this.data)
        .join('circle')
        .attr('cx', d => d.start_x)
        .attr('cy', d => d.start_y)
        .attr('r', 0.8)
        .attr('fill', d=>this.sc(d.event_name))

      layer
        .append('g')
        .selectAll('line')
        .data(this.data)
        .join('line')
        .attr('x1', d => d.start_x)
        .attr('y1', d => d.start_y)
        .attr('x2', d => d.end_x)
        .attr('y2', d => d.end_y)
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('opacity', d=>d.team_name === d.first_pass_team? 1: 0.2)
        .attr('stroke-dasharray', d=>d.team_name === d.first_pass_team? '': '2 2')
        .attr('stroke-width', 0.1)
        .attr('opacity', 0.2)
    }

    draw() {
      this.svg.call(this.drawPitch.bind(this));
      this.svg.call(this.drawEpisode.bind(this));
      this.svg.call(this.drawLegend.bind(this));
    }

    drawLegend(sel) {
        const layer = sel.select('#above').append('g')
        layer
            .append('g')
            .selectAll('circle')
            .data(this.sc.domain().slice(0, 4))
            .join('circle')
            .attr('cx', (d,i) => 5 + i*20)
            .attr('cy', 68 + 2)
            .attr('r', 1)
            .attr('fill', d=>this.sc(d))
            .attr('stroke-width', 0.3)
            .attr('stroke', '#333')

        layer
            .append('g')
            .selectAll('text')
            .data(this.sc.domain().slice(0, 4))
            .join('text')
            .attr('x', (d,i) => 8 + i*20)
            .attr('y', 68 + 3)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'baseline')
            .attr('font-size', 3)
            .attr('font-family', 'sans-serif')
            .text(d=>d.replace('Free Kick', 'FK or Throw In'))

        layer
            .append('g')
            .selectAll('circle')
            .data(this.sc.domain().slice(4, 7))
            .join('circle')
            .attr('cx', (d,i) => 5 + i*40)
            .attr('cy', 68 + 5)
            .attr('r', 1)
            .attr('fill', d=>this.sc(d))
            .attr('stroke-width', 0.3)
            .attr('stroke', '#333')

        layer
            .append('g')
            .selectAll('text')
            .data(this.sc.domain().slice(4, 7))
            .join('text')
            .attr('x', (d,i) => 8 + i*40)
            .attr('y', 68 + 5)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('font-size', 3)
            .attr('font-family', 'sans-serif')
            .text(d=>d.replace('Goalkeeper', 'GK'))
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