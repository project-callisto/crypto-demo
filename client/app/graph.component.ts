import { Component, Input, OnInit } from "@angular/core";
import { d3 } from "d3";

const templateTag = "d3-graph-hook";

@Component({
  selector: "crypto-graph",
  template: `<${templateTag}></${templateTag}>`,
  styleUrls: [
    "./styles/graph.scss",
  ],
})
export class GraphComponent implements OnInit {
  @Input() public RID: string;

  public generateGraph() {
    const x = d3.scaleLinear();
    const y = d3.scaleLinear();

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    let svg = d3.select(templateTag).append("svg")
      .append("g");

    svg.append("g")
      .call(xAxis)
      .append("text")
      .text("X-Value");

    svg.append("g")
      .call(yAxis)
      .append("text")
      .text("Y-Value");

    svg.selectAll(".dot")
      .data({})
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) {
        return x(d.x);
      })
      .attr("cy", function(d) {
        return y(d.y);
      });
  }

  public ngOnInit() {
    this.generateGraph();
  }
}
