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
    const x: d3.ScaleLinear<number, number> = d3.scaleLinear();
    const y: d3.ScaleLinear<number, number> = d3.scaleLinear();

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
      .attr("cx", (d) => {
        return x(d.x);
      })
      .attr("cy", (d) => {
        return y(d.y);
      });
  }

}
