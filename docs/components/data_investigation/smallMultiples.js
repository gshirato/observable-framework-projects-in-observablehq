import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import DetailChart from "./detail.js";
import getEmoji from "./countryEmojis.js";

export default class SmallMultiplesChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.soccer = config['soccerModule'];
        this.initPitch();
        this.setAxes();
    }
    initPitch() {
      this.pitch = this.soccer.pitch().height(this.height).clip([[0, -5], [105, 70]])

    }
    setAxes() {
      this.sOpacity = d3.scaleLinear()
        .domain([1, 40])
        .range([0.01, 0.2])

      this.sc = d3.scaleOrdinal()
        .domain(['Pass', 'Shot', 'Duel', 'Free Kick', 'Save Attempt', 'Goalkeeper leaving line', 'Offside'])
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
        .data(this.data)
        .join('circle')
        .attr('cx', d => d.start_x)
        .attr('cy', d => d.start_y)
        .attr('r', 1)
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
        .attr('stroke-width', 0.5)
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
        .html(d=>`[${d.match_id}] ${getEmoji(d.first_pass_team)}${d.first_pass_team} (episode=${d.episode}, ${d.possession_duration.toFixed(2)} sec)`);

      layer
        .append("text")
        .attr("x", 52.5)
        .attr("y", 0)
        .attr("dy", -1)
        .attr("text-anchor", "middle")
        .attr("font-size", 5)
        .attr("font-family", 'Arial')
        .html(d=>`${this.data[0].event_name} ⇒ ... ⇒ ${this.data[this.data.length - 1].event_name} (#=${this.data.length})`);
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
        .attr('x', (_, i) => 8 + i*40)
        .attr('y', 68 + 10)
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', 5)
        .attr('font-family', 'sans-serif')
        .text(d=>d.replace('Goalkeeper', 'GK'))
    }

    mouseover(thisClass, event, d) {
      new DetailChart(
          thisClass.data,
          `${thisClass.rootSelector} .detail`,
          {
            width: 300,
            height: 300,
            margin: {top: 10, right: 10, bottom: 10, left: 10},
            soccerModule: thisClass.soccer,
          }
      ).draw();

      d3.select(`${thisClass.rootSelector} .table`).html('');

      // Add table header
      const header = d3.select(`${thisClass.rootSelector} .table`)
          .append('thead')
          .append('tr');

      header.selectAll('th')
          .data(['#', 'Event', 'Player', 'Team', 'Start X', 'Start Y'])
          .join('th')
          .text(d => d);

      // Add table body
      const tbody = d3.select(`${thisClass.rootSelector} .table`)
          .append('tbody');

      tbody.selectAll('tr')
          .data(thisClass.data)
          .join('tr')
          .selectAll('td')
          .data((d, i) => [i, d.event_name, d.player_name, d.team_name, d.start_x, d.start_y])
          .join('td')
          .text(d => d);

      thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
      thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }
  }