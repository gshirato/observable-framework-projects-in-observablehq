import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import DetailChart from "./detail.js";
import addEmoji from "./countryEmojis.js";
import sec2mmss from './sec2mmss.js';


export default class SmallMultiplesChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.soccer = config['soccerModule'];

        this.initPitch();
        this.setAxes();
        this.duration = this.data[this.data.length - 1].event_sec - this.data[0].event_sec;
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

    hasIncorrectStartPos(d) {
      if (d.start_x === 0 && d.start_y === 68) return true;
      return false;
    }

    hasIncorrectEndPos(d) {
      if (d.event_name === 'Shot') return true;
      if (d.end_x === 0 && d.end_y === 68) return true;
      return false;
    }


    drawEpisode(sel) {
      const layer = sel.select('#above').append('g')

      layer
        .append('g')
        .selectAll('circle')
        .data(this.data)
        .join('circle')
        .attr('cx', d => this.hasIncorrectStartPos(d) ? d.end_x: d.start_x)
        .attr('cy', d => this.hasIncorrectStartPos(d) ? d.end_y: d.start_y)
        .attr('r', 0.8)
        .attr('fill', d=>this.sc(d.event_name))

      layer
        .append('g')
        .selectAll('line')
        .data(this.data)
        .join('line')
        .attr('x1', d => this.hasIncorrectStartPos(d) ? d.end_x: d.start_x)
        .attr('y1', d => this.hasIncorrectStartPos(d) ? d.end_y: d.start_y)
        .attr('x2', d => this.hasIncorrectEndPos(d) ? d.start_x : d.end_x)
        .attr('y2', d => this.hasIncorrectEndPos(d) ? d.start_y : d.end_y)
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('opacity', d=>d.team_name === d.first_pass_team? 1: 0.2)
        .attr('stroke-dasharray', d=>d.team_name === d.first_pass_team? '': '2 2')
        .attr('stroke-width', 0.5)

        layer
        .append('g')
        .append('circle')
        .datum(this.data[0])
        .attr('cx', d => d.start_x)
        .attr('cy', d => d.start_y)
        .attr('r', 2)
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('fill', 'white')

      layer
        .append('g')
        .append('circle')
        .datum(this.data[this.data.length - 1])
        .attr('cx', d => this.hasIncorrectEndPos(d) ? d.start_x : d.end_x)
        .attr('cy', d => this.hasIncorrectEndPos(d) ? d.start_y : d.end_y)
        .attr('r', 2)
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('fill', 'white')

      layer
        .append('g')
        .append('text')
        .datum(this.data[0])
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
        .attr('x', d => this.hasIncorrectEndPos(d) ? d.start_x : d.end_x)
        .attr('y', d => this.hasIncorrectEndPos(d) ? d.start_y : d.end_y)
        .attr('font-size', 4)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text('e')
    }

    draw() {
      this.svg.call(this.drawPitch.bind(this));
      this.svg.call(this.drawEpisode.bind(this));
      this.svg.call(this.drawTitle.bind(this));
      this.svg.call(this.drawMiniSequence.bind(this));
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
        .attr('cx', d => sx(d.event_sec - this.data[0].event_sec))
        .attr('cy', 72)
        .attr('r', 1.5)
        .attr('fill', d=>this.sc(d.event_name))
        .attr('stroke', 'none')
        .attr('opacity', d=>d.team_name === d.first_pass_team? 1: 0.2)

      layer
        .append('g')
        .selectAll('circle')
        .data(this.data)
        .join('circle')
        .attr('cx', d => sx(d.event_sec - this.data[0].event_sec))
        .attr('cy', 72)
        .attr('r', 1.5)
        .attr('fill', 'none')
        .attr('stroke', d=>this.sc(d.event_name))
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
        .html(d=>`[${d.match_id}] ${addEmoji(d.first_pass_team)}${d.first_pass_team} (episode=${d.episode}, ${this.duration.toFixed(0)} sec)`);

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
          .data(['#', 'Period', 'Time', 'Event', 'Detail', 'Player', 'Team', 'X1', 'Y1', 'X2', 'Y2'])
          .join('th')
          .text(d => d);

      // Add table body
      const tbody = d3.select(`${thisClass.rootSelector} .table`)
          .append('tbody');

      tbody.selectAll('tr')
          .data(thisClass.data)
          .join('tr')
          .selectAll('td')
          .data((d, i) => [i, d.match_period, sec2mmss(d.event_sec), d.event_name, d.sub_event_name, d.player_name, addEmoji(d.team_name), d.start_x, d.start_y, d.end_x, d.end_y])
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