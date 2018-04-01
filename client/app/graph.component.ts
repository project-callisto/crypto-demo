import { AfterViewInit, Component } from "@angular/core";
import { max, min } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { scaleLinear } from "d3-scale";
import { select, Selection } from "d3-selection";
import { line, Line } from "d3-shape";
import { ClientDataService, ICoordGraph } from "./services/client-data.service";
import { IDecryptedData } from "./services/crypto.service";

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

  private margin: number = 50;
  private size: number = 250;
  private graphBufferFactor: number = 1.25;

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoEvent$.subscribe(() => {
      this.updateGraphData(this);
    });
  }

  public ngAfterViewInit(): void {
    this.updateGraphData(this);
  }

  private updateGraphData(component: GraphComponent): void {
    if (component.clientData.cryptoDecrypted) {
      select(`.${templateSelector} svg`).remove();
      component.populateGraph(
        component.clientData.cryptoDecrypted,
        component.clientData.cryptoCoords,
      );
    }
  }

  private populateGraph(decryptedData: IDecryptedData, coords: ICoordGraph[]): void {

    const svg: any = select(`.${templateSelector}`)
      .append("svg")
      .attr("width", this.size + this.margin * 2)
      .attr("height", this.size + this.margin * 2)
      .append("g")
      .attr("transform", `translate(${this.margin},${this.margin})`);

    const graphXMax: number = max(coords, (datum: ICoordGraph) => datum.x) * this.graphBufferFactor;
    const graphYMax: number = max(coords, (datum: ICoordGraph) => datum.y) * this.graphBufferFactor;

    const xScale: any = scaleLinear()
      .rangeRound([0, this.size])
      .domain([0, graphXMax]);

    const yScale: any = scaleLinear()
      .rangeRound([this.size, 0])
      .domain([decryptedData.intercept, graphYMax]);

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
      .attr("cx", (coord: ICoordGraph) => xScale(coord.x))
      .attr("cy", (coord: ICoordGraph) => yScale(coord.y));

    svg.append("path")
      .attr("class", "matched-data-line")
      .attr("d", line()(this.lineCoordsAsJSNumbers(
        decryptedData, coords, graphXMax, graphYMax, xScale, yScale)));
  }

  private applyCustomFormat(axis: any): any {
    return axis
      .ticks(5)
      .tickFormat(format(".1g"));
  }

  private lineCoordsAsJSNumbers(
    decryptedData: IDecryptedData, coords: ICoordGraph[],
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
