import { Component, Input } from "@angular/core";

@Component({
  selector: "step-nav",
  templateUrl: "./templates/nav.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/nav.scss",
  ],
})
export class NavComponent {
  @Input() public sectionStep: number = 0;
  private maxSteps: number = 6;
  private Array: ArrayConstructor = Array;

  private stepToID(key: number): string {
    return [
      "first-step",
      "second-step",
      "third-step",
      "fourth-step",
      "fifth-step",
      "sixth-step",
    ][key];
  }
}
