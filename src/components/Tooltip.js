import * as d3 from "npm:d3";
class Tooltip {
    constructor(
      opacity = 0.8,
      backgroundColor = "white",
      border = "solid",
      borderWidth = "1px",
      borderRadius = "5px",
      padding = "10px"
    ) {
      this.opacity = opacity;
      this.svg = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", opacity)
        .style("position", "absolute")
        .style("background-color", backgroundColor)
        .style("border", border)
        .style("border-width", borderWidth)
        .style("border-radius", borderRadius)
        .style("padding", padding);
    }

    setStyle(name, value) {
      this.svg.style(name, value);
    }

    setText(text) {
      this.text = text;
    }

    show(event, d) {
      this.svg.style("opacity", 0.8).style("display", "block");
    }
    move(event, d) {
      this.svg
        .html(this.text)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    }
    hide(event, d) {
      this.svg.style("opacity", 0);
      this.svg.style("display", "none");
    }
  }

export default Tooltip;