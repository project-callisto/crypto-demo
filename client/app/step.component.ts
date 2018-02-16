import { Component, ViewChild } from "@angular/core";
import { FirstStepComponent } from "./first-step.component";
import { SecondStepComponent } from "./second-step.component";

@Component({
  selector: "step-root",
  template: `
    <first-step></first-step>
    <second-step></second-step>
  `,
})
export class StepComponent {
  @ViewChild(FirstStepComponent) private firstStep: FirstStepComponent;
  @ViewChild(SecondStepComponent) private secondStep: SecondStepComponent;
  public encryptedDataArr: object[] = [];
  public RID: string = "[[ RID ]]";
}
