import { Component, Input } from "@angular/core";

@Component({
  selector: "summary-step",
  templateUrl: "./templates/summary-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class SummaryStepComponent {
  @Input() public shown: boolean = false;
}
