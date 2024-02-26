import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../GeneralChart.js";
import { parseFormattedNumber, getKey, getCumsum } from "./utils.js";
class PLChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.team = config["team"];
      this.plKeys = config["plKeys"];
      this.yExtent = config["yExtent"];
      this.titleFontSize = config["titleFontSize"] || 25;
      this.detail = config["detail"];
      this.otherLeagues = config["otherLeagues"];
      this.profitColor = 'green';
      this.lossColor = 'red';
      this.itemTextSize = 10
      this.setAxes();
      this.writeHtml();
    }

    writeHtml() {
      d3.select(`${this.rootSelector} .team`).html(this.team);
      d3.select(`${this.rootSelector} .desc`).html(
        `当期純利益: ${
          parseFormattedNumber(
            this.data.find((d) => d.大分類 === "当期純利益")[this.team]
          ) / 100
        } (億円）`
      );
    }

    setAxes() {
      this.sx = d3
        .scaleBand()
        .domain(this.plKeys)
        .range([this.margin.left, this.width - this.margin.right - 50]);

      this.sy = d3
        .scaleLinear()
        .domain(this.yExtent)
        .range([this.height - this.margin.bottom, this.margin.top]);
    }

    drawAxes() {
      this.svg
        .append("g")
        .append("line")
        .attr("x1", this.margin.left)
        .attr("x2", this.width - this.margin.right)
        .attr("y1", this.sy(0))
        .attr("y2", this.sy(0))
        .attr("stroke", "#888")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "6 2");

      const yaxis = d3.axisLeft(this.sy);
      this.svg
        .append("g")
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(yaxis)
        .selectAll("text")
        .attr('font-size', 10)
        .text((d) => `${d / 100}億円`);
    }

    writeName(d) {
      return this.detail ? d.name.split("-")[1].slice(0,4) : "";
    }

    textItem(selection, j) {
      selection
        .attr("font-size", this.itemTextSize)
        .attr("font-weight", 'bold')
        .attr('dy', (_, i)=>i%2===j?this.itemTextSize*2:this.itemTextSize)
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (d, i) => this.sy(0))
        .text(d=>this.writeName(d));
    }

    rectItem(selection, j, color) {
      const yOffset = 2
      selection
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (_, i) => i%2===j?this.sy(0) + this.itemTextSize + yOffset: this.sy(0)+ yOffset)
        .attr('k', (_, i)=>console.log(this.sy(0)))
        .attr('width', 40)
        .attr('height', this.itemTextSize - 1)
        .attr('fill', color)
        .attr('opacity', 0.4)
    }

    drawSales() {
      this.svg
        .append("g")
        .selectAll("rect")
        .data(getCumsum(this.data, "売上高", this.team))
        .join("rect")
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (d) => this.sy(d.value))
        .attr("width", this.sx.bandwidth())
        .attr("height", 0)
        .attr("fill", this.profitColor)
        .attr("opacity", 0.5)
        .attr(
          "value",
          (d) => this.data.find((d_) => getKey(d_) === d.name)[this.team]
        )
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this))
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100)
        .attr("height", (d, i) =>
          i === 0
            ? this.sy(0) - this.sy(d.value)
            : this.sy(getCumsum(this.data, "売上高", this.team)[i - 1].value) -
              this.sy(d.value)
        );

      this.svg
          .append('g')
          .selectAll('rect')
          .data(getCumsum(this.data, "売上高", this.team))
          .join('rect')
          .call(this.rectItem.bind(this), 0, this.profitColor)

      this.svg
        .append("g")
        .selectAll("text")
        .data(getCumsum(this.data, "売上高", this.team))
        .join("text")
        .call(this.textItem.bind(this), 0)

    }

    drawCosts() {
      function getY(thisClass, d, i) {
        return i === 0
          ? d3.max(
              getCumsum(thisClass.data, "売上高", thisClass.team),
              (d) => d.value
            )
          : d3.max(
              getCumsum(thisClass.data, "売上高", thisClass.team),
              (d) =>
                d.value -
                getCumsum(thisClass.data, "売上原価", thisClass.team)[i - 1].value
            );
      }
      this.svg
        .append("g")
        .selectAll("rect")
        .data(getCumsum(this.data, "売上原価", this.team))
        .join("rect")
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (d, i) => this.sy(getY(this, d, i)))
        .attr("width", this.sx.bandwidth())
        .attr("height", 0)
        .attr("fill", this.lossColor)
        .attr("opacity", 0.5)
        .attr(
          "value",
          (d) => this.data.find((d_) => getKey(d_) === d.name)[this.team]
        )
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this))
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100 + 700)
        .attr("height", (d, i) =>
          i === 0
            ? this.sy(0) - this.sy(d.value)
            : this.sy(getCumsum(this.data, "売上原価", this.team)[i - 1].value) -
              this.sy(d.value)
        );

      this.svg
        .append('g')
        .selectAll('rect')
        .data(getCumsum(this.data, "売上原価", this.team))
        .join('rect')
        .call(this.rectItem.bind(this), 1, this.lossColor)
      this.svg
        .append("g")
        .selectAll("text")
        .data(getCumsum(this.data, "売上原価", this.team))
        .join("text")
        .call(this.textItem.bind(this), 1)
    }

    drawSGaA() {
      function getY(thisClass, d, i) {
        return (
          d3.max(
            getCumsum(thisClass.data, "売上高", thisClass.team),
            (d) => d.value
          ) -
          d3.max(
            getCumsum(thisClass.data, "売上原価", thisClass.team),
            (d) => d.value
          )
        );
      }
      this.svg
        .append("g")
        .selectAll("rect")
        .data(getCumsum(this.data, "販売費および一般管理費", this.team))
        .join("rect")
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (d, i) => this.sy(getY(this, d, i)))
        .attr("width", this.sx.bandwidth())
        .attr("height", 0)
        .attr("fill", this.lossColor)
        .attr("opacity", 0.5)
        .attr(
          "value",
          (d) => this.data.find((d_) => getKey(d_) === d.name)[this.team]
        )
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this))
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100 + 1400)
        .attr("height", (d, i) => this.sy(0) - this.sy(d.value));

      this.svg
        .append('g')
        .selectAll('rect')
        .data(getCumsum(this.data, "販売費および一般管理費", this.team))
        .join('rect')
        .call(this.rectItem.bind(this), 0, this.lossColor)

      this.svg
        .append("g")
        .selectAll("text")
        .data(getCumsum(this.data, "販売費および一般管理費", this.team))
        .join("text")
        .call(this.textItem.bind(this), 0)
    }

    drawNonOperatingIncome() {
      function getY(thisClass, d, i) {
        const base =
          d3.max(
            getCumsum(thisClass.data, "売上高", thisClass.team),
            (d) => d.value
          ) -
          d3.max(
            getCumsum(thisClass.data, "売上原価", thisClass.team),
            (d) => d.value
          ) -
          d3.max(
            getCumsum(thisClass.data, "販売費および一般管理費", thisClass.team),
            (d) => d.value
          ) +
          d.value;

        if (i === 0) return base;
        return (
          base +
          parseFormattedNumber(
            thisClass.data.find((d) => d.小分類 === "営業外費用")[thisClass.team]
          ) -
          d.value
        );
      }
      this.svg
        .append("g")
        .selectAll("rect")
        .data(getCumsum(this.data, "経常利益", this.team))
        .join("rect")
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (d, i) => this.sy(getY(this, d, i)))
        .attr("width", this.sx.bandwidth())
        .attr("height", 0)
        .attr("fill", (d) => (d.name === "経常利益-営業外収益" ? this.profitColor : this.lossColor))
        .attr("opacity", 0.5)
        .attr(
          "value",
          (d) => this.data.find((d_) => getKey(d_) === d.name)[this.team]
        )
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this))
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100 + 1500)
        .attr("height", (d) => {
          const value = parseFormattedNumber(
            this.data.find((d_) => getKey(d_) === d.name)[this.team]
          );
          return this.sy(0) - this.sy(value);
        });

        this.svg
          .append('g')
          .selectAll('rect')
          .data(getCumsum(this.data, "経常利益", this.team))
          .join('rect')
          .call(this.rectItem.bind(this), 1, 'gray')

      this.svg
        .append("g")
        .selectAll("text")
        .data(getCumsum(this.data, "経常利益", this.team))
        .join("text")
        .call(this.textItem.bind(this), 1)
    }

    drawSpecialIncome() {
      function getY(thisClass, d, i) {
        const base =
          d3.max(
            getCumsum(thisClass.data, "売上高", thisClass.team),
            (d) => d.value
          ) -
          d3.max(
            getCumsum(thisClass.data, "売上原価", thisClass.team),
            (d) => d.value
          ) -
          d3.max(
            getCumsum(thisClass.data, "販売費および一般管理費", thisClass.team),
            (d) => d.value
          ) +
          parseFormattedNumber(
            thisClass.data.find((d) => d.小分類 === "営業外収益")[thisClass.team]
          ) -
          parseFormattedNumber(
            thisClass.data.find((d) => d.小分類 === "営業外費用")[thisClass.team]
          ) +
          d.value;

        if (i === 0) return base;
        return (
          base +
          getCumsum(thisClass.data, "税引前当期利益", thisClass.team)[0].value -
          d.value
        );
      }
      this.svg
        .append("g")
        .selectAll("rect")
        .data(getCumsum(this.data, "税引前当期利益", this.team))
        .join("rect")
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (d, i) => this.sy(getY(this, d, i)))
        .attr("width", this.sx.bandwidth())
        .attr("height", 0)
        .attr(
          "value",
          (d) => this.data.find((d_) => getKey(d_) === d.name)[this.team]
        )
        .attr("fill", (d) =>
          d.name === "税引前当期利益-特別利益" ? this.profitColor : this.lossColor
        )
        .attr("opacity", 0.5)
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this))
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100 + 1700)
        .attr("height", (d) => {
          const value = parseFormattedNumber(
            this.data.find((d_) => getKey(d_) === d.name)[this.team]
          );
          return this.sy(0) - this.sy(value);
        });

      this.svg
        .append('g')
        .selectAll('rect')
        .data(getCumsum(this.data, "税引前当期利益", this.team))
        .join('rect')
        .call(this.rectItem.bind(this), 1, 'gray')

      this.svg
        .append("g")
        .selectAll("text")
        .data(getCumsum(this.data, "税引前当期利益", this.team))
        .join("text")
        .call(this.textItem.bind(this), 1)
    }
    drawTaxes() {
      function getY(thisClass, d, i) {
        return (
          d3.max(
            getCumsum(thisClass.data, "売上高", thisClass.team),
            (d) => d.value
          ) -
          d3.max(
            getCumsum(thisClass.data, "売上原価", thisClass.team),
            (d) => d.value
          ) -
          d3.max(
            getCumsum(thisClass.data, "販売費および一般管理費", thisClass.team),
            (d) => d.value
          ) +
          parseFormattedNumber(
            thisClass.data.find((d) => d.小分類 === "営業外収益")[thisClass.team]
          ) -
          parseFormattedNumber(
            thisClass.data.find((d) => d.小分類 === "営業外費用")[thisClass.team]
          ) +
          parseFormattedNumber(
            thisClass.data.find((d) => d.小分類 === "特別利益")[thisClass.team]
          ) -
          parseFormattedNumber(
            thisClass.data.find((d) => d.小分類 === "特別損失")[thisClass.team]
          )
        );
      }
      this.svg
        .append("g")
        .selectAll("rect")
        .data(getCumsum(this.data, "法人税および住民税等", this.team))
        .join("rect")
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (d, i) => this.sy(getY(this, d, i)))
        .attr("width", this.sx.bandwidth())
        .attr("height", 0)
        .attr("fill", this.lossColor)
        .attr("opacity", 0.5)
        .attr(
          "value",
          (d) => this.data.find((d_) => getKey(d_) === d.name)[this.team]
        )
        .on("mouseover", _.partial(this.mouseover, this))
        .on("mousemove", _.partial(this.mousemove, this))
        .on("mouseleave", _.partial(this.mouseleave, this))
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100 + 1800)
        .attr("height", (d, i) => this.sy(0) - this.sy(d.value));

      this.svg
        .append('g')
        .selectAll('rect')
        .data(getCumsum(this.data, "法人税および住民税等", this.team))
        .join('rect')
        .call(this.rectItem.bind(this), 1, this.lossColor)

      this.svg
        .append("g")
        .selectAll("text")
        .data(getCumsum(this.data, "法人税および住民税等", this.team))
        .join("text")
        .call(this.textItem.bind(this), 1)
    }

    drawNetIncomeLine() {
      const income = parseFormattedNumber(
        this.data.find((d) => d.大分類 === "当期純利益")[this.team]
      );

      this.svg
        .append("g")
        .append("line")
        .attr("x1", this.margin.left)
        .attr("x2", this.width - this.margin.right)
        .attr("y1", this.sy(income))
        .attr("y2", this.sy(income))
        .attr("stroke", income < 0 ? "#800" : "#080")
        .attr("stroke-dasharray", "4 4");


      const profit = this.data.find((d) => d.大分類 === "当期純利益")[this.team]
      this.svg
        .append('g')
        .append('text')
        .attr('x', this.sx.range()[1])
        .attr('y', this.sy(profit))
        .attr('dy', -10)
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(`${profit > 0?'純利益':'純損益'}${profit / 100}億円`)

      this.svg
        .append('g')
        .append('rect')
        .attr('x', this.sx.range()[1] - 5)
        .attr('y', this.sy(profit) - 15)
        .attr('width', 45)
        .attr('height', 5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('opacity', 0.3)
        .attr('fill', profit <0 ? this.lossColor : this.profitColor)

    }

    getPLSummary(profit) {
      if (profit < 0) return `当期純損失: ${Math.abs(profit) / 100} (億円）`
      return `当期純利益: ${profit / 100} (億円）`
    }

    drawTitle() {
      const profit = parseFormattedNumber(
        this.data.find((d) => d.大分類 === "当期純利益")[this.team]
      );
      const desc = this.getPLSummary(profit);

      this.svg
        .append("g")
        .append("text")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top + this.titleFontSize)
        .attr("font-size", this.titleFontSize)
        .attr("font-weight", 'bold')
        .attr("fill", profit < 0 ? this.lossColor : profit === 0 ? "#888" : this.profitColor)
        .text(
          profit
            ? `${this.team}: ${desc}`
            : `${this.team}: 3月決算のためデータなし`
        );
    }

    mouseover(thisClass, event, d) {
    //   drawRankingChart(
    //     [...pl_bs2022PlJ1, ...pl_bs2022PlJ2, ...pl_bs2022PlJ3],
    //     `${thisClass.rootSelector} .ranking`,
    //     {
    //       height: 500,
    //       width: 700,
    //       margin: { top: 30, bottom: 20, left: 50, right: 10 },
    //       key: d.name,
    //       j1Teams: j1Teams,
    //       j2Teams: j2Teams,
    //       j3Teams: j3Teams,
    //       selectedTeams: [thisClass.team]
    //     }
    //   );

      thisClass.tooltip.show(event, d);
    }

    mousemove(thisClass, event, d) {
      const value = parseFormattedNumber(d3.select(this).attr("value"));
      thisClass.tooltip.setText(
        `(${thisClass.team})${d.name}: ${value / 100}億円`
      );
      thisClass.tooltip.move(event, d);
    }

    mouseleave(thisClass, event, d) {
      thisClass.tooltip.hide(event, d);
    }

    draw() {
      this.drawAxes();
      console.log(this.config);
      this.drawSales();
      this.drawCosts();
      this.drawSGaA();
      this.drawNonOperatingIncome();
      this.drawSpecialIncome();
      this.drawTaxes();
      this.drawNetIncomeLine();
      this.drawTitle();
    }
  }


export default PLChart;