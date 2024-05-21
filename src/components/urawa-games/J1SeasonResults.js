import * as d3 from "npm:d3";
// import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";

export default class J1SeasonResults extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.setAxes();
        // TODO: take shootouts into account
        this.gainedPoints = this.data.map(d => {
            return {'W': 3, 'D': 1, 'L': 0}[d.result]
        });
        this.cumsumPoints = d3.cumsum(this.gainedPoints);
    }


        setAxes() {
            this.sx = d3
                .scaleTime()
                .domain([
                    new Date(this.data[0].year, 1, 1), new Date(this.data[0].year, 11, 31)
                ])
                .range([this.margin.left, this.width - this.margin.right]);

            this.sy = d3
                .scaleLinear()
                .domain([0, 3 * this.data.length])
                .range([this.height - this.margin.bottom, this.margin.top]);
            }

    drawAxes() {
        const xaxis = d3.axisBottom(this.sx);
        this.svg
            .append("g")
            .attr("transform", `translate(0,${this.height-this.margin.bottom})`)
            .call(xaxis)

        const yaxis = d3.axisLeft(this.sy);
        this.svg
            .append("g")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(yaxis)
    }

    drawJ1Points() {

        this.svg
            .append('g')
            .selectAll('line')
            .data(this.data)
            .join('line')
            .attr('x1', (d, i)=> this.sx(d.date))
            .attr('y1', (d, i) => this.sy(this.cumsumPoints[i]- this.gainedPoints[i]) )
            .attr('x2', (d, i)=> this.sx(d.date))
            .attr('y2', (d, i) => this.sy(this.cumsumPoints[i]- this.gainedPoints[i]) )
            .transition()
            .duration(300)
            .delay((_, i) => i * 20)
            .attr('x1', (d, _)=> this.sx(d.date))
            .attr('y1', (_, i) => this.sy(this.cumsumPoints[i]))
            .attr('stroke-width', 2)
            .attr('stroke', 'black');

        this.svg
            .append('g')
            .selectAll('line')
            .data(this.data)
            .join('line')
            .attr('x1', (_, i)=> {
                if (i === 0) return this.sx(this.data[i].date)
                return this.sx(this.data[i - 1].date)
            })
            .attr('y1', (_, i) => this.sy(this.cumsumPoints[i]- this.gainedPoints[i]))
            .attr('x2', (_, i)=> {
                if (i === 0) return this.sx(this.data[i].date)
                return this.sx(this.data[i - 1].date)
            })
            .attr('y2', (_, i) => this.sy(this.cumsumPoints[i]- this.gainedPoints[i]))
            .transition()
            .duration(300)
            .delay((_, i) => i * 20 + 100)
            .attr('x2', (d, _)=> this.sx(d.date))
            .attr('y2', (_, i) => this.sy(this.cumsumPoints[i]- this.gainedPoints[i]))
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 2')
            .attr('stroke', 'black');

        this.svg
            .append('g')
            .selectAll('circle')
            .data(this.data)
            .join('circle')
            .attr('cx', (d, i)=> this.sx(d.date))
            .attr('cy', (d, i) => this.sy(this.cumsumPoints[i]))
            .attr('r', 0)
            .transition()
            .duration(300)
            .delay((_, i) => i * 20 + 100)
            .attr('r', 3)
            .attr('fill', '#f33')

    }

    drawReference() {
        const sc = d3.scaleLinear().domain([1, 3]).range(['blue', 'red'])
        this.svg
            .append('g')
            .selectAll('line')
            .data([1, 2, 3])
            .join('line')
            .attr('x1', this.sx.range()[1])
            .attr('y1', d => this.sy(this.data.length * d))
            .attr('x2', this.sx.range()[1])
            .attr('y2', d => this.sy(this.data.length * d))
            .transition()
            .duration(500)
            .delay(1000)
            .attr('x2', this.sx.range()[1] - this.width / 6)
            .attr('y2', d => this.sy(this.data.length * d))
            .attr('stroke', '#ccc')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4 2')

        this.svg
            .append('g')
            .selectAll('text')
            .data([1, 2, 3])
            .join('text')
            .attr('x', this.sx.range()[1])
            .attr('y', d => this.sy(this.data.length * d))
            .attr('dx', d => -30)
            .attr('dy', d => 6)
            .attr('opacity', 0)
            .attr('text-anchor', 'middle')
            .attr('font-family', 'sans-serif')
            .attr('font-size', 12)
            .attr('font-weight', 'bold')
            .attr('fill', '#111')
            .attr('stroke', '#ccc')
            .attr('stroke-width', 0.5)
            .text(d => `平均勝ち点 ${d}`)
            .transition()
            .duration(600)
            .delay(1000)
            .attr('opacity', 1)

    }

    draw(){
        this.drawAxes();
        this.drawJ1Points();
        this.drawReference();
    }
}