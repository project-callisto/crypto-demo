import { Component } from "@angular/core";
import * as bigInt from "big-integer";
import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { line, Line } from "d3-shape";
import { ClientDataService } from "./services/client-data.service";
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
export class GraphComponent {

  private margin: number = 50;
  private size: number = 250;
  private graphBufferFactor: number = 1.25;

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoDecrypted$.subscribe(
      (cryptoDecrypted: IDecryptedData) => {
        select(`.${templateSelector} svg`).remove();
        this.populateGraph(cryptoDecrypted, clientData.cryptoCoords);
      },
    );
  }

  private populateGraph(decryptedData: IDecryptedData, coords: ICoord[]): void {

    const svg: any = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", this.size + this.margin * 2)
      .attr("height", this.size + this.margin * 2)
      .append("g")
      .attr("transform", `translate(${this.margin},${this.margin})`);

    const graphXMax: number = this.xDomainMax(coords);
    const graphYMax: number = this.yDomainMax(coords);

    const xScale: any = scaleLinear()
      .rangeRound([0, this.size])
      .domain([0, graphXMax]);

    const yScale: any = scaleLinear()
      .rangeRound([this.size, 0])
      .domain([decryptedData.intercept.toJSNumber(), graphYMax]);

    svg.append("g")
      .call(this.applyCustomFormat(axisBottom(xScale)))
      .attr("transform", `translate(0,${this.size})`);

    svg.append("text")
      .attr("class", "axis-label x")
      .text("U")
      .attr("x", this.size / 2)
      .attr("y", this.size)
      .attr("dy", "2.4em");

    svg.append("g")
      .call(this.applyCustomFormat(axisLeft(yScale)));

    svg.append("text")
      .attr("class", "axis-label y")
      .text("s")
      .attr("x", 0 - this.margin / 2)
      .attr("dy", "-.4em");

    svg.selectAll(".dot")
      .data(coords)
      .enter()
      .append("circle")
      .attr("class", "dot data-point")
      .attr("r", 3.5)
      .attr("cx", (coord: ICoord): number => {
        return xScale(coord.x.toJSNumber());
      })
      .attr("cy", (coord: ICoord): number => {
        return yScale(coord.y.toJSNumber());
      });

    svg.append("path")
      .attr("class", "matched-data-line")
      .attr("d", line()(this.lineCoordsAsJSNumbers(
        decryptedData, coords, graphXMax, graphYMax, xScale, yScale)));
  }

  private xDomainMax(coords: ICoord[]): number {
    return max(coords, (datum: ICoord) => datum.x.toJSNumber()) * this.graphBufferFactor;
  }

  private yDomainMax(coords: ICoord[]): number {
    return max(coords, (datum: ICoord) => datum.y.toJSNumber()) * this.graphBufferFactor;
  }

  private applyCustomFormat(axis: any): any {
    return axis
      .ticks(5)
      .tickFormat(format(".1g"));
  }

  private lineCoordsAsJSNumbers(
    decryptedData: IDecryptedData, coords: ICoord[],
    graphXMax: number, graphYMax: number,
    xScale: any, yScale: any,
  ): Array<[number, number]> {

    const slope: number = decryptedData.slope.toJSNumber();
    const intercept: number = decryptedData.intercept.toJSNumber();

    const lineStart: number[] = [0, yScale(intercept)];
    let lineEnd: number[];

    const lineYMax: number = slope * graphXMax + intercept;
    const lineXMax: number = (graphYMax - intercept) / slope;

    if (lineYMax <= graphYMax) {
      lineEnd = [
        xScale((lineYMax - intercept) / slope),
        yScale(lineYMax),
      ];
    } else {
      lineEnd = [
        xScale(lineXMax),
        yScale(slope * lineXMax + intercept),
      ];
    }
    return [lineStart, lineEnd] as Array<[number, number]>;
  }

}
