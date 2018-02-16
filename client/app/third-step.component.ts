import { Component, Input } from "@angular/core";

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
}
