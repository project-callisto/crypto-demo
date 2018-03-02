import { AfterViewInit, Component, Input, OnChanges } from "@angular/core";
import * as bigInt from "big-integer";
import { axisBottom, axisLeft } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { DecryptedData, ICoordinate } from "./services/crypto.service";

const templateSelector: string = "crypto-graph";

@Component({
  selector: `${templateSelector}`,
  template: `<div class="${templateSelector}"></div>`,
  styleUrls: [
    "./styles/graph.scss",
  ],
})
export class GraphComponent implements AfterViewInit, OnChanges {
  @Input() public decryptedData: DecryptedData;
  private svg: any;

  public ngAfterViewInit(): void {
    this.generateGraph();
  }

  public ngOnChanges(): void {
    this.populateGraph();
  }

  private generateGraph(): void {
    const width: number = 400;
    const height: number = 400;

    this.svg = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    this.svg.append("g")
      .call(axisBottom(
        scaleLinear()
          .range([0, width]),
      ))
      .append("text")
      .attr("class", "label-x")
      .text("X-Value");

    this.svg.append("g")
      .call(axisLeft(
        scaleLinear()
          .range([0, height]),
      ))
      .append("text")
      .attr("class", "label-y")
      .text("Y-Value");
  }

  private populateGraph(): void {
    this.svg.selectAll(".dot")
      .data([
        this.decryptedData.coordA,
        this.decryptedData.coordB,
      ])
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", (datum: ICoordinate): number => {
        return datum.x.toJSNumber();
      })
      .attr("cy", (datum: ICoordinate): number => {
        return datum.y.toJSNumber();
      });
  }

}
