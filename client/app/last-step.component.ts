import { Component, Input } from "@angular/core";

@Component({
  selector: "last-step",
  templateUrl: "./templates/last-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
    "./styles/last-step.scss",
  ],
})
export class LastStepComponent {
  @Input() public shown: boolean = false;
}
