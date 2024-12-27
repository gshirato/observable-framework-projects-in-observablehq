import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../chart/components/GeneralChart.js";
import {formatFloat, distance, getGKPosition, isShotPossible} from "./positioning.js";
import GoalFromBack from "./goalFromBack.js";

class GKPositioningChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.soccer = config['soccerModule'];
      this.ballR = 0.4;
      this.distToEdges = null;
      this.setAxes();
      this.initPitch(config);
    }
    initPitch(config) {
      this.pitch = this.soccer
        .pitch()
        .height(this.height)
        .rotate(true)
        .clip([
          [0, 0],
          [68, 52.5]
        ]);
      this.ball = config["ball"];
      this.goal = { x: 0, y: 34 };
      this.ratio = this.getRatio(this.goal, this.ball);
      this.GK = this.getGKPosition(this.ball, this.goal, this.ratio);
    }

    /**
     * Get the ratio of the distance between the ball and the goal to the distance between the ball and the GK
     * Naive implementation
     * @param {Object} gk - GK position
     * @param {Object} ball - Ball position
     * @returns {number} - Ratio
     */
    getRatio(goal, ball) {
      const distance = Math.sqrt((goal.x - ball.x) ** 2 + (goal.y - ball.y) ** 2);
      if (distance > 11) return 1;
      return 0.7;
    }

    getGKPosition(ball, goal, ratio) {
      return getGKPosition(ball, goal, ratio);
    }

    setAxes() {
      this.sx = d3
        .scaleLinear()
        .domain([0, 105])
        .range([105, 0]);

      this.sy = d3
        .scaleLinear()
        .domain([0, 68])
        .range([68, 0]);
    }

    drawAuxiliaryLines(sel) {
      const strokeWidth = 0.2;
      const opacity = 0.3;
      const dashArray = '1 0.5';
      const lines = sel.append('g')
        .attr('cursor', 'none');

      lines
        .append('g')
        .append('line')
        .attr('x1', this.sx(5.25))
        .attr('x2', this.sx(5.25))
        .attr('y1', this.sy(34 - 20.16))
        .attr('y2', this.sy(34 + 20.16))
        .attr("stroke", '#999')
        .attr('stroke-width', strokeWidth)
        .attr('opacity', opacity)
        .attr('stroke-dasharray', dashArray)

      lines
        .append('g')
        .append('line')
        .attr('x1', this.sx(10.5))
        .attr('x2', this.sx(10.5))
        .attr('y1', this.sy(34 - 20))
        .attr('y2', this.sy(34 + 20))
        .attr("stroke", '#999')
        .attr('stroke-width', strokeWidth)
        .attr('opacity', opacity)
        .attr('stroke-dasharray', dashArray)

      lines
        .append('g')
        .append('line')
        .attr('x1', this.sx(0))
        .attr('x2', this.sx(16.5))
        .attr('y1', this.sy(34 - (3.66 + 5.5)))
        .attr('y2', this.sy(34 - (3.66 + 5.5)))
        .attr("stroke", '#999')
        .attr('stroke-width', strokeWidth)
        .attr('opacity', opacity)
        .attr('stroke-dasharray', dashArray)

      lines
        .append('g')
        .append('line')
        .attr('x1', this.sx(0))
        .attr('x2', this.sx(16.5))
        .attr('y1', this.sy(34 - (3.66 + 11)))
        .attr('y2', this.sy(34 - (3.66 + 11)))
        .attr("stroke", '#999')
        .attr('stroke-width', strokeWidth)
        .attr('opacity', opacity)
        .attr('stroke-dasharray', dashArray)

      lines
        .append('g')
        .append('line')
        .attr('x1', this.sx(0))
        .attr('x2', this.sx(16.5))
        .attr('y1', this.sy(34 + (3.66 + 5.5)))
        .attr('y2', this.sy(34 + (3.66 + 5.5)))
        .attr("stroke", '#999')
        .attr('stroke-width', strokeWidth)
        .attr('opacity', opacity)
        .attr('stroke-dasharray', dashArray)

      lines
        .append('g')
        .append('line')
        .attr('x1', this.sx(0))
        .attr('x2', this.sx(16.5))
        .attr('y1', this.sy(34 + (3.66 + 11)))
        .attr('y2', this.sy(34 + (3.66 + 11)))
        .attr("stroke", '#999')
        .attr('stroke-width', strokeWidth)
        .attr('opacity', opacity)
        .attr('stroke-dasharray', dashArray)
    }

    drawPitch(sel) {
      sel
        .append("g")
        .append("rect")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top + 15)
        .attr("width", this.pitch.width() - this.margin.left)
        .attr("height", this.pitch.height() - 15)
        .attr("fill", "#ccc")
        .attr('cursor', 'none');
      sel.append("g").call(this.pitch);
    }

    onMousemove(thisClass, event, d) {
      const xScale = d3.scaleLinear()
          .domain([
            thisClass.margin.top,
            thisClass.pitch.height() - thisClass.margin.bottom])
          .range([0, 52.5]);

      const yScale = d3.scaleLinear()
          .domain([
            thisClass.margin.left,
            thisClass.pitch.width() - thisClass.margin.right])
          .range([68, 0]);

        const [mouseX, mouseY] = d3.pointer(event);

      const ball = {
        x: xScale(mouseY - 7),
        y: yScale(mouseX - 5),
      };

      thisClass.GK = thisClass.getGKPosition(
        ball,
        thisClass.goal,
        thisClass.ratio
      );
      d3.select(".ball")
        .attr("cx", thisClass.sx(ball.x))
        .attr("cy", thisClass.sy(ball.y));

      d3.select('.ball-distance')
        .attr("x", thisClass.sx(ball.x))
        .attr("y", thisClass.sy(ball.y))
        .attr('transform', `rotate(90, ${thisClass.sx(ball.x)}, ${thisClass.sy(ball.y)})`)
        .attr('pointer-events', 'none')
        .text(`${formatFloat(2)(distance(ball, thisClass.goal))}m`)

      thisClass.svg
        .call(thisClass.updateGK.bind(thisClass), ball);

      d3
        .select(".shot-path")
        .attr("x1", thisClass.sx(ball.x))
        .attr("y1", thisClass.sy(ball.y));

      if (isShotPossible(ball, thisClass.goal, 30)) {
        thisClass.svg.call(thisClass.drawResponsableLine.bind(thisClass), ball);

        d3.selectAll(".possible-path")
          .style('display', '')
          .attr("x1", thisClass.sx(ball.x))
          .attr("y1", thisClass.sy(ball.y));

        d3.select('.possible-shot-area')
          .datum([
            {x: thisClass.sx(ball.x), y: thisClass.sy(ball.y)},
            {x: thisClass.sx(thisClass.goal.x), y: thisClass.sy(thisClass.goal.y + 3.66)},
            {x: thisClass.sx(thisClass.goal.x), y: thisClass.sy(thisClass.goal.y - 3.66)},
          ])
          .style('display', '')
          .attr('d', d3.line()
            (
              [
                [thisClass.sx(ball.x), thisClass.sy(ball.y)],
                [thisClass.sx(thisClass.goal.x), thisClass.sy(thisClass.goal.y + 3.66)],
                [thisClass.sx(thisClass.goal.x), thisClass.sy(thisClass.goal.y - 3.66)]
              ]
            )
          );
      } else {
        d3.select('.responsable-path')
          .style('display', 'none');
        d3.selectAll(".possible-shot-path")
          .style('display', 'none');
        d3.select(".possible-shot-area")
          .style('display', 'none');
      }

      const width = 800;

      new GoalFromBack([], `${thisClass.rootSelector} .fromBack`, {
        height: width / 980 * 380,
        width: width,
        margin: { top: 40, bottom: 40, left: 20, right: 20 },
        responsableXs: thisClass.distToEdges,
        gkX: 0,
    }).draw();
    }

    drawBaseEllipse(sel) {
      sel
        .append('g')
        .append('clipPath')
        .attr('id', 'cut-off-half-circle')
        .append('rect')
        .attr('x', this.sx(52.5))
        .attr('y', this.sy(68))
        .attr('width', 52.5)
        .attr('height', 68)

      sel
        .append("g")
        .append("ellipse")
        .attr("cx", this.sx(0))
        .attr("cy", this.sy(34))
        .attr("rx", 5.5)
        .attr("ry", 3.66)
        .attr("stroke-dasharray", "0.5 0.5")
        .attr("stroke-width", 0.2)
        .attr("stroke", "#888")
        .attr('clip-path', 'url(#cut-off-half-circle)')
        .attr("fill", "none")
        .attr('cursor', 'none')
        .attr("opacity", 0.7);
    }

    drawActualEllipse(sel) {
      sel
        .append("g")
        .append("ellipse")
        .attr("cx", this.sx(0))
        .attr("cy", this.sy(34))
        .attr("rx", 5.5 * this.ratio)
        .attr("ry", 3.66 * this.ratio)
        .attr("stroke-dasharray", "0.5 0.5")
        .attr("stroke-width", 1)
        .attr("stroke", "#833")
        .attr("fill", "none")
        .attr('clip-path', 'url(#cut-off-half-circle)')
        .attr('cursor', 'none')
        .attr("opacity", 0.0);
    }

    drawPointX(sel) {
      const pointX = sel.append('g').attr('cursor', 'none')
      sel
        .append("text")
        .attr("x", this.sx(1.57))
        .attr("y", this.sy(34))
        .attr("fill", "blue")
        .attr("opacity", 1)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", 2)
        .attr("font-weight", 'bold')
        .attr('font-family', 'sans-serif')
        .text("X");

      sel
        .append("line")
        .attr("x1", this.sx(0))
        .attr("x2", this.sx(0 + 5.5))
        .attr("y1", this.sy(34 + 3.66))
        .attr("y2", this.sy(34 - 3.66 - 5.5))
        .attr("stroke-dasharray", "0.5 0.5")
        .attr("stroke", "red")
        .attr('stroke-width', 0.2)
        .attr("opacity", 0.3);

      sel
        .append("line")
        .attr("x1", this.sx(0))
        .attr("x2", this.sx(0 + 5.5))
        .attr("y1", this.sy(34 - 3.66))
        .attr("y2", this.sy(34 + 3.66 + 5.5))
        .attr("stroke-dasharray", "0.5 0.5")
        .attr("stroke", "red")
        .attr('stroke-width', 0.2)
        .attr("opacity", 0.3);
    }

    appendGK(sel) {
      const gkR = 1
      sel
        .append("g")
        .append("circle")
        .attr("class", "gk")
        .attr("r", gkR)
        .attr("opacity", 0.3)
        .attr("fill", "#ccc");

      sel
        .append("g")
        .append("circle")
        .attr("class", "gk")
        .attr("r", gkR - 0.5)
        .attr("stroke-width", 2)
        .attr("opacity", 0.8)
        .attr("fill", "red");

      // sel
      //   .append("g")
      //   .append("text")
      //   .attr("class", "gk-text")
      //   .attr("dy", 3)
      //   .attr("fill", "#ccc")
      //   .attr("font-size", 10)
      //   .attr("font-weight", "bold")
      //   .attr("text-anchor", "middle")
      //   .text("GK");
    }

    updateGK(sel, ball) {
      d3.selectAll(".gk")
        .datum(this.GK)
        .transition()
        .duration(100)
        .ease(d3.easeLinear)
        .attr("cx", (d) => this.sx(d.x))
        .attr("cy", (d) => this.sy(d.y));

      d3.select(".gk-text")
        .datum(this.GK)
        .attr("x", (d) => this.sx(d.x))
        .attr("y", (d) => this.sy(d.y));
    }

    drawGK(sel, ball) {
      sel.call(this.appendGK.bind(this));
      sel.call(this.updateGK.bind(this), ball);
    }

    drawBall(sel) {
      function repeat(thisClass, ball) {
        ball
          .transition()
          .duration(1000)
          .attr('cx', thisClass.sx(thisClass.goal.x))
          .attr('cy', thisClass.sy(thisClass.goal.y))
          // .on('end', setTimeout(_.partial(repeat, thisClass, ball), 1000));
      }

      const ball = sel
        .append("g")
        .append("circle")
        .attr("class", "ball")
        .attr("cx", this.sx(this.ball.x))
        .attr("cy", this.sy(this.ball.y))
        .attr("fill", "red")
        .attr("r", this.ballR)
        .attr('cursor', 'none');

      repeat(this, ball);

      sel
        .append('g')
        .append('text')
        .attr('class', 'ball-distance')
        .attr("x", this.sx(this.ball.x))
        .attr("y", this.sy(this.ball.y))
        .attr('dy', 4)
        .attr('transform', `rotate(90, ${this.sx(this.ball.x)}, ${this.sy(this.ball.y)})`)
        .attr("text-anchor", "middle")
        .attr("font-size", 2)
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
        .attr("stroke-width", 0.2)
        .attr("stroke-dasharray", "0.4 0.4");
    }

    drawResponsableLine(sel, ball) {
      sel.call(this.appendResponsableLine.bind(this), ball);
      sel.call(this.updateResponsableLine.bind(this), ball);
    }
    appendResponsableLine(sel, ball) {

      sel
        .append('g')
        .append('circle')
        .attr("class", "responsable-edge-left")
        .attr('r', 0.5)
        .attr('fill', 'blue')
        .attr('opacity', 0.5);

      sel
        .append('g')
        .append('circle')
        .attr("class", "responsable-edge-right")
        .attr('r', 0.5)
        .attr('fill', 'blue')
        .attr('opacity', 0.5);

      sel
        .append("g")
        .append("line")
        .attr("class", "responsable-path")
        .attr("stroke", "blue")
        .attr("opacity", 0.4)
        .attr("stroke-width", 0.2)
        .attr("stroke-dasharray", "0.2 0.2");

      sel
        .append('g')
        .append('text')
        .attr('class', 'responsable-width')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 24)
        .attr('x', this.sx(0) + 10)
        .attr('y', this.sy(0) + 15)
    }

    calculateDistances(linePoints, gkPosition) {
      function sign(gk, point) {
        if (point[0] < gk[0]) {
          return -1;
        }
        return 1;
      }
      function distance(point1, point2) {
          return Math.sqrt(
            (point1[0] - point2[0]) ** 2 +
            (point1[1] - point2[1]) ** 2
          );
        }


      return linePoints.map(point => distance(gkPosition, point) * sign(gkPosition, point));
    }

    updateResponsableLine(sel, ball) {
      const [perpX1, perpY1, perpX2, perpY2] = this.calculateResponsableLine(ball);
      this.distToEdges = this.calculateDistances([[perpX1, perpY1], [perpX2, perpY2]], [this.sx(this.GK.x), this.sy(this.GK.y)]);

        sel
          .select(".responsable-edge-left")
          .attr('cx', perpX1)
          .attr('cy', perpY1);

          sel
          .select(".responsable-edge-right")
          .attr('cx', perpX2)
          .attr('cy', perpY2);

        // Draw the perpendicular line
        sel
          .select(".responsable-path")
          .style('display', '')
          .attr("x1", perpX1)
          .attr("y1", perpY1)
          .attr("x2", perpX2)
          .attr("y2", perpY2);
      }

      calculateResponsableLine(ball) {
        // Calculate the slope of the shot path
        const slope = (ball.y - this.goal.y) / (ball.x - this.goal.x);


        // Calculate the negative reciprocal to find the slope of the perpendicular line
        const perpSlope = slope === 0 ? 100000000 : -1 / slope;


        // Use the slope and GK position to calculate the endpoints of the perpendicular line
        let perpX1 = this.GK.x - 10;
        let perpY1 = this.GK.y - 10 * perpSlope;
        let perpX2 = this.GK.x + 10;
        let perpY2 = this.GK.y + 10 * perpSlope;

        // Define possible shot paths
        const leftGoalLine = [
          [(ball.x), (ball.y)],
          [(this.goal.x), (this.goal.y - 3.66)]
        ];
        const rightGoalLine = [
          [(ball.x), (ball.y)],
          [(this.goal.x), (this.goal.y + 3.66)]
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
        return [this.sx(perpX1), this.sy(perpY1), this.sx(perpX2), this.sy(perpY2)];
      }

    drawPossibleShotPaths(sel, ball) {
      // draw left goal line
      sel
        .append('g')
        .append("line")
        .attr("class", "possible-shot-path")
        .attr("x1", this.sx(ball.x))
        .attr("y1", this.sy(ball.y))
        .attr("x2", this.sx(this.goal.x)) // left goal pos
        .attr("y2", this.sy(this.goal.y  - 3.66))
        .attr("stroke", "blue")
        .attr("opacity", 0.2)
        .attr("stroke-dasharray", "0.5 0.5")
        .attr("stroke-width", 0.2);

      // draw right goal line
      sel
        .append('g')
        .append("line")
        .attr("class", "possible-shot-path")
        .attr("x1", this.sx(ball.x))
        .attr("y1", this.sy(ball.y))
        .attr("x2", this.sx(this.goal.x)) // right goal pos
        .attr("y2", this.sy(this.goal.y + 3.66))
        .attr("stroke", "blue")
        .attr("opacity", 0.2)
        .attr("stroke-dasharray", "0.5 0.5")
        .attr("stroke-width", 0.2);

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
        .attr("stroke-dasharray", "0.5 0.5")
        .attr("stroke-width", 0.2)
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
        .attr('stroke-dasharray', '0.5 0.5')
        .attr('stroke-width', 0.2)
        .attr('transform', `translate(${this.sx(this.goal.x)},${this.sy(this.goal.y)})`)
        .attr('d', d3.arc()({
          innerRadius: 30,
          outerRadius: 30,
          startAngle: Math.PI,
          endAngle: Math.PI * 2,
        }))
    }

    draw() {
      this.svg.call(this.drawPitch.bind(this));
      this.svg.select('.above').append('g').call(this.drawBaseEllipse.bind(this));
      this.svg.select('.above').append('g').call(this.drawAuxiliaryLines.bind(this));
      this.svg.select('.above').append('g').call(this.drawActualEllipse.bind(this));
      this.svg.select('.above').append('g').call(this.drawPointX.bind(this));
      this.svg.select('.above').append('g').call(this.drawBall.bind(this));
      this.svg.select('.above').append('g').call(this.drawShotPath.bind(this));
      this.svg.select('.above').append('g').call(this.drawPossibleShotPaths.bind(this), this.ball);
      this.svg.select('.above').append('g').call(this.drawResponsableLine.bind(this), this.ball);
      this.svg.select('.above').append('g').call(this.drawGK.bind(this), this.ball);
      this.svg.select('.above').append('g').call(this.drawSemiCircle.bind(this));
      this.svg.on("mousemove", _.partial(this.onMousemove, this));
    }

  }

  function lineIntersection(line1, line2) {
    const [x1, y1] = line1[0];
    const [x2, y2] = line1[1];
    const [x3, y3] = line2[0];
    const [x4, y4] = line2[1];

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