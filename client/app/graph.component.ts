import { AfterViewInit, Component, Input } from "@angular/core";
import * as bigInt from "big-integer";
import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
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
export class GraphComponent implements AfterViewInit {
  @Input() public decryptedData: IDecryptedData;
  @Input() public coords: ICoord[];

  public ngAfterViewInit(): void {
    this.populateGraph();
  }

  private populateGraph(): void {
    const margin: number = 30;
    const width: number = 400 - margin * 2;
    const height: number = 400 - margin * 2;

    const svg: any = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", width + margin * 2)
      .attr("height", height + margin * 2)
      .append("g")
      .attr("transform", `translate(${margin},${margin})`);

    const graphBufferFactor: number = 4;

    const xMin: number = min(this.coords, (datum: ICoord) => datum.x.toJSNumber());
    const xMax: number = max(this.coords, (datum: ICoord) => datum.x.toJSNumber());
    const xAxisBuffer: number = (xMax - xMin) / graphBufferFactor;

    const yMin: number = min(this.coords, (datum: ICoord) => datum.y.toJSNumber());
    const yMax: number = max(this.coords, (datum: ICoord) => datum.y.toJSNumber());
    const yAxisBuffer: number = (yMax - yMin) / graphBufferFactor;

    const xScale: any = scaleLinear()
      .range([0, width])
      .domain([
        xMin - xAxisBuffer,
        xMax + xAxisBuffer,
      ]);

    const yScale: any = scaleLinear()
      .range([height, 0])
      .domain([
        yMin - yAxisBuffer,
        yMax + yAxisBuffer,
      ]);

    svg.append("g")
      .call(axisBottom(xScale))
      .attr("transform", `translate(0,${height})`)
      .append("text")
      .text("X-Value");

    svg.append("g")
      .call(axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .text("Y-Value");

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
