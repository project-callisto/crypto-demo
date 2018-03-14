import { AfterContentChecked, Component, Input } from "@angular/core";
import * as bigInt from "big-integer";
import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { line, Line } from "d3-shape";
import { ICoord, IDecryptedData } from "./services/crypto.service";

const templateSelector: string = "crypto-graph";

@Component({
  selector: `${templateSelector}`,
  template: `<div class="${templateSelector}"></div>`,
  styleUrls: [
    "./styles/base.scss",
    "./styles/graph.scss",
  ],
})
export class GraphComponent implements AfterContentChecked {
  @Input() public decryptedData: IDecryptedData;
  @Input() public coords: ICoord[];
  private graphGenerated: boolean = false;

  public ngAfterContentChecked(): void {
    if (this.decryptedData && this.coords && !this.graphGenerated) {
      this.populateGraph();
      this.graphGenerated = true;
    }
  }

  private populateGraph(): void {
    const margin: number = 50;
    const size: number = 400;

    const svg: any = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", size + margin * 2)
      .attr("height", size + margin * 2)
      .append("g")
      .attr("transform", `translate(${margin},${margin})`);

    const graphBufferFactor: number = 4;

    const xMin: number = min(this.coords, (datum: ICoord) => datum.x.toJSNumber());
    const xMax: number = max(this.coords, (datum: ICoord) => datum.x.toJSNumber());
    const xAxisBuffer: number = (xMax - xMin) / graphBufferFactor;
    let xStart: number = xMin - xAxisBuffer;
    if (xStart < 0) { xStart = 0; }

    const yMin: number = min(this.coords, (datum: ICoord) => datum.y.toJSNumber());
    const yMax: number = max(this.coords, (datum: ICoord) => datum.y.toJSNumber());
    const yAxisBuffer: number = (yMax - yMin) / graphBufferFactor;
    let yStart: number = yMin - yAxisBuffer;
    if (yStart < 0) { yStart = 0; }

    const tickCount: number = 5;

    const xScale: any = scaleLinear()
      .rangeRound([0, size])
      .domain([
        xStart,
        xMax + xAxisBuffer,
      ]);

    const yScale: any = scaleLinear()
      .rangeRound([size, 0])
      .domain([
        yStart,
        yMax + yAxisBuffer,
      ]);

    function applyCustomFormat(axis: any): any {
      return axis
        .ticks(tickCount)
        .tickFormat(format(".2g"));
    }

    const xAxis: any = applyCustomFormat(axisBottom(xScale));
    const yAxis: any = applyCustomFormat(axisLeft(yScale));

    svg.append("g")
      .call(xAxis)
      .attr("transform", `translate(0,${size})`);

    svg.append("text")
      .text("hashedUserID")
      .attr("y", size + margin / 1.5);

    svg.append("g")
      .call(yAxis);

    svg.append("text")
      .text("secretValue")
      .attr("x", - margin)
      .attr("dy", "-.2em");

    svg.selectAll(".dot")
      .data(this.coords)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", (datum: ICoord): number => {
        return xScale(datum.x.toJSNumber());
      })
      .attr("cy", (datum: ICoord): number => {
        return yScale(datum.y.toJSNumber());
      });

    // this.svg.append("path")
    //   .attr("class", "line")
    //   .attr("d", line()
    //     .x((datum: ICoord): number => {
    //       return this.xScale(datum.x.toJSNumber());
    //     })
    //     .y((datum: ICoord): number => {
    //       return this.yScale(datum.y.toJSNumber());
    //     }),
    // );
  }

}
