import * as d3 from "npm:d3";
import GeneralChart from "../GeneralChart.js";
import * as soccer from "npm:d3-soccer";
import getPossessionData from "./utils.js";
import _ from "npm:lodash";

function getOpponent(teammate, teams) {
  console.log(teammate, teams)
  for (const team of teams) {
    if (team !== teammate) return team;
  }
  throw Error("Error in getOpponent, " + teams + ", " + teammate);
}

function getEventDurationInMilliSeconds(event) {
  if (event.duration == null)return 1000
  return event.duration * 1000
}

class ThreeSixtyChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.soccer = this.config["soccerModule"];
      this.pitch = this.soccer.pitch().height(this.height);
      this.teams = this.config['teams']
      this.events = this.config["events"];
      this.selectedEvent = this.config["selectedEvent"];

      this.possession = getPossessionData(
        this.events.filter((d) => d.possession === this.selectedEvent.possession)
      )[0][1];

      this.threeSixty = this.data.find(
        (d) => d.event_uuid === this.selectedEvent.id
      );
    }

    setAxes() {
      this.sx = d3
        .scaleLinear()
        .domain([0, 120])
        .range([this.margin.left, this.pitch.width() - this.margin.right]);

      this.sy = d3
        .scaleLinear()
        .domain([0, 80])
        .range([this.margin.top, this.pitch.height() - this.margin.bottom]);
    }

    drawPitch(sel) {
      sel.append("g").call(this.pitch);
    }

    draw360(sel) {
      if (this.threeSixty == null) {
        sel.call(this.drawNull.bind(this));
        return;
      }
      sel.call(this.drawEventChain.bind(this));
      sel.call(this.drawVisibleArea.bind(this));
      sel.call(this.drawPlayers.bind(this));

      if (this.selectedEvent.type.name === "Pass") {
        sel.call(this.drawPass.bind(this));
      }
      else if (this.selectedEvent.type.name === "Carry") {
        sel.call(this.drawCarry.bind(this));
      }
      else if (this.selectedEvent.type.name === "Shot") {
        sel.call(this.drawShot.bind(this));
      }
    }

    drawNull(sel) {
        sel
          .append("g")
          .append("text")
          .attr("x", d3.mean(this.sx.range()))
          .attr("y", d3.mean(this.sy.range()))
          .attr("dy", 20)
          .attr("text-anchor", "middle")
          .attr("font-weight", "700")
          .attr("font-size", 45)
          .attr("opacity", 0.4)
          .text("No 360 data found.");

        sel
          .append("g")
          .append("text")
          .attr("x", d3.mean(this.sx.range()))
          .attr("y", d3.mean(this.sy.range()))
          .attr("dy", 35)
          .attr("text-anchor", "middle")
          .attr("font-size", 15)
          .attr("opacity", 0.4)
          .text("id: " + this.selectedEvent.id);

    }

    drawVisibleArea(sel) {
      sel
        .append("g")
        .append("path")
        .datum(this.threeSixty)
        .attr("d", (d) => d3.line()(this.convertVisibleArea(d.visible_area)))
        .attr("fill", "#888")
        .attr("stroke", "black")
        .attr("opacity", 0.15)
        .attr("stroke-dasharray", "4 4");
    }
    drawPlayers(sel) {
      this.scTeam = d3.scaleOrdinal().domain(this.teams).range(["black", "blue"]);
      const opponent = getOpponent(this.selectedEvent.team.name, this.teams);

      sel
        .append("g")
        .selectAll("circle")
        .data(this.threeSixty.freeze_frame)
        .join("circle")
        .attr("cx", (d) => this.sx(d.location[0]))
        .attr("cy", (d) => this.sy(d.location[1]))
        .attr("r", (d) => (d.actor ? 9 : 5))
        .attr("fill", (d) =>
          d.teammate ? this.scTeam(this.selectedEvent.team.name) : this.scTeam(opponent)
        )
        .attr("stroke", (d) => (d.actor ? "white" : "black"))
        .attr("opacity", 0.6)
        .attr("stroke-width", (d) => (d.actor ? 3 : 1))
        .attr("stroke-dasharray", (d) => (d.actor ? "3 5" : ""));

      sel
        .append("text")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top + 15)
        .attr("dx", 5)
        .attr("font-size", 15)
        .text(this.writeEventAction(this.selectedEvent));

      sel
        .append("text")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top + 25)
        .attr("dx", 5)
        .attr("font-size", 10)
        .text(this.writeEventPlayer(this.selectedEvent));

    }

    drawPass(sel) {
      this.drawHull(this.threeSixty.freeze_frame);
        sel
          .append("g")
          .append("text")
          .attr("x", this.margin.left)
          .attr("y", this.margin.top + 35)
          .attr("dx", 5)
          .attr("font-size", 10)
          .text(this.writePassDetail(this.selectedEvent));

        sel
          .append("g")
          .append("line")
          .datum(this.selectedEvent)
          .attr("x1", (d) => this.sx(d.location[0]))
          .attr("y1", (d) => this.sy(d.location[1]))
          .attr("x2", (d) => this.sx(d.location[0]))
          .attr("y2", (d) => this.sy(d.location[1]))
          .attr("stroke", "blue")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "3 3")
          .transition()
          .duration((d) => getEventDurationInMilliSeconds(d))
          .attr("x2", (d) => this.sx(d.pass.end_location[0]))
          .attr("y2", (d) => this.sy(d.pass.end_location[1]));

        sel
          .append("g")
          .append("circle")
          .datum(this.selectedEvent)
          .attr("cx", (d) => this.sx(d.location[0]))
          .attr("cy", (d) => this.sy(d.location[1]))
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("r", 3)
          .transition()
          .duration((d) => getEventDurationInMilliSeconds(d))
          .attr("cx", (d) => this.sx(d.pass.end_location[0]))
          .attr("cy", (d) => this.sy(d.pass.end_location[1]));

        if (this.selectedEvent.pass.outcome != null) {
          if (this.selectedEvent.pass.outcome.name === "Incomplete") {
            sel
              .append("g")
              .append("text")
              .datum(this.selectedEvent)
              .attr("text-anchor", "middle")
              .attr("x", (d) => this.sx(d.location[0]))
              .attr("y", (d) => this.sy(d.location[1]))
              .transition()
              .duration((d) => getEventDurationInMilliSeconds(d))
              .attr("x", (d) => this.sx(d.pass.end_location[0]))
              .attr("y", (d) => this.sy(d.pass.end_location[1]))
              .text("x");
          }
        }
    }

    drawCarry(sel) {
      sel
          .append("g")
          .append("line")
          .datum(this.selectedEvent)
          .attr("x1", (d) => this.sx(d.location[0]))
          .attr("y1", (d) => this.sy(d.location[1]))
          .attr("x2", (d) => this.sx(d.location[0]))
          .attr("y2", (d) => this.sy(d.location[1]))
          .attr("stroke", "blue")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "3 3")
          .transition()
          .duration((d) => getEventDurationInMilliSeconds(d))
          .attr("x2", (d) => this.sx(d.carry.end_location[0]))
          .attr("y2", (d) => this.sy(d.carry.end_location[1]));

        sel
          .append("g")
          .append("circle")
          .datum(this.selectedEvent)
          .attr("cx", (d) => this.sx(d.location[0]))
          .attr("cy", (d) => this.sy(d.location[1]))
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("r", 3)
          .transition()
          .duration((d) => getEventDurationInMilliSeconds(d))
          .attr("cx", (d) => this.sx(d.carry.end_location[0]))
          .attr("cy", (d) => this.sy(d.carry.end_location[1]));
    }

    drawShot(sel) {
      sel
        .append("g")
        .append("text")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top + 35)
        .attr("dx", 5)
        .attr("font-size", 10)
        .text(this.writeShotDetail(this.selectedEvent));

      sel
        .append("g")
        .append("line")
        .datum(this.selectedEvent)
        .attr("x1", (d) => this.sx(d.location[0]))
        .attr("y1", (d) => this.sy(d.location[1]))
        .attr("x2", (d) => this.sx(d.location[0]))
        .attr("y2", (d) => this.sy(d.location[1]))
        .attr("stroke", "blue")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "3 3")
        .transition()
        .duration((d) => getEventDurationInMilliSeconds(d))
        .attr("x2", (d) => this.sx(d.shot.end_location[0]))
        .attr("y2", (d) => this.sy(d.shot.end_location[1]));

      sel
        .append("g")
        .append("circle")
        .datum(this.selectedEvent)
        .attr("cx", (d) => this.sx(d.location[0]))
        .attr("cy", (d) => this.sy(d.location[1]))
        .attr("fill", (d) =>
          d.shot.outcome.name === "Goal" ? "#91cf60" : "#fc8d59"
        )
        .attr("stroke", "black")
        .attr("r", 3)
        .transition()
        .duration((d) => getEventDurationInMilliSeconds(d))
        .attr("cx", (d) => this.sx(d.shot.end_location[0]))
        .attr("cy", (d) => this.sy(d.shot.end_location[1]));

    }

    drawHull(tracking) {
      const opponents = tracking.filter(
        (d) => d.teammate === false && d.keeper === false
      );

      this.svg
        .append("g")
        .append("path")
        .datum(d3.polygonHull(opponents.map((d) => d.location)))
        .attr(
          "d",
          d3
            .line()
            .x((d) => this.sx(d[0]))
            .y((d) => this.sy(d[1]))
        )
        .attr("fill", "blue")
        .attr("opacity", 0.3);
    }

    filterChainEvents(data, attributes) {
      return data.filter(
        (d) =>
          d.location != null &&
          attributes.includes(d.type.name) &&
          d.index >= this.selectedEvent.index - 8 &&
          d.index <= this.selectedEvent.index + 8
      );
    }

    drawEventChain(sel) {
      sel
        .append("g")
        .selectAll("circle")
        .data(
          this.filterChainEvents(this.possession, ["Pass", "Ball Receipt*"]).filter(d=>d.index - this.selectedEvent.index < 0)
        )
        .join("circle")
        .attr("cx", (d) => this.sx(d.location[0]))
        .attr("cy", (d) => this.sy(d.location[1]))
        .attr("r", (d) => (d.type.name === "Pass" ? 8 : 3))
        .attr("fill", (d) => {
          if (d.type.name !== "Pass") return "pink";
          return "yellow";
        })
        .attr("stroke", "#ff1133")
        .attr("opacity", 0)
        .on("mouseover", _.partial(this.mouseoverEvent, this))
        .on("mousemove", _.partial(this.mousemoveEvent, this))
        .on("mouseleave", _.partial(this.mouseleaveEvent, this))
        .transition()
        .delay((_, i) => i * 100)
        .attr("opacity", 0.5);

      // Passes before the current event
      sel
        .append("g")
        .selectAll("text")
        .data(this.filterChainEvents(this.possession, ["Pass"]).filter(d=>d.index - this.selectedEvent.index < 0))
        .join("text")
        .attr("x", (d) => this.sx(d.location[0]))
        .attr("y", (d) => this.sy(d.location[1]))
        .attr("dy", 4)
        .attr("opacity", 0)
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .text((d, i) => i - this.filterChainEvents(this.possession, ["Pass"]).filter(d=>d.index - this.selectedEvent.index < 0).length)
        .transition()
        .delay((_, i) => i * 100)
        .attr("opacity", 0.5)

      sel
        .append("g")
        .selectAll("line")
        .data(
          this.filterChainEvents(this.possession, ["Pass"]).filter(d=>d.index - this.selectedEvent.index < 0)
        )
        .join("line")
        .attr("x1", (d) => this.sx(d.location[0]))
        .attr("y1", (d) => this.sy(d.location[1]))
        .attr("x2", (d) => this.sx(d.pass.end_location[0]))
        .attr("y2", (d) => this.sy(d.pass.end_location[1]))
        .attr("stroke", "gray")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "3 3")
        .attr("opacity", 0)
        .transition()
        .delay(
          (_, i) => i * 100 + 100
        )
        .attr("opacity", 0.6);
    }

    drawWatermark(sel) {
      sel
        .append("image")
        .attr(
          "xlink:href",
          "https://dtai.cs.kuleuven.be/sports/static/ee39fa2918398059e9be62c32c1b48c4/74404/statsbomb_logo.png"
        )
        .attr("opacity", 0.2)
        .attr("x", this.pitch.width() - this.margin.right - 200)
        .attr("y", this.pitch.height() - this.margin.bottom - 22)
        .attr("width", 200);
    }

    mouseoverEvent(thisClass, event, d) {
      thisClass.tooltip.show(event, d);
    }

    mousemoveEvent(thisClass, event, d) {
      const minIndex = d3.min(thisClass.possession, (d) => d.index);
      thisClass.tooltip.setText(
        `<b>${d.type.name}</b> (${d.index - minIndex}) (${d.timestamp})<br>${
          d.player.name
        } (${d.team.name})`
      );
      thisClass.tooltip.move(event, d);
    }

    mouseleaveEvent(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }

    shortenPosition(pos) {
      return pos
        .split(" ")
        .map((d) => d[0])
        .join("");
    }

    writeEventAction(e) {
      return `${e.type.name} (${e.minute}:${e.second})`;
    }

    writeEventPlayer(e) {
      return `${e.player.name} (${e.possession_team.name}, ${this.shortenPosition(
        e.position.name
      )}) ${e.play_pattern.name}`;
    }

    writePassDetail(e) {
      const outcome =
        e.pass.outcome == null
          ? "to " + e.pass.recipient.name
          : `(${e.pass.outcome.name})`;
      return `${e.pass.height.name} ${outcome}`;
    }

    writeShotDetail(e) {
      const f = d3.format(".1f");
      return `[${e.shot.outcome.name} (${e.shot.body_part.name})] xG:${f(
        e.shot.statsbomb_xg * 100
      )}%, type: ${e.shot.type.name}`;
    }

    convertVisibleArea(d) {
      const res = [];
      for (let i = 0; i < d.length; i += 2) {
        res.push([this.sx(d[i]), this.sy(d[i + 1])]);
      }
      return res;
    }

    draw() {
      // this.svg.call(this.paintBG, "#fff1df");
      this.setAxes();
      this.svg.call(this.drawPitch.bind(this));
      this.svg.call(this.draw360.bind(this));
      this.svg.call(this.drawWatermark.bind(this));
    }
  }


export default ThreeSixtyChart;