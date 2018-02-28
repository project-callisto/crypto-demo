import { Component, Input } from "@angular/core";

@Component({
  selector: "crypto-graph",
  template: "./templates/fifth-step.component.html",
  styleUrls: [
    "./styles/graph.scss",
  ],
})
export class GraphComponent {
  @Input() public RID: string;
}
