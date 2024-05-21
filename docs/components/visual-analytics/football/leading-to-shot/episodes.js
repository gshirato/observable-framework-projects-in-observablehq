import * as d3 from "npm:d3";
import GeneralChart from "../../../GeneralChart.js";
import _ from "npm:lodash";

export default class EpisodesLeadingToShot extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.soccer = this.config["soccerModule"];
        this.observedId = this.config["observedId"];
        this.opponentId = this.config["opponentId"];
        this.observedColor = this.config["observedColor"];
        this.opponentColor = this.config["opponentColor"];
        this.data = this.prepareData(this.data).flat()
        this.pitch = this.soccer.pitch()
            .height(this.height)
            .showDirOfPlay(true)
            .clip([[-10, -10], [115, 78]]);

        this.setAxes();
    }

    setAxes() {
        this.sx = d3
            .scaleLinear()
            .domain([0, 120])
            .range([0, 105]);

        this.sy = d3
            .scaleLinear()
            .domain([0, 80])
            .range([0, 68]);

        this.sc = d3
            .scaleOrdinal()
            .domain([this.observedId, this.opponentId])
            .range([this.observedColor, this.opponentColor]);

        this.svg.append("g")
            .append('text')
            .attr('x', this.pitch.width() / 2)
            .attr('y', this.margin.top - 5)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'bottom')
            .style('font-size', 16)
            .text(`${this.teamName} (Attacking→)`)
    }

    drawPitch(sel) {
      sel.append("g").call(this.pitch)
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
        .attr("y", this.pitch.height() - 30)
        .attr("width", 200);
    }


    prepareData(data) {
        return data.filter(d=>{
            const shot = d[1].find(_d=>_d.type.name == "Shot")
            if (shot == undefined) {
                return false
            }
            // console.log(shot, this.observedId)

            return  shot.team.id === this.observedId;
        }).map(d=>d[1])
    }

    getLocation(d, value, scaler, maxValue) {
        if (d.team.id === this.observedId) {
            return scaler(value)
        }
        else if (d.team.id === this.opponentId) {
            return scaler(maxValue - value)
        }
        else {
            console.error(`Unknown team id: ${d.team.id}`)
        }
    }

    getX(d, x) {
        return this.getLocation(d, x, this.sx, 120)
    }

    getY(d, y) {
        return this.getLocation(d, y, this.sy, 80)
    }

    drawEpisodes(sel) {
        const layer = sel.select('#above').append('g').attr('id', 'episodes')

        for (const possession of d3.group(this.data, d=>d.possession).keys()) {
            const possessionData = this.data.filter(d=>d.possession == possession)

            layer
                .append('g')
                .selectAll('line')
                .data(
                    possessionData.filter(d=>["Shot", "Pass", "Carry"].includes(d.type.name))
                )
                .join('line')
                .attr('class', `possession${possession}`)
                .attr('x1', d=>this.getX(d, d.location[0]))
                .attr('y1', d=>this.getY(d, d.location[1]))
                .attr('x2', d=>this.getX(d, this.getEndLocation(d)[0]))
                .attr('y2', d=>this.getY(d, this.getEndLocation(d)[1]))
                .attr('stroke', this.sc(possession))
                .attr('stroke-width', d=>d.type.name == "Shot"? 1.5 : 0.5)
                .attr('stroke-dasharray', d=>d.type.name == "Carry" ? '1,1' : '0')
                .attr('opacity', 0.5)
                .on('mouseover', _.partial(this.mouseover, this))
                .on('mousemove', _.partial(this.mousemove, this))
                .on('mouseleave', _.partial(this.mouseleave, this))

            layer
                .append('g')
                .selectAll('text')
                .data(
                    possessionData.filter(d=>["Clearance", "Goal Keeper"].includes(d.type.name))
                )
                .join('text')
                .attr('class', `possession${possession}`)
                .attr('x', d=>this.getX(d, d.location[0]))
                .attr('y', d=>this.getY(d, d.location[1]))
                .attr('pointer-events', 'none')
                .attr('opacity', 0.8)
                .attr('text-anchor', 'middle')
                .attr('font-size', '6px')
                .attr('font-family', 'sans-serif')
                .text(d=>d.type.name === "Clearance" ? "c": "x")

            layer
                .append('g')
                .selectAll('circle')
                .data(possessionData.filter(d=>["Shot", "Pass", "Carry"].includes(d.type.name)))
                .join('circle')
                .attr('class', `possession${possession}`)
                .attr('cx', d=>this.getX(d, d.location[0]))
                .attr('cy', d=>this.getY(d, d.location[1]))
                .attr('fill', this.sc(possession))
                .attr('r', 1)
                .attr('opacity', 0.5)
        }
    }

    getEndLocation(d) {
        const name = d.type.name.split(' ').join('').toLowerCase()

        if (d[name].end_location) {
            return d[name].end_location
        }
        else {
            return d.location
        }
    }

    mouseover(thisClass, event, d) {
        d3.selectAll('#episodes line').attr('opacity', 0.1)
        d3.selectAll('#episodes text').attr('opacity', 0.1)
        d3.selectAll('#episodes circle').attr('opacity', 0.1)
        const className = d3.select(this).attr('class')

        const durations = d3.selectAll(`.${className}`).data().map(d=>d.duration)

        d3.selectAll(`.${className}`)
            .attr('opacity', 0.8)
            .attr('x2', d=>thisClass.getX(d, d.location[0]))
            .attr('y2', d=>thisClass.getY(d, d.location[1]))
            .transition()
            .duration(d=>d.duration * 50)
            .delay((_, i)=>{
                return durations.slice(0, i).reduce((a, b)=>a+b, 0) * 50
            })
            .attr('x2', d=>thisClass.getX(d, thisClass.getEndLocation(d)[0]))
            .attr('y2', d=>thisClass.getY(d, thisClass.getEndLocation(d)[1]))

    }
    mousemove(thisClass, event, d) {
    }
    mouseleave(thisClass, event, d) {
    }

    draw() {
        this.svg.call(this.drawPitch.bind(this));
        this.svg.call(this.drawWatermark.bind(this));
        this.svg.call(this.drawEpisodes.bind(this));
    }
}