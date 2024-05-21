import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import addEmoji from "./countryEmojis.js";
import sec2mmss from './sec2mmss.js';
export default class DetailChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.soccer = config['soccerModule'];
        this.duration = this.data[this.data.length - 1].event_sec - this.data[0].event_sec;
        this.initPitch();
        this.setAxes();
    }
    initPitch() {
      this.pitch = this.soccer.pitch().height(this.height).clip([[-10, -5], [115, 70]])

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
        .attr('stroke-width', 0.5)

      layer
        .append('g')
        .append('circle')
        .datum(this.data[0])
        .attr('l', d => console.log(d))
        .attr('cx', d => d.start_x)
        .attr('cy', d => d.start_y)
        .attr('r', 2)
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('fill', 'white')

      layer
        .append('g')
        .append('circle')
        .datum(this.data[this.data.length - 1])
        .attr('l', d => console.log(d))
        .attr('cx', d => d.end_x)
        .attr('cy', d => d.end_y)
        .attr('r', 2)
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('fill', 'white')

      layer
        .append('g')
        .append('text')
        .datum(this.data[0])
        .attr('l', d => console.log(d))
        .attr('x', d => d.start_x)
        .attr('y', d => d.start_y)
        .attr('font-size', 4)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text('s')

      layer
        .append('g')
        .append('text')
        .datum(this.data[this.data.length - 1])
        .attr('x', d => d.end_x)
        .attr('y', d => d.end_y)
        .attr('font-size', 4)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text('e')
    }

    draw() {
      this.svg.call(this.drawPitch.bind(this));
      this.svg.call(this.drawEpisode.bind(this));
      this.svg.call(this.drawTitle.bind(this));
      this.svg.call(this.drawLegend.bind(this));
    }

    drawTitle(sel) {
      const layer = sel.select('#above').append('g')

      layer
        .append("text")
        .datum(this.data[0])
        .attr("x", 52.5)
        .attr("y", 0)
        .attr("dy", -6)
        .attr("text-anchor", "middle")
        .attr("font-size", 5)
        .attr("font-family", 'Arial')
        .html(d=>`[${d.match_id}] ${addEmoji(d.first_pass_team)} (episode=${d.episode}, ${this.duration.toFixed(2)} sec)`);

      layer
        .append("text")
        .attr("x", 52.5)
        .attr("y", 0)
        .attr("dy", -1)
        .attr("text-anchor", "middle")
        .attr("font-size", 5)
        .attr("font-family", 'Arial')
        .html(d=>`(#=${this.data.length}) ${this.data[0].event_name} ⇒ ... ⇒ ${this.data[this.data.length - 1].event_name} [${sec2mmss(this.data[0].event_sec)} → ${sec2mmss(this.data[this.data.length - 1].event_sec)}]`);
    }

    drawLegend(sel) {
      const layer = sel.select('#above').append('g')

      layer
        .append('g')
        .selectAll('circle')
        .data(this.sc.domain().slice(0, 4))
        .join('circle')
        .attr('cx', (d,i) => 5 + i*20)
        .attr('cy', 68 + 5)
        .attr('r', 2)
        .attr('fill', d=>this.sc(d))
        .attr('stroke-width', 0.3)
        .attr('stroke', '#333')

      layer
        .append('g')
        .selectAll('text')
        .data(this.sc.domain().slice(0, 4))
        .join('text')
        .attr('x', (d,i) => 8 + i*20)
        .attr('y', 68 + 5)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 5)
        .attr('font-family', 'sans-serif')
        .text(d=>d.replace('Free Kick', 'FK or Throw In'))

      layer
        .append('g')
        .selectAll('circle')
        .data(this.sc.domain().slice(4, 7))
        .join('circle')
        .attr('cx', (d,i) => 5 + i*40)
        .attr('cy', 68 + 10)
        .attr('r', 2)
        .attr('fill', d=>this.sc(d))
        .attr('stroke-width', 0.3)
        .attr('stroke', '#333')

      layer
        .append('g')
        .selectAll('text')
        .data(this.sc.domain().slice(4, 7))
        .join('text')
        .attr('x', (d,i) => 8 + i*40)
        .attr('y', 68 + 10)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 5)
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