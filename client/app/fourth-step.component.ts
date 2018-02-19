import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "fourth-step",
  templateUrl: "./templates/fourth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FourthStepComponent {
  @Input() public shown: boolean = false;
  @Output() public advanceFourthStep: EventEmitter<string> = new EventEmitter<string>();
}
