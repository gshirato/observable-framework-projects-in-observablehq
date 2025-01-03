import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../../chart/components/GeneralChart.js";
import tagsStr2List from "../tagsStr2List.js";
import sec2mmss from "../sec2mmss.js";
import getEmoji from "../emoji/getEmoji.js";
import addEmoji from "../emoji/addEmoji.js";
import DetailChart from "../detail.js";

const tagMeanings = {
    101: "Goal",
    102: "Own goal",
    301: "Assist",
    302: "Key pass",
    1901: "Penalty",
    201: "Free kick shot",
    202: "Corner",
}

export class EventTimelineChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.episodes = this.groupEvents(data);
        this.config = config;
        this.summary = this.config.summary;
        this.soccer = this.config.soccerModule;
        this.detailRootSelector = this.config.detailRootSelector || this.rootSelector;
        this.isFixed = false
        this.nMiniDetails = 3;
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
            .domain(this.summary.label.split(',')[0].split(' - '))
            .range(["#333", "#ccc"])

        this.scEventLabel = d3.scaleOrdinal()
            .domain(['Goal', 'Own goal', 'Penalty goal', 'Penalty non goal'])
            .range(['#b2df8a','#1f78b4','#fb9a99','#bbb'])
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
            .attr("class", 'episode')
            .selectAll("rect")
            .data(this.episodes)
            .join("rect")
            .attr("x", d => this.sx(d3.min(d, e => e.event_sec)))
            .attr("y", d => this.sy(d[0].match_period))
            .attr('width', d => this.sx(d3.max(d, e => e.event_sec)) - this.sx(d3.min(d, e => e.event_sec)))
            .attr('height', this.sy.bandwidth() )
            .attr("r", 5)
            .attr('cursor', 'pointer')
            .attr('class', d => `episode-${d[0].episode}`)
            .attr('episode', d => d[0].episode)
            .attr("stroke", '#888')
            .attr("stroke-width", 1.1)
            .attr("fill", d => this.scTeam(d[0].main_team))
            .on("click", _.partial(this.onclick, this))
            .on("mouseover", _.partial(this.mouseoverEpisode, this))
            .on("mouseleave", _.partial(this.mouseleaveEpisode, this))
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
            if (tagsStr2List(d.tags).includes(101)) return "Penalty goal";
            return "Penalty non goal";
        }
        if (tagsStr2List(d.tags).includes(101)) return "Goal";
        if (tagsStr2List(d.tags).includes(102)) return "Own goal";
        return undefined;
    }

    getEpisode(d) {
        if (Array.isArray(d)) return d[0].episode;
        return d.episode;
    }

    drawImportantEvents(sel) {
        sel
            .append("g")
            .selectAll("circle")
            .data(this.data.filter(d => this.isImportantEvent(d)))
            .join("circle")
            .attr("cx", (d, i) => this.sx(d.event_sec) + (i % 3 - 1) * 3)
            .attr("cy", d => this.sy(d.match_period) - this.sy.bandwidth() / 2)
            .attr('episode', d => this.getEpisode(d))
            .attr("r", 5)
            .attr("stroke-width", 2.7)
            .attr("stroke", d=>this.scEventLabel(this.getEventLabel(d)))
            .attr("fill", "white")
            .attr("opacity", 1)
            .on("mouseover", _.partial(this.mouseoverEvent, this))
            .on("mousemove", _.partial(this.mousemoveEvent, this))
            .on("mouseleave", _.partial(this.mouseleaveEvent, this));

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
            .text(d=>getEmoji(d.team_name) === "🌍" ? d.team_name[0]: getEmoji(d.team_name))
            .attr('font-size', '8px')

    }



    draw() {
        this.svg.call(this.paintBG.bind(this), {fill: "none"});
        this.svg.call(this.drawAxes.bind(this));
        this.svg.call(this.drawEpisodes.bind(this));
        this.svg.call(this.drawImportantEvents.bind(this));
        this.svg.call(this.drawTitle.bind(this));
        this.svg.call(this.drawLegend.bind(this));
        this.svg.select('.bg').on('click', _.partial(this.unfix, this));
    }


    drawLegend(sel) {
        sel.call(this.drawLegendTeam.bind(this));
        sel.call(this.drawLegendEventLabel.bind(this));
    }

    drawLegendEventLabel(sel) {
        const cx = d3.scaleBand()
            .domain(this.scEventLabel.domain())
            .range([this.width / 2 - 100, this.width - this.margin.right - 120])

        sel
            .append('g')
            .append('line')
            .attr('x1', cx.range()[0] - 5)
            .attr('x2', cx.range()[1] - 5)
            .attr('y1', this.margin.top  + 5)
            .attr('y2', this.margin.top  + 5)
            .attr('stroke', '#888')
            .attr('stroke-width', 1.1)
            .attr('stroke-dasharray', '5,2')

        sel
            .append('g')
            .selectAll('circle')
            .data(this.scEventLabel.domain())
            .join('circle')
            .attr('cx', d => cx(d))
            .attr('cy', this.margin.top / 2)
            .attr('r', 5)
            .attr('fill', 'white')
            .attr('stroke', d => this.scEventLabel(d))
            .attr('stroke-width', 2.7)

        sel
            .append('g')
            .selectAll('text')
            .data(this.scEventLabel.domain())
            .join('text')
            .attr('x', d => cx(d) + 8)
            .attr('y', this.margin.top / 2)
            .attr('font-family', 'sans-serif')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('font-size', '8px')
            .text(d => d)

    }

    drawLegendTeam(sel) {
        sel
            .append('g')
            .selectAll('rect')
            .data(this.scTeam.domain())
            .join('rect')
            .attr('x', (_, i) => this.width - this.margin.right + (i) * 50 - 100)
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
            .attr('x', (_, i) => this.width - this.margin.right + (i) * 50 - 100)
            .attr('y', this.margin.top)
            .attr('width', 45)
            .attr('height', 15)
            .attr('fill', '#333')
            .text(d=>getEmoji(d) === "🌍" ? d[0]: getEmoji(d))

    }

    drawTitle(sel) {
    }

    drawDetail(episode, selector, config) {
        const episodeData = this.data.filter(d => d.episode === episode);

        new DetailChart(episodeData, selector, config).draw();
    }

    mouseoverEvent(thisClass, event, d) {
        thisClass.tooltip.show(event, d);
    }
    mousemoveEvent(thisClass, event, d) {
        thisClass.tooltip.setText(
            `<b>${d.match_period} ${sec2mmss(d.event_sec)}</b> <br>
            ${d.event_name} (${d.sub_event_name})<br>${tagsStr2List(d.tags).map(tag => tagMeanings[tag]).filter(d=>d !== undefined).join(', ')}`
        );
        thisClass.tooltip.move(event, d);
    }
    mouseleaveEvent(thisClass, event, d) {
        thisClass.tooltip.hide(event, d);
    }

    resetEpisodePosition() {
        this.svg.select('.episode').selectAll('rect')
            .transition()
            .duration(200)
            .attr("y", d => this.sy(d[0].match_period))
    }

    moveEpisode(selector, offset) {
        this.svg.select(selector)
            .transition()
            .duration(200)
            .attr("y", d => this.sy(d[0].match_period) + offset)
    }

    getRelEpisode(episode, i, timing) {
        return timing === 'before' ? episode - 3 + i : episode + (i + 1);
    }

    showEpisodes(episode) {
        const config = {
            width: this.width / 2,
            margin: {top: 20, right: 10, bottom: 30, left: 10},
            soccerModule: this.soccer,
            originalData: this.data,
            timelineClass: this
        }

        this.drawDetail(episode, `${this.detailRootSelector} .selected-episode`, {
            ...config,
            height: config.width * 0.4,
            main: true,
            episode: episode,
        })

        for (const timing of ['before', 'after']) {
            for (let i = 0; i < this.nMiniDetails; i++) {
                d3.select(`${this.detailRootSelector} .${timing} .episode-${i}`).html('');

                const relEpisode = this.getRelEpisode(episode, i, timing);
                if (this.isEpisodeEmpty(relEpisode)) continue;

                this.drawDetail(relEpisode, `${this.detailRootSelector} .${timing} .episode-${i}`, {
                    ...config,
                    height: config.width * 0.3,
                    main: false,
                    episode: relEpisode,
                    nMiniDetails: this.nMiniDetails,
                    timelineSelector: this.rootSelector
                })
            }
        }
    }
    isEpisodeEmpty(episode) {
        return this.data.filter(d => d.episode === episode).length == 0;
    }

    showTable(episode) {
        const data = this.data.filter(d => d.episode === episode)
        d3.select(`.table`).html('');

        // Add table header
        const header = d3.select(`.table`)
            .append('thead')
            .append('tr');

        header.selectAll('th')
            .data(['#', 'Period', 'Time', 'Event', 'Detail', 'Player', 'Role', 'Team', 'X1', 'Y1', 'X2', 'Y2'])
            .join('th')
            .text(d => d);

        // Add table body
        const tbody = d3.select(`.table`)
            .append('tbody');

        tbody.selectAll('tr')
            .data(data)
            .join('tr')
            .selectAll('td')
            .data((d, i) => [i, d.match_period, sec2mmss(d.event_sec), d.event_name, d.sub_event_name, d.player_name, d.role, addEmoji(d.team_name), d.start_x, d.start_y, d.end_x, d.end_y])
            .join('td')
            .text(d => d);
    }

    mouseoverEpisode(thisClass, event, d) {
        if (thisClass.isFixed) return;
        const episode = +d3.select(this).attr('episode');
        thisClass.showEpisodes(episode);
        thisClass.moveEpisode(`${thisClass.rootSelector} .episode-${episode}`, -3);
        thisClass.showTable(episode);
    }

    mouseleaveEpisode(thisClass, event, d) {
        if (thisClass.isFixed) return;
        const episode = +d3.select(this).attr('episode');
        thisClass.moveEpisode(`${thisClass.rootSelector} .episode-${episode}`, 0);
    }

    onclick(thisClass, event, d) {
        thisClass.isFixed = true;

        const episode = +d3.select(this).attr('episode');
        thisClass.showEpisodes(episode);

        // reposition the selected episode
        thisClass.resetEpisodePosition();
        thisClass.moveEpisode(`${thisClass.rootSelector} .episode-${episode}`, -3);
        for (const timing of ['before', 'after']) {
            for (let i = 0; i < 2; i++) {
                const relEpisode = thisClass.getRelEpisode(episode, i, timing);
                if (thisClass.isEpisodeEmpty(relEpisode)) continue;

                thisClass.moveEpisode(`${thisClass.rootSelector} .episode-${relEpisode}`, 3);
            }
        }
    }

    unfix(thisClass, event, d) {
        thisClass.resetEpisodePosition();
        thisClass.isFixed = false;
    }
}
