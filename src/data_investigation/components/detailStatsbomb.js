import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../chart/components/GeneralChart.js";
import sec2mmss from './sec2mmss.js';

export default class DetailChart extends GeneralChart {
  constructor(data, selector, config) {
      super(data, selector, config);
      // this.data = this.data.filter(d=> d.location !== undefined)
      this.soccer = config['soccerModule'];

      this.initPitch();
      this.setAxes();
      this.duration = this.eventSec(this.data[this.data.length - 1])- this.eventSec(this.data[0]);
  }
  initPitch() {
    this.pitch = this.soccer.pitch()
      .height(this.height)
      .clip([[0, -5], [105, 70]])
      .showDirOfPlay(true)

  }
  setAxes() {
    this.sOpacity = d3.scaleLinear()
      .domain([1, 40])
      .range([0.01, 0.2])

    this.sx = d3.scaleLinear()
      .domain([0, 120])
      .range([0, 105])

    this.sy = d3.scaleLinear()
      .domain([0, 80])
      .range([0, 68])

    this.sc = d3.scaleOrdinal()
      .domain(['Pass', 'Shot', 'Duel', 'Free Kick', 'Save Attempt', 'Goal Keeper', 'Offside'])
      .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'])
      .unknown('grey')
  }

  drawPitch(sel) {
    sel.append("g")
      .call(this.pitch)

    sel.select('#above').append('g')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 105)
      .attr('height', 68)
      .attr('fill', '#f00')
      .attr('opacity', this.sOpacity(this.data.length))
      .on('mouseover', _.partial(this.mouseover, this))
  }


  drawEpisode(sel) {
    const layer = sel.select('#above').append('g')

    layer
      .append('g')
      .selectAll('circle')
      .data(this.data.filter(d=>d.location !== undefined))
      .join('circle')
      .attr('cx', d => this.sx(d.location[0]))
      .attr('cy', d => this.sy(d.location[1]))
      .attr('r', 0.8)
      .attr('fill', d=>this.sc(d.type.name))

    layer
      .append('g')
      .selectAll('line')
      .data(this.data.filter(d=>['Pass', 'Shot', 'Carry'].includes(d.type.name)))
      .join('line')
      .attr('x1', d => this.sx(d.location[0]))
      .attr('y1', d => this.sy(d.location[1]))
      .attr('x2', d => this.sx(d[d.type.name.toLowerCase()].end_location[0]))
      .attr('y2', d => this.sx(d[d.type.name.toLowerCase()].end_location[1]))
      .attr('stroke', d=>this.sc(d.type.name))
      .attr('opacity', d=>d.team.name === d.possession_team.name? 1: 0.2)
      .attr('stroke-dasharray', d=>d.team.name === d.possession_team.name? '': '2 2')
      .attr('stroke-width', 0.5)

      if (this.data.filter(d=>d.location !== undefined).length === 0) return;

    layer
      .append('g')
      .selectAll('circle')
      .data([this.data.filter(d=>d.location !== undefined)[0]])
      .join('circle')
      .attr('cx', d => this.sx(d.location[0]))
      .attr('cy', d => this.sx(d.location[1]))
      .attr('r', 2)
      .attr('stroke', d=>this.sc(d.type.name))
      .attr('fill', 'white')

    layer
      .append('g')
      .selectAll('circle')
      .data(this.data.filter(d=>['Pass', 'Shot', 'Carry'].includes(d.type.name)).slice(-1))
      .join('circle')
      .attr('l', d=>console.log(this.data))
      .attr('cx', d => this.sx(d[d.type.name.toLowerCase()].end_location[0]))
      .attr('cy', d => this.sx(d[d.type.name.toLowerCase()].end_location[1]))
      .attr('r', 2)
      .attr('stroke', d=>this.sc(d.type.name))
      .attr('fill', 'white')

    layer
      .append('g')
      .selectAll('text')
      .data([this.data.filter(d=>d.location !== undefined)[0]])
      .join('text')
      .attr('x', d => this.sx(d.location[0]))
      .attr('y', d => this.sx(d.location[1]))
      .attr('font-size', 4)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text('s')

    layer
      .append('g')
      .selectAll('text')
      .data(this.data.filter(d=>['Pass', 'Shot', 'Carry'].includes(d.type.name)).slice(-1))
      .join('text')
      .attr('x', d => this.sx(d[d.type.name.toLowerCase()].end_location[0]))
      .attr('y', d => this.sx(d[d.type.name.toLowerCase()].end_location[1]))
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

  eventSec(d) {
    return d.minute * 60 + d.second;
  }

  drawMiniSequence(sel) {
    const layer = sel.select('#above').append('g')

    const sx = d3.scaleLinear()
      .domain([0, this.duration])
      .range([5, 100])

    layer
      .append('g')
      .selectAll('circle')
      .data(this.data)
      .join('circle')
      .attr('cx', d => sx(this.eventSec(d) - this.eventSec(this.data[0])))
      .attr('cy', 72)
      .attr('r', 1.5)
      .attr('fill', d=>this.sc(d.type.name))
      .attr('stroke', 'none')
      .attr('opacity', d=>d.team.name === d.possession_team.name? 1: 0.2)

    layer
      .append('g')
      .selectAll('circle')
      .data(this.data)
      .join('circle')
      .attr('cx', d => sx(this.eventSec(d) - this.eventSec(this.data[0])))
      .attr('cy', 72)
      .attr('r', 1.5)
      .attr('fill', 'none')
      .attr('stroke', d=>this.sc(d.type.name))
      .attr('stroke-width', 0.4)
      .attr('opacity', 0.8)


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
      .html(d=>`[${d.match_id}] ${d.possession_team.name} (episode=${d.possession}, ${this.duration.toFixed(0)} sec)`);

    layer
      .append("text")
      .attr("x", 52.5)
      .attr("y", 0)
      .attr("dy", -1)
      .attr("text-anchor", "middle")
      .attr("font-size", 5)
      .attr("font-family", 'Arial')
      .html(d=>`${this.data[0].type.name} ⇒ ... ⇒ ${this.data[this.data.length - 1].type.name} (#=${this.data.length})`);
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
}