import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../chart/components/GeneralChart.js";
import ThreeSixtyChart from "./ThreeSixtyChart.js";
import getPossessionData from "./utils.js";

function parseEventTime(event) {
    if (event.timestamp == null) {
        event.timestamp = "00:" + event.minute + ":" + event.second + ".000";
    }
    return parseTime("00:" + event.minute + ":" + event.second + event.timestamp.slice(-4));
  }

function parseTime(timestamp) {
    return d3.timeParse("%I:%M:%S.%L")(timestamp);
}

function getImportatntEvents() {
    return ["Pass"];
}

function getEventName(event) {
    if (getImportatntEvents().includes(event.type.name))
        return event.type.name;
    return "Other";
}

function getRelativeSecondsFromStart(data) {
    return data.map(d=>
        (getSeconds(d) - getSeconds(data[0]))
    )
}

function getSeconds(d) {
    return parseEventTime(d).getTime() / 1000
}

class PassStreamChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.timeRange = this.config["timeRange"];
      this.period = this.config["period"];
      this.soccer = this.config["soccerModule"];
      this.relativeSeconds = getRelativeSecondsFromStart(this.data)
      this.teams = this.config['teams']
      this.data = this.data.filter(
        (d) =>
          parseEventTime(d) <= parseEventTime(this.timeRange[1]) &&
          parseEventTime(d) >= parseEventTime(this.timeRange[0])
      );

      this.possessions = getPossessionData(this.data);
      this.teamColors = [this.config["homeColor"], this.config["awayColor"]];
      this.threeSixty = this.config["threeSixty"];
    }

    timeExtent() {
        return [0, getSeconds(this.timeRange[1]) - getSeconds(this.timeRange[0])]
    }

    setAxes() {
      this.sx = d3
        .scaleLinear()
        .domain(this.timeExtent())
        .range([this.margin.left, this.width - this.margin.right]);

      this.sy = d3
        .scaleBand()
        .domain(getImportatntEvents())
        .range([this.margin.top, this.height - this.margin.bottom]);

      this.scTeam = d3
        .scaleOrdinal()
        .domain(Array.from(d3.union(this.data.map((d) => d.team.name))))
        .range(this.teamColors);
    }

    drawAxes() {
        this.setAxes();
        const xaxis = d3.axisBottom(this.sx);
        this.svg.append("g")
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(xaxis)
            .append("text")
            .attr("x", this.width - this.margin.right)
            .attr("y", this.margin.bottom-25)
            .style("fill", "#333")
            .style("text-anchor", "end")
            .text("Seconds since the episode starts →");
    }

    formatMMSS(d) {
        return `${String(d.minute).padStart(2, '0')}:${String(d.second).padStart(2, '0')}`
    }

    drawLabel() {
    this.svg
        .append("g")
        .append('text')
        .attr("x", this.margin.left)
        .attr("y", (d) => this.sy("Pass"))
        .attr("dy", -5)
        .style("user-select", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 0.2)
        .text(`Pass (${this.formatMMSS(this.data[0])}~${this.formatMMSS(this.data.slice(-1)[0])})`);
    }

    drawEvents() {
        this.svg
            .append("g")
            .selectAll("rect")
            .data(this.data)
            .join("rect")
            .attr("class", "event")
            .attr("x", (_, i) => this.sx(this.relativeSeconds[i]))
            .attr("y", (d) => this.sy(getEventName(d)))
            .attr("possession", (d) => d.possession)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("width", d=>this.sx(d.duration) - this.sx(0))
            .attr("height", this.sy.bandwidth() - 20)
            .attr("fill", (d) => d.pass.outcome == null ? "#7fc97f": "#ff9076")
            .attr("stroke", '#333')
            .attr("opacity", 0.4)
            .on("mouseover", _.partial(this.mouseover, this))
            .on("mousemove", _.partial(this.mousemove, this))
            .on("mouseleave", _.partial(this.mouseleave, this));

        console.log(this.data[0].id)
        this.svg
            .append("g")
            .selectAll("text")
            .data(this.data)
            .join("text")
            .attr("class", "event")
            .attr("text-anchor",'middle')
            .attr("x", (d, i) => this.sx(this.relativeSeconds[i] + d.duration / 2))
            .attr("y", (d) => this.sy(getEventName(d)) + this.sy.bandwidth() / 2)
            .text(d=>this.threeSixty.find(
                (t) => t.event_uuid === d.id
            ) == null ? '🚫': '')
    }

    draw() {
        this.drawAxes();
        this.drawLabel()
        this.drawEvents()
    }

    mouseover(thisClass, event, d) {
        d3.select(this).on('mouseover', null);

        new ThreeSixtyChart(thisClass.threeSixty, `${thisClass.rootSelector} .threeSixty`, {
            height: thisClass.width * 68 / 105,
            width: thisClass.width,
            margin: { top: 10, left: 10, bottom: 10, right: 30 },
            events: thisClass.data,
            selectedEvent: d,
            teams: thisClass.teams,
            soccerModule: thisClass.soccer,
        }).draw();

        d3.select(this)
            .attr('width', 0)
            .transition()
            .duration(d.duration * 1000)
            .attr("width", d=>thisClass.sx(d.duration) - thisClass.sx(0))
            .on('end', function() {
                d3.select(this)
                    .on("mouseover", _.partial(thisClass.mouseover, thisClass))
            })

      thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
      thisClass.tooltip.setText(
        `<b>${d.type.name}</b> (${d.minute}:${d.second})<br>
  ${d.player.name} (${d.team.name}, ${d.position.name})`
      );
      thisClass.tooltip.move(event, d);
    }

    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }
  }

export default PassStreamChart;