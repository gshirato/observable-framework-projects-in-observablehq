import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../../chart/components/GeneralChart.js";


export default class UmapChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.config = config;
        this.successful = config.successful;
        this.characterized = config.characterized;
        this.highlight = config.highlight;
        this.setAxes();
    }

    setAxes() {
        this.sx = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d[0]))
            .range(this.domainLeftToRight)

        this.sy = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d[1]))
            .range(this.domainBottomToTop)

        this.sc = this.getSc()
    }

    getSc() {
        if (this.highlight === 'successful') {
            return d3.scaleOrdinal()
                .domain([true, false])
                .range(['green', '#91bfdb'])
        }

        const perc25 = d3.quantile(this.characterized, 0.25, d => d[this.highlight])
        const perc75 = d3.quantile(this.characterized, 0.75, d => d[this.highlight])
        const mean = d3.mean(this.characterized, d => d[this.highlight])
        const domain = [perc25, mean, perc75]
        return d3.scaleLinear()
            .domain(domain)
            .range(['#91bfdb', '#ffffbf', '#fc8d59'])
    }

    drawAxes(sel) {

    }

    getFeatureValue(i) {
        if (this.highlight === 'successful') {
            return this.successful[i].successful
        }
        return this.characterized[i][this.highlight]
    }

    addBrush() {
        this.brush = d3.brush()
            .extent([
                [this.margin.left, this.margin.top],
                [this.width - this.margin.right, this.height - this.margin.bottom]
            ])
            .on('end', this.brushed.bind(this));

        this.svg.append('g').call(this.brush)

        this.svg
            .append('g')
            .append('rect')
            .attr('class', 'brush-rect')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0)
    }

    brushed(event) {
        if (!event.selection) {
            this.svg.call(this.drawPoints.bind(this));
            d3.selectAll('.brush-rect').attr('opacity', 0);
            return;
        }
        const [[xmin, ymin], [xmax, ymax]] = event.selection;
        const selected = this.data.filter((d, i) => {
            const x = this.sx(d[0]);
            const y = this.sy(d[1]);
            return x >= xmin && x <= xmax && y >= ymin && y <= ymax;
        });

        // do this in each chart (chart has its method)
        d3.selectAll('.brush-rect')
            .attr('x', xmin)
            .attr('y', ymin)
            .attr('width', xmax - xmin)
            .attr('height', ymax - ymin)
            .attr('opacity', 0.9)


        const selectedIndices = selected.map(d => this.data.indexOf(d));
        d3.selectAll('circle').attr('opacity', 0.1);
        // d3.selectAll('circle').attr('selected', false);

        selectedIndices.forEach(i => {
            d3.selectAll(`.d-${i}`).attr('opacity', 0.9);
            // d3.select(`.d-${i}`).attr('selected', true);
        })

    }

    drawPoints(sel) {
        sel.selectAll("circle")
            .data(this.data)
            .join("circle")
            .attr("cx", d => this.sx(d[0]))
            .attr("cy", d => this.sy(d[1]))
            .attr("r", 2)
            .attr('class', (_, i) => `d-${i}`)
            .attr("fill", (_, i)=>this.sc(this.getFeatureValue(i)))
            .attr("opacity", (_, i)=>this.successful[i].successful ? 0.9: 0.1)
            .attr('feature', (_, i)=>this.getFeatureValue(i))
            .on("mouseover", _.partial(this.mouseover, this))
            .on("mousemove", _.partial(this.mousemove, this))
            .on("mouseleave", _.partial(this.mouseleave, this))
    }

    draw() {
        this.svg.call(this.drawAxes.bind(this));
        this.svg.call(this.drawPoints.bind(this));
        this.svg.call(this.drawTitle.bind(this));
        this.svg.call(this.drawColorbar.bind(this));
        this.addBrush();
    }

    drawColorbar(sel) {
        if (this.highlight === 'successful') {
            return
        }
        const colorbar = sel.append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.height - this.margin.top - 100})`)

        const gradient = colorbar.append("defs")
            .append("linearGradient")
            .attr("id", "colorGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%")

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", this.sc.range()[0])

        gradient.append("stop")
            .attr("offset", "50%")
            .attr("stop-color", this.sc.range()[1])

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", this.sc.range()[2])

        colorbar.append("text")
            .attr("x", 50)
            .attr("y", -5)
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .text(this.highlight)

        colorbar.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 100)
            .attr("height", 10)
            .attr("fill", "url(#colorGradient)")

        colorbar
            .append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("text-anchor", "start")
            .attr("font-size", "10px")
            .text(d3.min(this.characterized, d => d[this.highlight]).toFixed(1))

        colorbar
            .append("text")
            .attr("x", 100)
            .attr("y", 20)
            .attr("text-anchor", "end")
            .attr("font-size", "10px")
            .text(d3.max(this.characterized, d => d[this.highlight]).toFixed(1))
    }



    drawTitle(sel) {
    }

    mouseover(thisClass, event, d) {
        thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
        const feature = parseFloat(d3.select(event.target).attr('feature')).toFixed(1);
        thisClass.tooltip.setText(`${thisClass.highlight}: <b>${feature}</b>`);
        thisClass.tooltip.move(event, d);
    }
    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }
  }