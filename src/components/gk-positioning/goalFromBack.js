import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import { formatFloat } from "./positioning.js";


export default class GoalFromBack extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.gkX = config.gkX
        this.gkHeight = 1.83
        this.headSize = 0.10
        this.xmin = config.responsibleXs[0]
        this.xmax = config.responsibleXs[1]
        this.setAxes();
    }

    setAxes() {

      this.sx = d3
        .scaleLinear()
        .domain([-3.66, 3.66])
        .range([this.margin.left, this.width - this.margin.right - this.margin.left]);

      this.sy = d3
        .scaleLinear()
        .domain([0, 2.44])
        .range([this.height - this.margin.bottom - this.margin.top, this.margin.top]);
    }

    defineNet() {
        const dashWidth = 100
        const g = this
            .svg
            .append('defs')
            .append('pattern')
            .attr('id', 'net')
            .attr('patternUnits', 'userSpaceOnUse')
            .attr('width', dashWidth)
            .attr('height', dashWidth)

        g
            .append("path")
            .attr("d", "M0,0 l"+dashWidth+","+dashWidth)
            .attr('stroke', '#999')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '20 15')
            g
            .append("path")
            .attr("d", "M"+dashWidth+",0 l-"+dashWidth+","+dashWidth)
            .attr('stroke', '#999')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '20 15')


    }

    drawGoal() {
        const g = this.svg.append('g').attr('class', 'goal');
        this.defineNet()
        g
            .append('rect')
            .attr('x', this.sx(-3.66))
            .attr('y', this.sy(2.44))
            .attr('width', this.sx(3.66) - this.sx(-3.66))
            .attr('height', this.sy(0) - this.sy(2.44))
            .attr('fill', 'url(#net)')
            .attr('stroke', '#333')
            .attr('opacity', 0.4)
            .attr('stroke-width', 3)

            g
            .append('rect')
            .attr('x', this.sx(-3.66))
            .attr('y', this.sy(2.44))
            .attr('width', this.sx(3.66) - this.sx(-3.66))
            .attr('height', this.sy(0) - this.sy(2.44))
            .attr('fill', '#eee')
            .attr('stroke', 'none')
            .attr('opacity', 0.4)
            .attr('stroke-width', 3)
        g
            .append('line')
            .attr('x1', 0)
            .attr('y1', this.sy(0))
            .attr('x2', this.width - this.margin.right)
            .attr('y2', this.sy(0))
            .attr('stroke', '#333')
            .attr('stroke-width', 3)

        g
            .append('line')
            .attr('x1', this.sx(-3.66))
            .attr('y1', this.sy(2.44))
            .attr('x2', this.sx(3.66))
            .attr('y2', this.sy(2.44))
            .attr('stroke', '#333')
            .attr('stroke-width', 3)

        g
            .append('line')
            .attr('x1', this.sx(-3.66))
            .attr('y1', this.sy(0))
            .attr('x2', this.sx(-3.66))
            .attr('y2', this.sy(2.44))
            .attr('stroke', '#333')
            .attr('stroke-width', 3)

        g
            .append('line')
            .attr('x1', this.sx(3.66))
            .attr('y1', this.sy(0))
            .attr('x2', this.sx(3.66))
            .attr('y2', this.sy(2.44))
            .attr('stroke', '#333')
            .attr('stroke-width', 3)

        d3.select('.goal').attr('stroke', '#333')
    }

    drawGK() {
        const g = this.svg.append('g').attr('class', 'gk')
            .attr('transform', `translate(${this.sx(this.gkX) - this.sx(0)}, 0)`);
        const r = this.sx(this.headSize) - this.sx(0)
        g
            .append('circle')
            .attr('cx', this.sx(0))
            .attr('cy', this.sy(this.gkHeight) + r)
            .attr('r', r)
            .attr('fill', 'none')
            .attr('stroke', '#333')
            .attr('stroke-width', 2)

            g
            .append('circle')
            .attr('cx', this.sx(0))
            .attr('cy', this.sy(this.gkHeight))
            .attr('r', 1)
            .attr('fill', 'none')
            .attr('stroke', '#333')
            .attr('stroke-width', 2)

        g
            .append('path')
            .datum([
                [this.sx(-0.80), this.sy(this.gkHeight) + r * 2],
                [this.sx(0), this.sy(0)],
                [this.sx(0.80), this.sy(this.gkHeight) + r * 2],
                [this.sx(-0.80), this.sy(this.gkHeight) + r * 2],
            ])
            .attr('fill', 'none')
            .attr('stroke', '#333')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '12 2')
            .attr('d', d3.line())
        console.log()
        g
            .append('text')
            .attr('x', this.sx(0))
            .attr('y', this.sy(this.gkHeight))
            .attr('dy', -5)
            .attr('text-anchor', 'middle')
            .text(`GK (${this.gkHeight}m)`)
    }

    drawResponsibleArea() {
        const g = this.svg
            .append('g')
            .attr('class', 'area')
            .attr('transform', `translate(${this.sx(this.gkX) - this.sx(0)}, 0)`);

            const r = this.sx(this.headSize) - this.sx(0)
        g
            .append('rect')
            .attr('x', this.sx(this.xmin))
            .attr('y', this.sy(this.gkHeight) + r * 2)
            .attr('width', this.sx(this.xmax) - this.sx(this.xmin))
            .attr('height', this.sy(0) - this.sy(this.gkHeight) - r  *2)
            .attr('fill', 'blue')
            .attr('stroke', 'blue')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '6 4')
            .attr('opacity', 0.1)

        g
            .append('line')
            .attr('x1', this.sx(this.xmin))
            .attr('x2', this.sx(this.xmin))
            .attr('y1', this.sy(this.gkHeight))
            .attr('y2', this.sy(0))
            .attr('stroke', 'blue')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '6 4')

        g
            .append('line')
            .attr('x1', this.sx(this.xmax))
            .attr('x2', this.sx(this.xmax))
            .attr('y1', this.sy(this.gkHeight))
            .attr('y2', this.sy(0))
            .attr('stroke', 'blue')
            .attr('stroke-width', 3)
            .attr('stroke-dasharray', '6 4')

        const annotations = ['L', 'R']
        g
            .append('g')
            .selectAll('text')
            .data([this.xmin, this.xmax])
            .join('text')
            .attr('x', d=>(this.sx(d) + this.sx(this.gkX)) / 2)
            .attr('y', this.sy(0) + 20)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .text((d)=>`${formatFloat(2)(Math.abs(d))}m`)

            g
            .append('g')
            .selectAll('text')
            .data([this.xmin, this.xmax])
            .join('text')
            .attr('x', d=>this.sx(d))
            .attr('y', this.sy(0) + 20)
            .attr('text-anchor', 'middle')
            .text((_, i)=>`${annotations[i]}`)


        g
            .append('text')
            .attr('x', this.sx(this.gkX))
            .attr('y', this.sy(0) + 20)
            .attr('text-anchor', 'middle')
            .text(`▲`)

        g.append('text')
            .attr('x', this.margin.top)
            .attr('y', this.margin.top)
            .attr('dy', -5)
            .attr('text-anchor', 'start')
            .text(`GKの守備範囲`)
            .text(`${formatFloat(2)(this.xmax - this.xmin)}m / 7.32m → ${formatFloat(2)((this.xmax - this.xmin) / 7.32 * 100)}%`)
    }

    draw() {
        this.drawGoal();
        this.drawGK();
        this.drawResponsibleArea();
    }

  }