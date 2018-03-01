import { Component, Input, OnInit } from "@angular/core";
import * as d3 from "d3";
import { DecryptedData } from "./services/crypto.service";

const templateSelector: string = "crypto-graph";

interface IAxes {
  readonly x: d3.ScaleLinear<number, number>;
  readonly y: d3.ScaleLinear<number, number>;
}

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
    const svg = d3.select(`.${templateSelector}`).append("svg")
      .append("g");

    svg.append("g")
      .call(d3.axisBottom(d3.scaleLinear()))
      .append("text")
      .text("X-Value");

    svg.append("g")
      .call(d3.axisLeft(d3.scaleLinear()))
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
