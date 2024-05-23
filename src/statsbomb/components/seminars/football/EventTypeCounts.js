import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../../../chart/components/GeneralChart.js";



export default class EventTypeCounts extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
		this.data = data
		this.otherHighlightColor = config['otherHighlightColor']
		this.defaultColor = config['defaultColor']
		this.highlightColor = config['highlightColor']
		this.otherHighlight = config['otherHighlight']
        this.setAxes();

    }

    setAxes() {
		this.sx = d3
		  .scaleLinear()
		  .domain([0, 800])
		  .range([this.margin.left, this.width - this.margin.right]);

		  this.sy = d3
		  .scaleBand()
		  .domain(this.data.map((d) => d[0]))
		  .range([this.height - this.margin.bottom, this.margin.top])
		  .paddingInner(0.05)

    }

    drawAxes() {
        const xAxis = d3.axisBottom(this.sx);

        this.svg
            .append("g")
			.attr('transform', `translate(0, ${this.height - this.margin.bottom})`)
            .call(xAxis);
    }

	createClassName(eventName) {
		return eventName
			.replace(/ /g, '-')
			.replace(/'/g, '')
			.replace(/,/g, '')
			.replace(/\//g, '')
			.replace(/\*/g, '')
	}

    drawBars() {
        this.svg
            .append("g")
            .selectAll("rect")
            .data(this.data)
            .join("rect")
            .attr("x", (d) => this.margin.left)
            .attr("y", (d) => this.sy(d[0]))
            .attr("height", this.sy.bandwidth())
            .attr("width", (d) => this.sx(d[1]))
			.attr('class', d=>this.createClassName(d[0]))
            .attr("fill", this.defaultColor)
			.on('mouseover', _.partial(this.mouseover, this))
			.on('mousemove', _.partial(this.mousemove, this))
			.on('mouseout', _.partial(this.mouseleave, this))


        this.svg
			.append('g')
			.selectAll('text')
			.data(this.data)
			.enter()
			.append('text')
			.attr('x', (d) => this.sx(d[1]) + 40)
			.attr('y', (d) => this.sy(d[0]) + this.sy.bandwidth() / 2)
			.attr('dy', '0.35em')
			.attr('text-anchor', 'start')
			.attr('font-size', 12)
			.attr('font-family', 'sans-serif')
			.text((d) => d[0])
			.attr('fill', '#222')
    }

    draw() {
      this.drawAxes();
      this.drawBars();
    }

	mouseover(thisClass, event, d) {
		d3.select(this).attr('fill', thisClass.highlightColor)
		d3.select(thisClass.otherHighlight).select(`.${thisClass.createClassName(d[0])}`).attr('fill', thisClass.otherHighlightColor)

		thisClass.tooltip.show(event, d);
	}
	mousemove(thisClass, event, d) {
		thisClass.tooltip.setText(
			`${d[0]}: ${d[1]}`
		)
		thisClass.tooltip.move(event, d);
	}
	mouseleave(thisClass, event, d) {
		d3.select(this).attr('fill', thisClass.defaultColor)
		d3.select(thisClass.otherHighlight).select(`.${thisClass.createClassName(d[0])}`).attr('fill', thisClass.defaultColor)
		thisClass.tooltip.hide(event, d);
	}
  }