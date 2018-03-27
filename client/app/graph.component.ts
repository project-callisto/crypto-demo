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
    const margin: number = 50;
    const size: number = 400;

    const svg: any = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", size + margin * 2)
      .attr("height", size + margin * 2)
      .append("g")
      .attr("transform", `translate(${margin},${margin})`);

    const graphBufferFactor: number = 1.25;
    const xMax: number = max(cryptoDecrypted.coords, (datum: ICoord) => datum.x.toJSNumber());
    const yMax: number = max(cryptoDecrypted.coords, (datum: ICoord) => datum.y.toJSNumber());

    const xScale: any = scaleLinear()
      .rangeRound([0, size])
      .domain([0, xMax * graphBufferFactor]);

    const yScale: any = scaleLinear()
      .rangeRound([size, 0])
      .domain([0, yMax * graphBufferFactor]);

    const tickCount: number = 5;

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
      .attr("class", "axis-label x")
      .text("hashedUserID")
      .attr("x", size / 2)
      .attr("y", size)
      .attr("dx", "-3.5em")
      .attr("dy", "2.4em");

    svg.append("g")
      .call(yAxis);

    svg.append("text")
      .attr("class", "axis-label y")
      .text("secretValue")
      .attr("x", 0 - margin)
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

    function lineCoordsAsJSNumbers(coords: ICoord[]): Array<[number, number]> {
      return coords.map((coord: ICoord) => [
        xScale(coord.x.toJSNumber()),
        yScale(coord.y.toJSNumber()),
      ]) as Array<[number, number]>;
    }

    svg.append("path")
      .attr("class", "matched-data-line")
      .attr("d", line()(lineCoordsAsJSNumbers(cryptoDecrypted.coords)));
  }

}

export class SeededGraphComponent extends GraphComponent {

  constructor(
    private seededClientData: ClientDataService = new ClientDataService(),
  ) {
    super(seededClientData);
    seededClientData.submitUserInput("example perp", "example user");
  }

}
