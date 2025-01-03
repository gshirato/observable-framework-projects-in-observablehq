import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../chart/components/GeneralChart.js";
import addEmoji from "./emoji/addEmoji.js";
import sec2mmss from './sec2mmss.js';
export default class DetailChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.soccer = config['soccerModule'];
        this.main = config['main'];
        this.episode = config['episode'];
        this.originalData = config['originalData'];
        this.timelineClass = config['timelineClass'];
        this.nMiniDetails = config['nMiniDetails'];
        this.timelineSelector = config['timelineSelector'];
        this.duration = this.data[this.data.length - 1].event_sec - this.data[0].event_sec;
        this.initPitch();
        this.setAxes();
    }
    initPitch() {
      this.pitch = this.soccer.pitch()
        .height(this.height - this.margin.top - this.margin.bottom)
        .clip([[-10, -5], [115, 70]])
        .showDirOfPlay(true)

    }
    setAxes() {
      this.sx = d3.scaleLinear()
        .domain([0, 105])
        .range([0, 105])

      this.sy = d3.scaleLinear()
        .domain([0, 68])
        .range([68, 0])

      this.sc = d3.scaleOrdinal()
        .domain(['Pass', 'Shot', 'Duel', 'Free Kick', 'Save Attempt', 'Goalkeeper leaving line', 'Offside'])
        .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'])
        .unknown('grey')
    }

    drawPitch(sel) {
      sel.append("g").call(this.pitch);
      sel.select('.above').append('g').append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 105)
        .attr('height', 68)
        .attr('fill', 'none')
        .attr('stroke', 'none')
        .attr('pointer-events', 'all')
        .attr('cursor', 'pointer')
        .on('click', _.partial(this.onclick, this));
    }

    hasIncorrectStartPos(d) {
      if (d.start_x === 0 && d.start_y === 68) return true;
      if (d.start_x === 105 && d.start_y === 0) return true;
      return false;
    }

    hasIncorrectEndPos(d) {
      if (d.event_name === 'Shot') return true;
      if (d.end_x === 0 && d.end_y === 68) return true;
      if (d.end_x === 105 && d.end_y === 0) return true;
      return false;
    }

    drawEpisode(sel) {
      sel
        .append('g')
        .selectAll('circle')
        .data(this.data)
        .join('circle')
        .attr('cx', d => this.hasIncorrectStartPos(d) ? this.sx(d.end_x): this.sx(d.start_x))
        .attr('cy', d => this.hasIncorrectStartPos(d) ? this.sy(d.end_y): this.sy(d.start_y))
        .attr('r', 0.8)
        .attr('fill', d=>this.sc(d.event_name))

      sel
        .append('g')
        .selectAll('line')
        .data(this.data)
        .join('line')
        .attr('x1', d => this.hasIncorrectStartPos(d) ? this.sx(d.end_x): this.sx(d.start_x))
        .attr('y1', d => this.hasIncorrectStartPos(d) ? this.sy(d.end_y): this.sy(d.start_y))
        .attr('x2', d => this.hasIncorrectEndPos(d) ? this.sx(d.start_x) : this.sx(d.end_x))
        .attr('y2', d => this.hasIncorrectEndPos(d) ? this.sy(d.start_y) : this.sy(d.end_y))
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('opacity', d=>d.team_name === d.main_team? 1: 0.2)
        .attr('stroke-dasharray', d=>d.team_name === d.main_team? '': '2 2')
        .attr('stroke-width', 0.5)

        sel
        .append('g')
        .append('circle')
        .datum(this.data[0])
        .attr('cx', d => this.hasIncorrectStartPos(d) ? this.sx(d.end_x): this.sx(d.start_x))
        .attr('cy', d => this.hasIncorrectStartPos(d) ? this.sy(d.end_y): this.sy(d.start_y))
        .attr('r', 2)
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('fill', 'white')

      sel
        .append('g')
        .append('circle')
        .datum(this.data[this.data.length - 1])
        .attr('cx', d => this.hasIncorrectEndPos(d) ? this.sx(d.start_x) : this.sx(d.end_x))
        .attr('cy', d => this.hasIncorrectEndPos(d) ? this.sy(d.start_y) : this.sy(d.end_y))
        .attr('r', 2)
        .attr('stroke', d=>this.sc(d.event_name))
        .attr('fill', 'white')

      sel
        .append('g')
        .append('text')
        .datum(this.data[0])
        .attr('x', d => this.hasIncorrectStartPos(d) ? this.sx(d.end_x): this.sx(d.start_x))
        .attr('y', d => this.hasIncorrectStartPos(d) ? this.sy(d.end_y): this.sy(d.start_y))
        .attr('font-size', 4)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text('s')

      sel
        .append('g')
        .append('text')
        .datum(this.data[this.data.length - 1])
        .attr('x', d => this.hasIncorrectEndPos(d) ? this.sx(d.start_x) : this.sx(d.end_x))
        .attr('y', d => this.hasIncorrectEndPos(d) ? this.sy(d.start_y) : this.sy(d.end_y))
        .attr('font-size', 4)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text('e')
    }

    draw() {
      this.svg.call(this.drawPitch.bind(this));
      this.svg.select('.above').append('g').call(this.drawEpisode.bind(this));
      this.svg.select('.above').append('g').call(this.drawTitle.bind(this));
      this.svg.select('.above').append('g').call(this.drawLegend.bind(this));
    }

    drawTitle(sel) {
      sel
        .append("text")
        .datum(this.data[0])
        .attr("x", 52.5)
        .attr("y", 0)
        .attr("dy", -6)
        .attr("text-anchor", "middle")
        .attr("font-size", 5)
        .attr("font-family", 'Arial')
        .html(d=>`[${d.match_id}] ${addEmoji(d.main_team)} (episode=${d.episode}, ${this.duration.toFixed(2)} sec)`);

      sel
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
      if (!this.main) return;
      sel
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

      sel
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

      sel
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

      sel
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

    getRelEpisode(episode, i, timing) {
        return timing === 'before' ? episode - 3 + i : episode + (i + 1);
    }

    onclick(thisClass, event, d) {
      if (thisClass.main) return;
      if (thisClass.episode == null) return;

      thisClass.timelineClass.resetEpisodePosition()

      new DetailChart(thisClass.originalData.filter(e=>e.episode === thisClass.episode),
        `${thisClass.rootSelector} .selected-episode`,
        {
          ...thisClass.config,
          height: thisClass.height * 1.15,
          margin: {top: 0, right: 0, bottom: 0, left: 0},
          episode: thisClass.episode,
          main: true,
        }
      ).draw();

      thisClass.timelineClass.moveEpisode(`${thisClass.timelineSelector} .episode-${thisClass.episode}`, -3);

      for (const timing of ['before', 'after']) {
        for (let i = 0; i < thisClass.nMiniDetails; i++) {
            const relEpisode = thisClass.getRelEpisode(thisClass.episode, i, timing);
            new DetailChart(thisClass.originalData.filter(e=>e.episode === relEpisode),
                `${thisClass.rootSelector} .${timing} .episode-${i}`, {
                ...thisClass.config,
                height: thisClass.height,
                episode: relEpisode,
                main: false,
            }).draw();
            thisClass.timelineClass.moveEpisode(`${thisClass.timelineSelector} .episode-${relEpisode}`, 3);

        }
    }

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