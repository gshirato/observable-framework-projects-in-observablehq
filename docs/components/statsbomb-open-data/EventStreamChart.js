import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import ThreeSixtyChart from "./ThreeSixtyChart.js";
import getPossessionData from "./utils.js";

function parseEventTime(event) {
    return parseTime("00:" + event.minute + ":" + event.second + ".000");
  }

function parseTime(timestamp) {
    return d3.timeParse("%I:%M:%S.%L")(timestamp);
}

function getImportatntEvents() {
    return ["Pass", "Ball Receipt*", "Carry", "Shot", "Pressure"];
}

function getEventName(event) {
    if (getImportatntEvents().includes(event.type.name))
        return event.type.name;
    return "Other";
}

function getTimeExtentOfEvents(events) {
    return d3.extent(events, (d) => parseEventTime(d));
  }

function drawEventStreamChart(data, selector, config) {
    return new EventStreamChart(data, selector, config).draw();
}

class EventStreamChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.timeRange = this.config["timeRange"];
      this.period = this.config["period"];
      this.soccer = this.config["soccerModule"];
      this.data = this.data.filter(
        (d) =>
          parseEventTime(d) < parseEventTime(this.timeRange[1]) &&
          parseEventTime(d) > parseEventTime(this.timeRange[0])
      );

      this.possessions = getPossessionData(this.data);
      this.teamColors = [this.config["homeColor"], this.config["awayColor"]];
      this.threeSixty = this.config["threeSixty"];
    }

    setAxes() {
      this.st = d3
        .scaleTime()
        .domain(d3.extent(this.data.map((d) => parseEventTime(d))))
        .range([this.margin.left, this.width - this.margin.right]);

      this.sy = d3
        .scaleBand()
        .domain(getImportatntEvents().concat(["Other"]))
        .range([this.margin.top, this.height - this.margin.bottom]);

      this.scEventType = d3
        .scaleOrdinal()
        .domain(getImportatntEvents().concat(["Other"]))
        .range(["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#888"]);

      this.scTeam = d3
        .scaleOrdinal()
        .domain(Array.from(d3.union(this.data.map((d) => d.team.name))))
        .range(this.teamColors);
    }

    drawAxes() {
      this.setAxes();
      const taxis = d3.axisBottom(this.st);
      this.svg
        .append("g")
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(taxis);
    }

    draw() {
      this.svg.call(this.paintBG, "#fff1df");
      this.drawAxes();

      this.svg
        .append("g")
        .selectAll("text")
        .data(Array.from(d3.union(this.data.map((d) => getEventName(d)))))
        .join("text")
        .attr("x", this.margin.left)
        .attr("y", (d) => this.sy(d))
        .attr("dy", (d) => 10)
        .style("user-select", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 0.2)
        .text((d) => d);

      this.svg
        .append("g")
        .selectAll("rect")
        .data(this.possessions)
        .join("rect")
        .attr("class", "session_range")
        .attr("possession", (d) => d.possession)
        .attr("x", (d) => this.st(getTimeExtentOfEvents(d[1])[0]))
        .attr(
          "width",
          (d) =>
            this.st(getTimeExtentOfEvents(d[1])[1]) -
            this.st(getTimeExtentOfEvents(d[1])[0])
        )
        .attr("y", this.margin.top)
        .attr("height", this.height - this.margin.bottom - this.margin.top)
        .attr("fill", (d) => this.scTeam(d[1][0].team.name))
        .attr("opacity", 0.1)
        .attr("stroke", "blue")
        .attr("stroke-dasharray", "4 4");

      this.svg
        .append("g")
        .selectAll("rect")
        .data(this.possessions)
        .join("rect")
        .attr("class", "possession")
        .attr("x", (d) => this.st(getTimeExtentOfEvents(d[1])[0]))
        .attr(
          "width",
          (d) =>
            this.st(getTimeExtentOfEvents(d[1])[1]) -
            this.st(getTimeExtentOfEvents(d[1])[0])
        )
        .attr("y", this.height - 10)
        .attr("height", 10)
        .attr("fill", (d) => this.scTeam(d[1][0].team.name))
        .attr("opacity", 0.3)
        .attr("stroke", "#333")
        .on("mouseover", _.partial(this.mouseoverPossession, this))
        .on("mousemove", _.partial(this.mousemovePossession, this))
        .on("mouseleave", _.partial(this.mouseleavePossession, this));

      this.svg
        .append("g")
        .append("text")
        .attr("x", this.margin.left)
        .attr("y", this.height - this.margin.bottom + 10)
        .attr("font-size", 10)
        .text("Possession");

      this.svg
        .append("g")
        .selectAll("rect")
        .data(this.data)
        .join("rect")
        .attr("class", "event")
        .attr("x", (d) => this.st(parseEventTime(d)))
        .attr("y", (d) => this.sy(getEventName(d)))
        .attr("possession", (d) => d.possession)
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("width", 2.5)
        .attr("height", this.sy.bandwidth() - 20)
        // .attr("fill", (d) => this.scEventType(getEventName(d)))
        .attr("fill", (d) => {
          if (d.type.name !== "Shot") return "#333";
          if (d.shot.outcome.name !== "Goal") return "#d7191c";
          return "#91cf60";
        })
        .attr("stroke", (d) => {
          "#333";
        })
        .attr("stroke-width", 1)
        .attr("opacity", 0.4)
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this));
    }

    mouseoverPossession(thisClass, event, d) {
      d3.select(this).attr("opacity", 0.5);
      d3.selectAll(".event").attr("opacity", 0.1);
      d3.selectAll(".event")
        .filter((event) => event.possession === d[0])
        .attr("opacity", 0.4);

      d3.selectAll(".session_range").attr("opacity", 0.02);
      d3.selectAll(".session_range")
        .filter((session) => session[0] === d[0])
        .attr("opacity", 0.1);
    }

    mousemovePossession(thisClass, event, d) {}

    mouseleavePossession(thisClass, event, d) {
      d3.select(this).attr("opacity", 0.3);
    }

    mouseover(thisClass, event, d) {
      d3.select(this).attr("stroke-width", 2);
      new ThreeSixtyChart(thisClass.threeSixty, `${thisClass.rootSelector} .threeSixty`, {
        height: thisClass.width * 68 / 105,
        width: thisClass.width,
        margin: { top: 10, left: 10, bottom: 10, right: 30 },
        events: thisClass.data,
        selectedEvent: d,
        soccerModule: thisClass.soccer,
      }).draw();

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
      d3.select(this).attr("stroke-width", 0.3);
      thisClass.tooltip.hide(event, d);
    }
  }

export default EventStreamChart;