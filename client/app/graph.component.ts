import { Component } from "@angular/core";
import * as bigInt from "big-integer";
import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { line, Line } from "d3-shape";
import { ClientDataService } from "./services/client-data.service";
import { ICoord, IDecryptedData, PRIME } from "./services/crypto.service";

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
  private size: number = 400;
  private tickCount: number = 5;

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoDecrypted$.subscribe(
      (cryptoDecrypted: IDecryptedData) => {
        select(`.${templateSelector} svg`).remove();
        this.populateGraph(cryptoDecrypted);
      },
    );
  }

  private populateGraph(cryptoDecrypted: IDecryptedData): void {

    const svg: any = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", this.size + this.margin * 2)
      .attr("height", this.size + this.margin * 2)
      .append("g")
      .attr("transform", `translate(${this.margin},${this.margin})`);

    const graphXMax: bigInt.BigInteger = this.xDomainMax(cryptoDecrypted.coords);
    const graphYMax: bigInt.BigInteger = this.yDomainMax(cryptoDecrypted.coords);

    const xScale: any = scaleLinear()
      .rangeRound([0, this.size])
      .domain([0, graphXMax]);

    const yScale: any = scaleLinear()
      .rangeRound([this.size, 0])
      .domain([0, graphYMax]);

    svg.append("g")
      .call(this.applyCustomFormat(axisBottom(xScale)))
      .attr("transform", `translate(0,${this.size})`);

    svg.append("text")
      .attr("class", "axis-label x")
      .text("hashedUserID")
      .attr("x", this.size / 2)
      .attr("y", this.size)
      .attr("dx", "-3.5em")
      .attr("dy", "2.4em");

    svg.append("g")
      .call(this.applyCustomFormat(axisLeft(yScale)));

    svg.append("text")
      .attr("class", "axis-label y")
      .text("secretValue")
      .attr("x", 0 - this.margin)
      .attr("dy", "-.4em");

    svg.selectAll(".dot")
      .data(cryptoDecrypted.coords)
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
        cryptoDecrypted, graphXMax, graphYMax, xScale, yScale)));
  }

  private xDomainMax(coords: ICoord[]): bigInt.BigInteger {
    let thisMax: bigInt.BigInteger = bigInt.zero;
    for (const i in coords) {
      if (coords[i].x.greater(thisMax)) {
        thisMax = coords[i].x;
      }
    }
    return thisMax;
  }

  private yDomainMax(coords: ICoord[]): bigInt.BigInteger {
    let thisMax: bigInt.BigInteger = bigInt.zero;
    for (const i in coords) {
      if (coords[i].y.greater(thisMax)) {
        thisMax = coords[i].y;
      }
    }
    return thisMax;
  }

  private applyCustomFormat(axis: any): any {
    return axis
      .ticks(this.tickCount)
      .tickFormat(format(".2g"));
  }

  private lineCoordsAsJSNumbers(
    cryptoDecrypted: IDecryptedData,
    graphXMax: bigInt.BigInteger,
    graphYMax: bigInt.BigInteger,
    xScale: any,
    yScale: any,
  ): Array<[number, number]> {

    const lineStart: number[] = [0, yScale(cryptoDecrypted.intercept.toJSNumber())];
    let lineEnd: number[];

    const lineYMax: bigInt.BigInteger = cryptoDecrypted.slope.multiply(graphXMax).plus(cryptoDecrypted.intercept);
    const lineXMax: bigInt.BigInteger = graphYMax.minus(cryptoDecrypted.intercept).divide(cryptoDecrypted.slope);

    console.log("y intercept", cryptoDecrypted.intercept.toJSNumber());
    console.log("PRIME", PRIME.toJSNumber());
    console.log("slope", cryptoDecrypted.slope.toJSNumber());
    console.log("lineYMax", lineYMax.toJSNumber());
    console.log("lineXMax", lineXMax.toJSNumber());

    if (lineYMax.lesserOrEquals(graphYMax)) {
      lineEnd = [
        xScale(lineYMax.minus(cryptoDecrypted.intercept).divide(cryptoDecrypted.slope).toJSNumber()),
        yScale(lineYMax.toJSNumber()),
      ];
      console.log("y clipped position", lineEnd[0]);
    } else {
      lineEnd = [
        xScale(lineXMax.toJSNumber()),
        yScale(cryptoDecrypted.slope.multiply(lineXMax).plus(cryptoDecrypted.intercept).toJSNumber()),
      ];
      console.log("x clipped position", lineEnd[1]);
    }
    console.log([lineStart, lineEnd]);
    return [lineStart, lineEnd] as Array<[number, number]>;
  }

}
