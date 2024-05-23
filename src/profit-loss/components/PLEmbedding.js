import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../chart/components/GeneralChart.js";
import drawDots from "../../chart/components/Dots.js";
import PLChart from "./PLChart.js";
import {parseFormattedNumber, getPLKeys} from "./utils.js";


export default class PLEmbeddingChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.teams = config["teams"];
      this.plData = config['plData']
      this.setAxes();
    }

    setAxes() {
      this.sx = d3
        .scaleLinear()
        .domain([0, d3.max(this.data, d=>d['売上高-合計'])])
        .range([this.margin.left, this.width - this.margin.right]);

      this.sy = d3
        .scaleLinear()
        .domain([0, d3.max(this.data, d=>d['売上原価-小計'])])
        .range([this.height - this.margin.bottom, this.margin.top]);
    }

    drawAxes() {
      const xaxis = d3.axisBottom(this.sx);
      this.svg
        .append("g")
        .attr('class', 'x-axis')
        .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        .call(xaxis)
        .append("text")
        .attr("x", this.width / 2)
        .attr("y", 0)
        .attr("dy", "3em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("売上高");

        const yaxis = d3.axisLeft(this.sy);
        this.svg
        .append("g")
        .attr('class', 'y-axis')
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(yaxis)
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "0.5em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("売上原価");
    }

    getProfit(i) {
      return this.plData.find(d=>(d.大分類 === '当期純利益') && (Object.keys(d).includes(this.teams[i])))[this.teams[i]]
    }

    drawMain() {
      const sOpacity = d3.scaleLinear().domain([0, 500]).range([0.4, 1])

      const chart = this.svg
        .append("g")
        .attr("class", "main")

      drawDots(chart, {
        data: this.data,
        cx: (d) => this.sx(d['売上高-合計']),
        cy: (d) => this.sy(d['売上原価-小計']),
        fill: (_, i)=>parseFormattedNumber(this.getProfit(i)) > 0 ? 'green' : 'red',
        opacity: (_, i)=>sOpacity(parseFormattedNumber(this.getProfit(i))),
        r: 5
      })

      chart
        .attr("index", (_, i) => i)
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this));

      this.svg
        .append("g")
        .attr("class", "main")
        .selectAll("text")
        .data(this.data)
        .join("text")
        .attr("x", (d) => this.sx(d['売上高-合計']))
        .attr("y", (d) => this.sy(d['売上原価-小計']))
        .attr("dy", -5)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-weight", 'bold')
        .attr('pointer-events', 'none')
        .text((d, i) => d['売上高-合計'] < 3000 ? "": this.teams[i]);
    }

    addBrush() {
        this.brush = d3.brush()
          .extent([
            [this.margin.left, this.margin.top],
            [this.width - this.margin.right, this.height - this.margin.bottom]
          ])
          .on('end', this.brushed.bind(this));

        this.svg.append('g').call(this.brush)
    }

    draw() {
      this.drawAxes();
      this.drawMain();
    //   this.addBrush();
    }

    brushed(event) {
        d3.select('.x-axis').remove();
        d3.select('.y-axis').remove();
        d3.selectAll('.main').remove();

        if (!event.selection) {
            this.sx.domain([0, d3.max(this.data, d=>d['売上高-合計'])]);
            this.sy.domain([0, d3.max(this.data, d=>d['売上原価-小計'])]);

        }
        else {
            this.sx = d3
                .scaleLinear()
                .domain([
                    this.sx.invert(event.selection[0][0]),
                    this.sx.invert(event.selection[1][0])
                ])
                .range([this.margin.left, this.width - this.margin.right]);

            this.sy = d3
                .scaleLinear()
                .domain([
                    this.sy.invert(event.selection[1][1]),
                    this.sy.invert(event.selection[0][1])
                ])
                .range([this.height - this.margin.bottom, this.margin.top]);
        }

        this.drawAxes();
        this.drawMain();
      }

    mouseover(thisClass, event, d) {
      new PLChart(thisClass.plData.filter(d=>Object.keys(d).includes(thisClass.teams[d3.select(this).attr("index")])), `${thisClass.rootSelector} .detail`, {
        height: thisClass.height,
        width: thisClass.width,
        margin: { top: 10, bottom: 20, left: 50, right: 50 },
        team: thisClass.teams[d3.select(this).attr("index")],
        yExtent: [-10000, 10000],
        plKeys: getPLKeys(thisClass.plData),
        detail: false
      }).draw();
    }
  }