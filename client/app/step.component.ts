import { Component, ViewChild } from "@angular/core";
import { FifthStepComponent } from "./fifth-step.component";
import { FirstStepComponent } from "./first-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { IntroComponent } from "./intro.component";
import { LastStepComponent } from "./last-step.component";
import { SecondStepComponent } from "./second-step.component";
import { SixthStepComponent } from "./sixth-step.component";
import { ThirdStepComponent } from "./third-step.component";

import * as $ from "jquery";

@Component({
  selector: "step-root",
  template: `
    <intro-root
      (advanceStep)="advanceIntro()"
    ></intro-root>
    <first-step
      (advanceStep)="advanceFirstStep()"
    ></first-step>
    <second-step
      (advanceStep)="advanceSecondStep()"
    ></second-step>
    <third-step
      (advanceStep)="advanceThirdStep()"
    ></third-step>
    <fourth-step
      (advanceStep)="advanceFourthStep()"
    ></fourth-step>
    <fifth-step
      (advanceStep)="advanceFifthStep()"
    ></fifth-step>
    <sixth-step
      (advanceStep)="advanceSixthStep()"
    ></sixth-step>
    <last-step></last-step>
    `,
})
export class StepComponent {
  @ViewChild(IntroComponent) private introComp: IntroComponent;
  @ViewChild(FirstStepComponent) private firstStep: FirstStepComponent;
  @ViewChild(SecondStepComponent) private secondStep: SecondStepComponent;
  @ViewChild(ThirdStepComponent) private thirdStep: ThirdStepComponent;
  @ViewChild(FourthStepComponent) private fourthStep: FourthStepComponent;
  @ViewChild(FifthStepComponent) private fifthStep: FifthStepComponent;
  @ViewChild(SixthStepComponent) private sixthStep: SixthStepComponent;
  @ViewChild(LastStepComponent) private lastStep: LastStepComponent;

  public advanceIntro(): void {
    this.firstStep.shown = true;
    this.scrollTo("first-step");
  }

  public advanceFirstStep(userInput: IUserInput): void {
    this.secondStep.shown = true;
    this.scrollTo("second-step");
  }

  public advanceSecondStep(): void {
    this.thirdStep.shown = true;
    this.scrollTo("third-step");
  }

  public advanceThirdStep(): void {
    this.fourthStep.shown = true;
    this.scrollTo("fourth-step");
  }

  public advanceFourthStep(): void {
    this.fifthStep.shown = true;
    this.scrollTo("fifth-step");
  }

  public advanceFifthStep(): void {
    this.sixthStep.shown = true;
    this.scrollTo("sixth-step");
  }

  public advanceSixthStep(): void {
    this.lastStep.shown = true;
    this.scrollTo("last-step");
  }

  private scrollTo(element: string): void {
    $("html, body").animate({
      scrollTop: $(element).offset().top,
    }, 400);
  }

}
