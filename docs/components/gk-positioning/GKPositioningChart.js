import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import getGKPosition from "./positioning.js";


class GKPositioningChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.soccer = config['soccerModule'];
      this.initPitch(config);
      this.setAxes();
    }
    initPitch(config) {
      this.pitch = this.soccer
        .pitch()
        .height(420)
        .rotate(true)
        .clip([
          [0, 52.5],
          [68, 105]
        ]);
      this.ball = config["ball"];
      this.goal = { x: 34, y: 52.5 };
      this.GK = this.getGKPosition(this.ball, this.goal, this.ratio);
      this.ratio = config["ratio"]; // retio of goal-ball and to goal-GK?
    }

    getGKPosition(ball, goal, ratio) {
      return getGKPosition(ball, goal, ratio);
    }

    setAxes() {
      this.scale = d3
        .scaleLinear()
        .domain([0, 105])
        .range([0, this.pitch.height()]);

      this.sx = d3
        .scaleLinear()
        .domain([0, 68])
        .range([this.margin.left, this.pitch.width()]);

      this.sy = d3
        .scaleLinear()
        .domain([0, 52.5])
        .range([this.margin.top, this.pitch.height()]);
    }

    drawPitch(sel) {
      sel
        .append("g")
        .append("rect")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top)
        .attr("width", this.pitch.width() - this.margin.left)
        .attr("height", this.pitch.height())
        .attr("fill", "#ccc");
      sel.append("g").call(this.pitch);
    }

    onClick(thisClass, event, d) {
      const ball = {
        x: thisClass.sx.invert(event.offsetX),
        y: thisClass.sx.invert(event.offsetY)
      };
      thisClass.GK = thisClass.getGKPosition(
        ball,
        thisClass.goal,
        thisClass.ratio
      );
      d3.select(".ball").attr("cx", event.offsetX).attr("cy", event.offsetY);
      thisClass.svg.call(thisClass.updateGK.bind(thisClass), ball);
      d3.select(".shot-path").attr("x1", event.offsetX).attr("y1", event.offsetY);
      thisClass.svg.call(thisClass.drawResponsibleLine.bind(thisClass), ball);

      d3.selectAll(".possible-path")
        .attr("x1", event.offsetX)
        .attr("y1", event.offsetY);
      console.log(thisClass.sx.invert(ball.x));
    }

    drawBaseEllipse(sel) {
      sel
        .append("g")
        .append("ellipse")
        .attr("cx", this.sx(34))
        .attr("cy", this.sy(52.5))
        .attr("rx", this.scale(7.32))
        .attr("ry", this.scale(11))
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 3)
        .attr("stroke", "#888")
        .attr("fill", "none")
        .attr("opacity", 0.3);
    }

    drawActualEllipse(sel) {
      sel
        .append("g")
        .append("ellipse")
        .attr("cx", this.sx(34))
        .attr("cy", this.sy(52.5))
        .attr("rx", this.scale(7.32 * this.ratio))
        .attr("ry", this.scale(11 * this.ratio))
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 3)
        .attr("stroke", "#833")
        .attr("fill", "none")
        .attr("opacity", 0.0);
    }

    drawPointX(sel) {
      sel
        .append("g")
        .append("text")
        .attr("x", this.sx(34))
        .attr("y", this.sy(52.5 - 1.57))
        .attr("fill", "red")
        .attr("r", 2)
        .attr("opacity", 0.3)
        .attr("text-anchor", "middle")
        .text("x");

      // sel
      //   .append("g")
      //   .append("line")
      //   .attr("x1", this.sx(34 - 3.66 - 5.5))
      //   .attr("x2", this.sx(34 + 3.66))
      //   .attr("y1", this.sy(52.5 - 5.5))
      //   .attr("y2", this.sy(52.5))
      //   .attr("stroke-dasharray", "4 4")
      //   .attr("stroke", "red")
      //   .attr("opacity", 0.3);
      // sel
      //   .append("g")
      //   .append("line")
      //   .attr("x1", this.sx(34 + 3.66 + 5.5))
      //   .attr("x2", this.sx(34 - 3.66))
      //   .attr("y1", this.sy(52.5 - 5.5))
      //   .attr("y2", this.sy(52.5))
      //   .attr("stroke-dasharray", "4 4")
      //   .attr("stroke", "red")
      //   .attr("opacity", 0.3);
    }

    appendGK(sel) {
      sel
        .append("g")
        .append("circle")
        .attr("class", "gk")
        .attr("r", 11)
        .attr("opacity", 0.3)
        .attr("fill", "#ccc");

      sel
        .append("g")
        .append("circle")
        .attr("class", "gk")
        .attr("r", 9)
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)
        .attr("fill", "red");

      sel
        .append("g")
        .append("text")
        .attr("class", "gk-text")
        .attr("dy", 3)
        .attr("fill", "#ccc")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text("GK");
    }

    updateGK(sel, ball) {
      d3.selectAll(".gk")
        .datum(this.GK)
        .attr("cx", (d) => this.sx(d.x))
        .attr("cy", (d) => this.sy(d.y));

      d3.select(".gk-text")
        .datum(this.GK)
        .attr("x", (d) => this.sx(d.x))
        .attr("y", (d) => this.sy(d.y));
    }

    drawGK(sel, ball) {
      this.svg.call(this.appendGK.bind(this));
      this.svg.call(this.updateGK.bind(this), ball);
    }

    drawBall() {
      this.svg
        .append("g")
        .append("circle")
        .attr("class", "ball")
        .attr("cx", this.sx(this.ball.x))
        .attr("cy", this.sy(this.ball.y))
        .attr("fill", "red")
        .attr("r", 3);
    }

    appendShotPath() {}
    drawShotPath(sel) {
      this.appendShotPath();
      sel
        .append("g")
        .append("line")
        .attr("class", "shot-path")
        .attr("x1", this.sx(this.ball.x))
        .attr("y1", this.sy(this.ball.y))
        .attr("x2", this.sx(this.goal.x))
        .attr("y2", this.sy(this.goal.y))
        .attr("stroke", "#888")
        .attr("stroke-dasharray", "3 3");
    }

    drawResponsibleLine(sel, ball) {
      sel.call(this.appendResponsibleLine.bind(this), ball);
      sel.call(this.updateResponsibleLine.bind(this), ball);
    }
    appendResponsibleLine(sel, ball) {
      // Draw the perpendicular line
      sel
        .append("g")
        .append("line")
        .attr("class", "responsible-path")
        .attr("stroke", "red")
        .attr("stroke-width", 5)
        .attr("stroke-dasharray", "1 1");
    }
    updateResponsibleLine(sel, ball) {
      // Calculate the slope of the shot path
      const slope = (ball.y - this.goal.y) / (ball.x - this.goal.x);

      // Calculate the negative reciprocal to find the slope of the perpendicular line
      const perpSlope = -1 / slope;

      // Use the slope and GK position to calculate the endpoints of the perpendicular line
      let perpX1 = this.GK.x - 5;
      let perpY1 = this.GK.y - 5 * perpSlope;
      let perpX2 = this.GK.x + 5;
      let perpY2 = this.GK.y + 5 * perpSlope;

      // Define possible shot paths
      const leftGoalLine = [
        [ball.x, ball.y],
        [this.goal.x - 3.66, this.goal.y]
      ];
      const rightGoalLine = [
        [ball.x, ball.y],
        [this.goal.x + 3.66, this.goal.y]
      ];

      // Find intersection points with possible shot paths
      const leftIntersection = lineIntersection(
        [
          [perpX1, perpY1],
          [perpX2, perpY2]
        ],
        leftGoalLine
      );
      const rightIntersection = lineIntersection(
        [
          [perpX1, perpY1],
          [perpX2, perpY2]
        ],
        rightGoalLine
      );

      // Adjust perpendicular line to not exceed the shot paths
      if (leftIntersection) {
        perpX1 = leftIntersection[0];
        perpY1 = leftIntersection[1];
      }
      if (rightIntersection) {
        perpX2 = rightIntersection[0];
        perpY2 = rightIntersection[1];
      }

      // Draw the perpendicular line
      sel
        .select(".responsible-path")
        .attr("x1", this.sx(perpX1))
        .attr("y1", this.sy(perpY1))
        .attr("x2", this.sx(perpX2))
        .attr("y2", this.sy(perpY2));
    }

    drawPossibleShotPaths(sel, ball) {
      // draw left goal line
      this.svg
        .append("line")
        .attr("class", "possible-path")
        .attr("x1", this.sx(ball.x))
        .attr("y1", this.sy(ball.y))
        .attr("x2", this.sx(this.goal.x - 3.66)) // left goal post
        .attr("y2", this.sy(this.goal.y))
        .attr("stroke", "blue")
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 1);

      // draw right goal line
      this.svg
        .append("line")
        .attr("class", "possible-path")
        .attr("x1", this.sx(ball.x))
        .attr("y1", this.sy(ball.y))
        .attr("x2", this.sx(this.goal.x + 3.66)) // right goal post
        .attr("y2", this.sy(this.goal.y))
        .attr("stroke", "blue")
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 1);
    }

    draw() {
      this.svg.call(this.drawPitch.bind(this));
      this.svg.call(this.drawBaseEllipse.bind(this));
      this.svg.call(this.drawActualEllipse.bind(this));
      this.svg.call(this.drawPointX.bind(this));
      this.svg.call(this.drawBall.bind(this));
      this.svg.call(this.drawShotPath.bind(this));
      this.svg.call(this.drawPossibleShotPaths.bind(this), this.ball);
      this.svg.call(this.drawResponsibleLine.bind(this), this.ball);
      this.svg.call(this.drawGK.bind(this), this.ball);

      this.svg.on("click", _.partial(this.onClick, this));
    }

    mouseover(thisClass, event, d) {
      thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
      thisClass.tooltip.setText("aaa");
      thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }
  }

  function lineIntersection(line1, line2) {
    const x1 = line1[0][0];
    const y1 = line1[0][1];
    const x2 = line1[1][0];
    const y2 = line1[1][1];
    const x3 = line2[0][0];
    const y3 = line2[0][1];
    const x4 = line2[1][0];
    const y4 = line2[1][1];

    const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    const u = -((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      const intersectionX = x1 + t * (x2 - x1);
      const intersectionY = y1 + t * (y2 - y1);
      return [intersectionX, intersectionY];
    } else {
      return null;
    }
  }

export default GKPositioningChart;