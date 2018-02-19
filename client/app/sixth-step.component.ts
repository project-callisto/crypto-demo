import { Component, Input } from "@angular/core";

@Component({
  selector: "sixth-step",
  templateUrl: "./templates/sixth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class SixthStepComponent {
  @Input() public shown: boolean = false;
}
