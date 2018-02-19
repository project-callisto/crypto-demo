import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "third-step",
  templateUrl: "./templates/third-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class ThirdStepComponent {
  @Input() public shown: boolean = false;
  @Output() public advanceThirdStep: EventEmitter<string> = new EventEmitter<string>();
}
