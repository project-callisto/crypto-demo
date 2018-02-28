import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { GraphComponent } from "./graph.component";

@Component({
  selector: "fifth-step",
  templateUrl: "./templates/fifth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FifthStepComponent {
  @Input() public RID: string;
  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(GraphComponent) public graph: GraphComponent;
}
