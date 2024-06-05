import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../../chart/components/GeneralChart.js";
import getUniqueArray from '../../../chart/components/utils.js';
import tagsStr2List from "../tagsStr2List.js";
import sec2mmss from "../sec2mmss.js";
import getEmoji from "../emoji/countryEmojis.js";
import emojis from "../emoji/list.js";


const tagMeanings = {
    101: "Goal",
    102: "Own goal",
    301: "Assist",
    302: "Key pass",
    1901: "Penalty",
    201: "Free kick shot",
    202: "Corner",
}

export default class EventTimelineChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.episodes = this.groupEvents(data);
        this.config = config;
        this.summary = this.config.summary;
        this.setAxes();
    }

    groupEvents(data) {
        return Array.from(d3.group(data, d => d.episode), ([episode, events]) => {
            return events
        })
    }

    setAxes() {
        this.sx = d3.scaleLinear()
            .domain([0, d3.max([3000, d3.max(this.data, d => d.event_sec)])])
            .range(this.domainLeftToRight)

        this.sy = d3.scaleBand()
            .domain(Array.from(d3.union(this.data.map(d => d.match_period))))
            .range(this.domainTopToBottom)
            .padding(0.1)

        this.scTeam = d3.scaleOrdinal()
            .domain(getUniqueArray(this.data.map(d => d.main_team)))
            .range(["#333", "#ccc"])

        this.scEvent = d3.scaleOrdinal()
            .domain(['Pass', 'Shot', 'Duel', 'Free Kick', 'Save Attempt', 'Goalkeeper leaving line', 'Offside'])
            .range(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'])
            .unknown('red')
    }

    drawAxes(sel) {
        const xAxis = d3.axisBottom(this.sx).tickFormat(sec2mmss);
        const yAxis = d3.axisLeft(this.sy);

        sel.append("g")
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(xAxis);

        sel.append("g")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(yAxis);
    }

    drawEpisodes(sel) {
        sel
            .append("g")
            .selectAll("rect")
            .data(this.episodes)
            .join("rect")
            .attr("x", d => this.sx(d3.min(d, e => e.event_sec)))
            .attr("y", d => this.sy(d[0].match_period) + this.sy.bandwidth() / 2 - this.sy.bandwidth() / 8)
            .attr('width', d => this.sx(d3.max(d, e => e.event_sec)) - this.sx(d3.min(d, e => e.event_sec)))
            .attr('height', this.sy.bandwidth() / 4)
            .attr("r", 5)
            .attr("stroke", '#888')
            .attr("stroke-width", 1.1)
            .attr("fill", d => this.scTeam(d[0].main_team));
    }

    isImportantEvent(d) {
        // 101: Goal
        if (tagsStr2List(d.tags).includes(101)) return true;
        // 102: Own goal
        if (tagsStr2List(d.tags).includes(102)) return true;
        // 302: Key pass
        // if (tagsStr2List(d.tags).includes(302)) return true;
        if (d.sub_event_name === "Penalty") return true;
        // if (d.sub_event_name === "Free kick shot") return true;
        if (d.sub_event_name === "Goal") return true;
        return false;
    }

    drawImportantEvents(sel) {
        sel
            .append("g")
            .selectAll("circle")
            .data(this.data.filter(d => this.isImportantEvent(d)))
            .join("circle")
            .attr("cx", (d, i) => this.sx(d.event_sec) + i % 2 * 10 - 5)
            .attr("cy", d => this.sy(d.match_period) + this.sy.bandwidth() / 4)
            .attr("r", 5)
            .attr("stroke-width", 2.2)
            .attr("stroke", d=>this.scEvent(d.sub_event_name))
            .attr("fill", "white")
            .attr("opacity", 10)
            .on("mouseover", _.partial(this.mouseover, this))
            .on("mousemove", _.partial(this.mousemove, this))
            .on("mouseleave", _.partial(this.mouseleave, this));

        sel
            .append('g')
            .selectAll('text')
            .data(this.data.filter(d => this.isImportantEvent(d)))
            .join('text')
            .attr("x", (d, i) => this.sx(d.event_sec) + i % 2 * 10 - 5)
            .attr('y', d => this.sy(d.match_period) + this.sy.bandwidth() / 4)
            .attr('pointer-events', 'none')
            .attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text(d => d.sub_event_name[0])
            .attr('font-size', '6px')

        sel
            .append('g')
            .selectAll('text')
            .data(this.data.filter(d => this.isImportantEvent(d)))
            .join('text')
            .attr("x", (d, i) => this.sx(d.event_sec) + i % 2 * 10 - 5)
            .attr('y', d => this.sy(d.match_period) + this.sy.bandwidth() / 4)
            .attr('dy', -10)
            .attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text(d => emojis[d.team_name])
            .attr('font-size', '10px')
    }



    draw() {
        this.svg.call(this.drawAxes.bind(this));
        this.svg.call(this.drawEpisodes.bind(this));
        this.svg.call(this.drawImportantEvents.bind(this));
        this.svg.call(this.drawTitle.bind(this));

    }

    addEmojiToLabel(label) {
        const [teams, score] = label.split(', ');
        const emojis = teams.split(' - ').map(team => getEmoji(team)).join(' vs ');
        return `${emojis} (${score})`;
    }

    drawTitle(sel) {
        sel
            .append('text')
            .attr('x', this.margin.left)
            .attr('y', this.margin.top / 2)
            .attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .text(this.addEmojiToLabel(this.summary.label))
            .attr('font-size', '20px')
    }

    mouseover(thisClass, event, d) {
        thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
        thisClass.tooltip.setText(
            `<b>${d.match_period} ${sec2mmss(d.event_sec)}</b> <br>
            ${d.event_name} (${d.sub_event_name})<br>${tagsStr2List(d.tags).map(tag => tagMeanings[tag]).filter(d=>d !== undefined).join(', ')}`
        );
        thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }
  }
