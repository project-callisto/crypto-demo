import { Component, Input, OnInit } from "@angular/core";
import * as d3 from "d3";
import { DecryptedData } from "./services/crypto.service";

const templateSelector = "crypto-graph";

@Component({
  selector: `${templateSelector}`,
  template: `<div class="${templateSelector}"></div>`,
  styleUrls: [
    "./styles/graph.scss",
  ],
})
export class GraphComponent implements OnInit {
  @Input() public decryptedData: DecryptedData;

  public ngOnInit() {
    this.generateGraph();
  }

  private generateGraph() {
    const x = d3.scaleLinear();
    const y = d3.scaleLinear();

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y);

    const svg = d3.select(`.${templateSelector}`).append("svg")
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
      .data([])
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

}
