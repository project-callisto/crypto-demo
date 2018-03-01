import { Component, Input, OnInit } from "@angular/core";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { DecryptedData } from "./services/crypto.service";

const templateSelector: string = "crypto-graph";

@Component({
  selector: `${templateSelector}`,
  template: `<div class="${templateSelector}"></div>`,
  styleUrls: [
    "./styles/graph.scss",
  ],
})
export class GraphComponent implements OnInit {
  @Input() public decryptedData: DecryptedData;

  public ngOnInit(): void {
    this.generateGraph();
  }

  private generateGraph(): void {
    const svg = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .append("g")
      .attr("width", "100%")
      .attr("height", "100%");

    svg.append("g")
      .call(axisBottom(scaleLinear()))
      .append("text")
      .text("X-Value");

    svg.append("g")
      .call(axisLeft(scaleLinear()))
      .append("text")
      .text("Y-Value");

    const circle = svg.selectAll(".dot")
      .data([])
      .enter()
      .append("circle");

    circle
      .attr("class", "dot")
      .attr("r", 3.5);
  }

}
