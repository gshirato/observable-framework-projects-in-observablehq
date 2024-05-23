import * as d3 from "npm:d3";
import _ from "npm:lodash";
import GeneralChart from "../../chart/components/GeneralChart.js";
import { parseFormattedNumber, getKey, getCumsum } from "./utils.js";
class PLChart extends GeneralChart {
    constructor(data, selector, config) {
      super(data, selector, config);
      this.team = config["team"];
      this.plKeys = config["plKeys"];
      this.titleFontSize = config["titleFontSize"] || 25;
      this.detail = config["detail"];
      this.otherLeagues = config["otherLeagues"];
      this.profitColor = 'green';
      this.lossColor = 'red';
      this.itemTextSize = 10
      this.yExtent = this.getExtent();
      this.profit = parseFormattedNumber(this.data.find((d) => d.大分類 === "当期純利益")[this.team])
      this.minCumsum = d3.min(this.data.map(d=>parseFormattedNumber(d[this.team])))
      this.setAxes();
      this.writeHtml();
    }

    getExtent() {
      const cumsum = this.data.map(d=>parseFormattedNumber(d[this.team]));
      if (d3.max(cumsum.map(d=>Math.abs(d))) > 5000) return [-11000, 11000];
      if (d3.max(cumsum.map(d=>Math.abs(d))) > 3000) return [-5000, 5000];
      if (d3.max(cumsum.map(d=>Math.abs(d))) > 1500) return [-3000, 3000];
      if (d3.max(cumsum.map(d=>Math.abs(d))) > 1000) return [-1500, 1500];
      return [-1000, 1000];
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
        .attr("y", this.sy(d3.min([0, this.minCumsum])))
        .text(d=>this.writeName(d));
    }

    rectItem(selection, j, color) {
      if (!this.detail) return;
      const yOffset = 2
      selection
        .attr("x", (d) => this.sx(d.name))
        .attr("y", (_, i) => i%2===j?this.sy(d3.min([0, this.minCumsum])) + this.itemTextSize + yOffset: this.sy(d3.min([0, this.minCumsum]))+ yOffset)
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


      this.svg
        .append('g')
        .append('text')
        .attr('x', this.sx.range()[1])
        .attr('y', this.sy(d3.max([this.profit, 0])))
        .attr('dy', -10)
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(`${this.profit < 0?'純損益':'純利益'}${this.profit / 100}億円`)

      this.svg
        .append('g')
        .append('rect')
        .attr('x', this.sx.range()[1] - 5)
        .attr('y', this.sy(d3.max([0, this.profit])) - 15)
        .attr('width', 45)
        .attr('height', 5)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('opacity', 0.3)
        .attr('fill', this.profit <0 ? this.lossColor : this.profitColor)

    }

    getPLSummary(profit) {
      if (profit < 0) return `当期純損失: ${Math.abs(profit) / 100} (億円）`
      return `当期純利益: ${profit / 100} (億円）`
    }

    splitByCategory() {
      function draw(sel, i) {
        sel
        .append('g')
        .append('line')
        .attr('x1', this.sx(this.plKeys[i]))
        .attr('x2', this.sx(this.plKeys[i]))
        .attr('y1', this.sy.range()[0])
        .attr('y2', this.sy.range()[1])
        .attr('stroke-dasharray', '4 4')
        .attr('stroke', '#ccc')
      }
      function write(sel, text, i, j) {
        sel
          .append('g')
          .append('text')
          .attr('x', this.sx(this.plKeys[parseInt((i + j) / 2)]))
          .attr('y', this.sy.range()[0])
          .attr('dx', i===j?this.sx.bandwidth() / 2:0)
          .attr('text-anchor', 'end')
          .attr('font-size', 10)
          .attr('font-weight', 'bold')
          .attr('fill', '#777')
          .attr("writing-mode", "tb")
          .text(text)
      }

      this.svg.call(draw.bind(this), 7)
      this.svg.call(draw.bind(this), 14)
      this.svg.call(draw.bind(this), 15)
      this.svg.call(draw.bind(this), 17)
      this.svg.call(draw.bind(this), 19)

      this.svg.call(write.bind(this), '売上高', 0, 7)
      this.svg.call(write.bind(this), '粗利益', 7, 15)
      this.svg.call(write.bind(this), '営業利益', 14, 14)
      this.svg.call(write.bind(this), '経常利益', 15, 17)
      this.svg.call(write.bind(this), '税引前純利益', 17, 19)
      this.svg.call(write.bind(this), '純利益', 19, 19)

    }

    drawTitle() {
      const desc = this.getPLSummary(this.profit);

      this.svg
        .append("g")
        .append("text")
        .attr("x", this.margin.left)
        .attr("y", this.margin.top + this.titleFontSize)
        .attr("font-size", this.titleFontSize)
        .attr("font-weight", 'bold')
        .attr("fill", this.profit < 0 ? this.lossColor : this.profit === 0 ? "#888" : this.profitColor)
        .text(
          this.profit
            ? `${this.team}: ${desc}`
            : `${this.team}: 3月決算のためデータなし`
        );
    }

    mouseover(thisClass, event, d) {
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
      this.splitByCategory();
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