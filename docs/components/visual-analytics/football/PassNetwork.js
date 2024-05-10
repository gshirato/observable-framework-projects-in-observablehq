import * as d3 from "npm:d3";
import GeneralChart from "../../GeneralChart.js";
import _ from "npm:lodash";
import zones from "./zones.js";

export default class PassNetworkChart extends GeneralChart {
    constructor(data, selector, config) {
        super(data, selector, config);
        this.teamId = this.config["teamId"];
        this.teamName = this.config["teamName"];
        this.teamColor = this.config["teamColor"];
        this.soccer = this.config["soccerModule"];
        this.pitch = this.soccer.pitch()
        .height(this.height)
        .showDirOfPlay(true)
        .clip([[-10, -10], [115, 78]]);
        this.zones = zones;
        this.setAxes();
        this.network = this.createNetworkData(data);
        this.adjacency = this.getAdjacency(this.network);
        console.log(this.adjacency)

    }

    getAdjacency(network) {
        const res = []
        for (let i = 0; i < this.zones.length; i++) {
            for (let j = 0; j < this.zones.length; j++) {
                const source = this.zonePosition(i);
                const target = this.zonePosition(j);
                const mid = [source[0], target[1]];
                res.push({
                    source: i,
                    target: j,
                    trajectory: [source, mid, target],
                    value: network.filter(d=>d[0] === i && d[1] === j).length
                });
            }
        }
        return res
    }

    createNetworkData(data) {

        return data.map(d=>[
                this.area(d.location),
                this.area(d.pass.end_location)
            ]
        );
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

        this.sWidth = d3
            .scaleLinear()
            .domain([0, 10])
            .range([0, 2]);

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
      sel.append("g")
        .call(this.pitch)
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

    area(location) {
        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i];
            if (this.sx(location[0]) >= zone[0] && this.sx(location[0]) <= zone[2] && this.sy(location[1]) >= zone[1] && this.sy(location[1]) <= zone[3]) {
                return i;
            }
        }
        console.error(new Error('Location not in any zone:' + location));
    }

    createClass(d) {
        if (this.type === 'origin') {
            return `pass-zone${this.area(d.location)}`;
        }
        if (this.type === 'destination') {
            return `pass-zone${this.area(d.pass.end_location)}`;
        }
    }

    drawZones(sel) {
        const layer = sel.select('#above')
        layer.append('g')
            .selectAll('rect')
            .data(this.zones)
            .join('rect')
            .attr('x', d=>d[0])
            .attr('y', d=>d[1])
            .attr('class', (_, i)=>`zone${i}`)
            .attr('width', d=>d[2] - d[0])
            .attr('height', d=>d[3] - d[1])
            .attr('stroke', '#444')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', '2,2')
            .attr('fill', '#fefefe')
            .attr('opacity', 0.5)
            .on('mouseover', _.partial(this.mouseover, this))
            .on('mousemove', _.partial(this.mousemove, this))
            .on('mouseleave', _.partial(this.mouseleave, this))
    }

    drawNetwork(sel) {
        const layer = sel.select('#above')
        this.drawNodes(layer);
        this.drawEdges(layer);
    }

    drawNodes(layer) {
        layer.append('g')
            .selectAll('circle')
            .data(this.zones)
            .join('circle')
            .attr('cx', d=>(d[0] + d[2]) / 2)
            .attr('cy', d=>(d[1] + d[3]) / 2)
            .attr('r', 2)
            .attr('fill', 'black')
            .attr('stroke', 'white')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.5)
    }

    drawEdges(layer) {
        layer.append('g')
            .selectAll('path')
            .data(this.adjacency)
            .join('path')
            .attr('d', d=>d3.line()
                .curve(d3.curveBundle.beta(0.3))
                (d.trajectory)
            )
            .attr('stroke', this.teamColor)
            .attr('stroke-width', d=>this.sWidth(d.value))
            .attr('fill', 'none')
            .attr('opacity', 0.4)
    }

    zonePosition(i) {
        return [(this.zones[i][0] + this.zones[i][2]) / 2, (this.zones[i][1] + this.zones[i][3]) / 2];
    }

    mouseover(thisClass, event, d) {
    }
    mousemove(thisClass, event, d) {
    }
    mouseleave(thisClass, event, d) {
    }

    draw() {
        this.svg.call(this.drawPitch.bind(this));
        this.svg.call(this.drawWatermark.bind(this));
        this.svg.call(this.drawZones.bind(this));
        this.svg.call(this.drawNetwork.bind(this));
    }
}