import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import {formatFloat, distance, getGKPosition, isShotPossible} from "./positioning.js";


class GKPositioningChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.soccer = config['soccerModule'];
      this.ballR = 3;
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

    drawAuxiliaryLines(sel) {

      sel
        .append('g')
        .append('line')
        .attr('x1', this.sx(34 - 20.16))
        .attr('x2', this.sx(34 + 20.16))
        .attr('y1', this.sy(52.5 - 5.25))
        .attr('y2', this.sy(52.5 - 5.25))
        .attr("stroke", '#999')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', '4 4')

      sel
        .append('g')
        .append('line')
        .attr('x1', this.sx(34 - 20))
        .attr('x2', this.sx(34 + 20))
        .attr('y1', this.sy(52.5 - 10.5))
        .attr('y2', this.sy(52.5 - 10.5))
        .attr("stroke", '#999')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', '4 4')

      sel
        .append('g')
        .append('line')
        .attr('x1', this.sx(34 - (3.66 + 5.5)))
        .attr('x2', this.sx(34 - (3.66 + 5.5)))
        .attr('y1', this.sy(52.5))
        .attr('y2', this.sy(52.5 - 16))
        .attr("stroke", '#999')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', '4 4')

      sel
        .append('g')
        .append('line')
        .attr('x1', this.sx(34 - (3.66 + 11)))
        .attr('x2', this.sx(34 - (3.66 + 11)))
        .attr('y1', this.sy(52.5))
        .attr('y2', this.sy(52.5 - 16))
        .attr("stroke", '#999')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', '4 4')

      sel
        .append('g')
        .append('line')
        .attr('x1', this.sx(34 + (3.66 + 5.5)))
        .attr('x2', this.sx(34 + (3.66 + 5.5)))
        .attr('y1', this.sy(52.5))
        .attr('y2', this.sy(52.5 - 16))
        .attr("stroke", '#999')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', '4 4')

      sel
        .append('g')
        .append('line')
        .attr('x1', this.sx(34 + (3.66 + 11)))
        .attr('x2', this.sx(34 + (3.66 + 11)))
        .attr('y1', this.sy(52.5))
        .attr('y2', this.sy(52.5 - 16))
        .attr("stroke", '#999')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .attr('stroke-dasharray', '4 4')
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
      this.svg.call(this.drawAuxiliaryLines.bind(this));
    }

    onMousemove(thisClass, event, d) {
      d3.select(this).style("cursor", "none");
      const ball = {
        x: thisClass.sx.invert(event.offsetX),
        y: thisClass.sx.invert(event.offsetY)
      };
      thisClass.GK = thisClass.getGKPosition(
        ball,
        thisClass.goal,
        thisClass.ratio
      );
      d3.select(".ball")
        .attr("cx", event.offsetX - thisClass.ballR / 2)
        .attr("cy", event.offsetY - thisClass.ballR / 2);
      d3.select('.ball-distance')
        .attr("x", event.offsetX)
        .attr("y", event.offsetY)
        .attr('pointer-events', 'none')
        .text(`${formatFloat(2)(distance(ball, thisClass.goal))}m`)

      thisClass.svg
        .call(thisClass.updateGK.bind(thisClass), ball);

      d3
        .select(".shot-path")
        .attr("x1", event.offsetX)
        .attr("y1", event.offsetY);


      if (isShotPossible(ball, thisClass.goal, 30)) {
        thisClass.svg.call(thisClass.drawResponsibleLine.bind(thisClass), ball);

        d3.selectAll(".possible-path")
          .style('display', '')
          .attr("x1", event.offsetX)
          .attr("y1", event.offsetY);

        d3.select('.possible-shot-area')
          .datum([
            {x: event.offsetX, y: event.offsetY},
            {x: thisClass.goal.x + 3.66, y: thisClass.goal.y},
            {x: thisClass.goal.x - 3.66, y: thisClass.goal.y},
          ])
          .style('display', '')
          .attr('d', d3.line()
            (
              [
                [event.offsetX, event.offsetY],
                [thisClass.sx(thisClass.goal.x + 3.66), thisClass.sy(thisClass.goal.y)],
                [thisClass.sx(thisClass.goal.x - 3.66), thisClass.sy(thisClass.goal.y)]
              ]
            )
          );
      } else {
        d3.select('.responsible-path')
          .style('display', 'none');
        d3.selectAll(".possible-shot-path")
          .style('display', 'none');
        d3.select(".possible-shot-area")
          .style('display', 'none');
      }
    }

    drawBaseEllipse(sel) {
      sel
        .append('g')
        .append('clipPath')
        .attr('id', 'cut-off-bottom')
        .append('rect')
        .attr('x', this.sx(0))
        .attr('y', this.sy(0))
        .attr('width', this.sx(68))
        .attr('height', this.sy(52.5))

      sel
        .append("g")
        .append("ellipse")
        .attr('clip-path', 'url(#cut-off-bottom)')
        .attr("cx", this.sx(34))
        .attr("cy", this.sy(52.5))
        .attr("rx", this.scale(7.32))
        .attr("ry", this.scale(11))
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 1)
        .attr("stroke", "#888")
        .attr("fill", "none")
        .attr("opacity", 0.7);
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
        .attr('clip-path', 'url(#cut-off-bottom)')
        .attr("opacity", 0.0);
    }

    drawPointX(sel) {
      sel
        .append("g")
        .append("text")
        .attr("x", this.sx(34))
        .attr("y", this.sy(52.5 - 1.57))
        .attr("fill", "blue")
        .attr("opacity", 0.4)
        .attr("text-anchor", "middle")
        .attr("font-size", 20)
        .attr('font-family', 'sans-serif')
        .text("x");

      sel
        .append("g")
        .append("line")
        .attr("x1", this.sx(34 - 3.66 - 5.5))
        .attr("x2", this.sx(34 + 3.66))
        .attr("y1", this.sy(52.5 - 5.5))
        .attr("y2", this.sy(52.5))
        .attr("stroke-dasharray", "4 4")
        .attr("stroke", "red")
        .attr("opacity", 0.3);
      sel
        .append("g")
        .append("line")
        .attr("x1", this.sx(34 + 3.66 + 5.5))
        .attr("x2", this.sx(34 - 3.66))
        .attr("y1", this.sy(52.5 - 5.5))
        .attr("y2", this.sy(52.5))
        .attr("stroke-dasharray", "4 4")
        .attr("stroke", "red")
        .attr("opacity", 0.3);
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
        .attr("r", this.ballR);

      this.svg
        .append('g')
        .append('text')
        .attr('class', 'ball-distance')
        .attr("x", this.sx(this.ball.x))
        .attr("y", this.sy(this.ball.y))
        .attr('dy', -4)
        .attr("text-anchor", "middle")
        .attr("font-size", 16)
        .attr("font-family", 'sans-serif')
        .attr("fill", "#333")
        .text(`${formatFloat(2)(distance(this.ball, this.goal))}m`)
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
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4 4");
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
        .attr("opacity", 0.4)
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "4 2");

      sel
        .append('g')
        .append('text')
        .attr('class', 'responsible-width')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 14)
        .attr('x', this.sx(0) + 10)
        .attr('y', this.sy(0) + 15)
    }

    updateResponsibleLine(sel, ball) {
      const [perpX1, perpY1, perpX2, perpY2] = this.calculateResponsibleLine(ball);

      // Draw the perpendicular line
      sel
        .select(".responsible-path")
        .style('display', '')
        .attr("x1", this.sx(perpX1))
        .attr("y1", this.sy(perpY1))
        .attr("x2", this.sx(perpX2))
        .attr("y2", this.sy(perpY2));

        // do we know the length?
        const length = distance({x: perpX1, y: perpY1}, {x: perpX2, y: perpY2});
        sel
          .select('.responsible-width')
          .text(`${formatFloat(2)(length)}m / 7.32m`)
      }

      calculateResponsibleLine(ball) {
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
        return [perpX1, perpY1, perpX2, perpY2];
      }

    drawPossibleShotPaths(sel, ball) {
      // draw left goal line
      sel
        .append('g')
        .append("line")
        .attr("class", "possible-shot-path")
        .attr("x1", this.sx(ball.x))
        .attr("y1", this.sy(ball.y))
        .attr("x2", this.sx(this.goal.x - 3.66)) // left goal post
        .attr("y2", this.sy(this.goal.y))
        .attr("stroke", "blue")
        .attr("opacity", 0.2)
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 2);

      // draw right goal line
      sel
        .append('g')
        .append("line")
        .attr("class", "possible-shot-path")
        .attr("x1", this.sx(ball.x))
        .attr("y1", this.sy(ball.y))
        .attr("x2", this.sx(this.goal.x + 3.66)) // right goal post
        .attr("y2", this.sy(this.goal.y))
        .attr("stroke", "blue")
        .attr("opacity", 0.2)
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 2);

      const thisClass = this
      sel
        .append('g')
        .append("path")
        .attr("class", "possible-shot-area")
        .datum([
          {x: ball.x, y: ball.y},
          {x: this.goal.x + 3.66, y: this.goal.y},
          {x: this.goal.x - 3.66, y: this.goal.y},
        ])
        .attr("stroke", "blue")
        .attr("fill", "blue")
        .attr("opacity", 0.1)
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 2)
        .attr('d', d3.line()
          .x(function(d) {return thisClass.sx(d.x)})
          .y(function(d) {return thisClass.sy(d.y)})
        );
    }

    drawSemiCircle(sel) {
      sel
        .append('g')
        .append('path')
        .attr('stroke', '#888')
        .attr('fill', 'none')
        .attr('stroke-dasharray', '4 4')
        .attr('transform', `translate(${this.sx(this.goal.x)},${this.sx(this.goal.y) - 5})`)
        .attr('d', d3.arc()({
          innerRadius: this.sx(30 / 1.1),
          outerRadius: this.sx(30 / 1.1),
          startAngle: -Math.PI / 2,
          endAngle: Math.PI / 2,
        }))
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
      this.svg.call(this.drawSemiCircle.bind(this));
      this.svg.on("mousemove", _.partial(this.onMousemove, this));
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