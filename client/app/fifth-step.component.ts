import { Component, EventEmitter, Input, Output } from "@angular/core";

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
}
