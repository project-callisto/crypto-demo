import { AfterContentChecked, AfterViewInit, Component, Input } from "@angular/core";
import * as bigInt from "big-integer";
import { extent } from "d3-array";
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
export class GraphComponent implements AfterViewInit, AfterContentChecked {
  @Input() public decryptedData: IDecryptedData;
  private svg: any;
  private xScale: any;
  private yScale: any;

  public ngAfterViewInit(): void {
    // this.generateGraph();
  }

  public ngAfterContentChecked(): void {
    // if (this.decryptedData) {
    //   this.populateGraph();
    // }
  }

  private generateGraph(): void {
    const margin: number = 30;
    const width: number = 400 - margin * 2;
    const height: number = 400 - margin * 2;

    this.svg = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", width + margin * 2)
      .attr("height", height + margin * 2)
      .append("g")
      .attr("transform", `translate(${margin},${margin})`);

    this.xScale = scaleLinear()
      .range([0, width]);

    this.yScale = scaleLinear()
      .range([height, 0]);

    this.svg.append("g")
      .call(axisBottom(this.xScale))
      .attr("transform", `translate(0,${height})`)
      .append("text")
      .text("X-Value");

    this.svg.append("g")
      .call(axisLeft(this.yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .text("Y-Value");
  }

  private populateGraph(): void {
    this.xScale.domain(extent(
      this.decryptedData.coords,
      (datum: ICoord) => {
        return datum.x.toJSNumber();
      },
    ));

    this.yScale.domain(extent(
      this.decryptedData.coords,
      (datum: ICoord) => {
        return datum.y.toJSNumber();
      },
    ));

    this.svg.selectAll(".dot")
      .data(this.decryptedData.coords)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", (datum: ICoord): number => {
        return this.xScale(datum.x.toJSNumber());
      })
      .attr("cy", (datum: ICoord): number => {
        return this.yScale(datum.y.toJSNumber());
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
