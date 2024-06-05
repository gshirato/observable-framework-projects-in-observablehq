import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../../chart/components/GeneralChart.js";
import getUniqueArray from '../../../chart/components/utils.js';
import tagsStr2List from "../tagsStr2List.js";
import sec2mmss from "../sec2mmss.js";
import emojis from "../emoji/list.js";
import addEmojiToLabel from "../emoji/addToLabel.js";
import getEmoji from "../emoji/getEmoji.js";

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
            .padding(0.6)

        this.scTeam = d3.scaleOrdinal()
            .domain(getUniqueArray(this.data.map(d => d.main_team)))
            .range(["#333", "#ccc"])

        this.scEventLabel = d3.scaleOrdinal()
            .domain(['Goal', 'Own goal', 'Penalty', 'Penalty non goal'])
            .range(['#b2df8a','#1f78b4','#fb9a99','#a6cee3'])
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
            .attr("y", d => this.sy(d[0].match_period))
            .attr('width', d => this.sx(d3.max(d, e => e.event_sec)) - this.sx(d3.min(d, e => e.event_sec)))
            .attr('height', this.sy.bandwidth() )
            .attr("r", 5)
            .attr("stroke", '#888')
            .attr("stroke-width", 1.1)
            .attr("fill", d => this.scTeam(d[0].main_team));
    }

    isImportantEvent(d) {
        if (d.event_name === "Save attempt") return false;
        // 101: Goal
        if (tagsStr2List(d.tags).includes(101)) return true;
        // 102: Own goal
        if (tagsStr2List(d.tags).includes(102)) return true;
        if (d.sub_event_name === "Penalty") return true;
        // if (d.sub_event_name === "Free kick shot") return true;
        // if (d.sub_event_name === "Goal") return true;
        return false;
    }

    getEventLabel(d) {
        if (d.sub_event_name === "Penalty") {
            if (tagsStr2List(d.tags).includes(101)) return "Penalty";
            return "Penalty non goal";
        }
        if (tagsStr2List(d.tags).includes(101)) return "Goal";
        if (tagsStr2List(d.tags).includes(102)) return "Own goal";
        return undefined;
    }

    drawImportantEvents(sel) {
        sel
            .append("g")
            .selectAll("circle")
            .data(this.data.filter(d => this.isImportantEvent(d)))
            .join("circle")
            .attr("cx", (d, i) => this.sx(d.event_sec) + (i % 3 - 1) * 3)
            .attr("cy", d => this.sy(d.match_period) - this.sy.bandwidth() / 2)
            .attr("r", 5)
            .attr("stroke-width", 2.7)
            .attr("stroke", d=>this.scEventLabel(this.getEventLabel(d)))
            .attr("fill", "white")
            .attr("opacity", 1)
            .on("mouseover", _.partial(this.mouseover, this))
            .on("mousemove", _.partial(this.mousemove, this))
            .on("mouseleave", _.partial(this.mouseleave, this));

        sel
            .append('g')
            .selectAll('text')
            .data(this.data.filter(d => this.isImportantEvent(d)))
            .join('text')
            .attr("x", (d, i) => this.sx(d.event_sec) + (i % 3 - 1) * 3)
            .attr('y', d => this.sy(d.match_period) - this.sy.bandwidth() / 2)
            .attr('pointer-events', 'none')
            .attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text(d => emojis[d.team_name])
            .attr('font-size', '8px')

    }



    draw() {
        this.svg.call(this.drawAxes.bind(this));
        this.svg.call(this.drawEpisodes.bind(this));
        this.svg.call(this.drawImportantEvents.bind(this));
        this.svg.call(this.drawTitle.bind(this));
        this.svg.call(this.drawLegend.bind(this));

    }

    drawLegend(sel) {
        sel
            .append('g')
            .selectAll('rect')
            .data(this.scTeam.domain())
            .join('rect')
            .attr('x', (_, i) => this.width - this.margin.right - (i + 1) * 50 )
            .attr('y', this.margin.top)
            .attr('width', 45)
            .attr('height', 5)
            .attr('fill', d=>this.scTeam(d))
            .attr('stroke', '#888')

        sel
            .append('g')
            .selectAll('text')
            .data(this.scTeam.domain())
            .join('text')
            .attr('x', (_, i) => this.width - this.margin.right - (i + 1) * 50 )
            .attr('y', this.margin.top)
            .attr('width', 45)
            .attr('height', 15)
            .attr('fill', '#333')
            .text(d=>getEmoji(d))

    }

    drawTitle(sel) {
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
