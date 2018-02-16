import { Component, ViewChild } from "@angular/core";
import { FifthStepComponent } from "./fifth-step.component";
import { FirstStepComponent } from "./first-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { SecondStepComponent } from "./second-step.component";
import { CryptoService, EncryptedData } from "./services/crypto.service";
import { SixthStepComponent } from "./sixth-step.component";
import { ThirdStepComponent } from "./third-step.component";

import * as $ from "jquery";

@Component({
  selector: "step-root",
  template: `
    <first-step
      (onPerpSubmit)="onPerpSubmit($event)"
    ></first-step>
    <second-step></second-step>
    <third-step></third-step>
    <fourth-step></fourth-step>
    <fifth-step></fifth-step>
    <sixth-step></sixth-step>
  `,
  providers: [
    CryptoService,
  ],
})
export class StepComponent {
  public encryptedDataArr: EncryptedData[] = [];
  @ViewChild(FirstStepComponent) private firstStep: FirstStepComponent;
  @ViewChild(SecondStepComponent) private secondStep: SecondStepComponent;
  @ViewChild(ThirdStepComponent) private thirdStep: ThirdStepComponent;
  @ViewChild(FourthStepComponent) private fourthStep: FourthStepComponent;
  @ViewChild(FifthStepComponent) private fifthStep: FifthStepComponent;
  @ViewChild(SixthStepComponent) private sixthStep: SixthStepComponent;

  constructor(
    private crypto: CryptoService,
  ) { }

  public onPerpSubmit(perpInput: string): void {
    const encryptedData: EncryptedData = this.crypto.encryptData(perpInput);
    this.encryptedDataArr.push(encryptedData);
    this.firstStep.RID = encryptedData.rid;
    this.secondStep.encryptedData = encryptedData;
    this.secondStep.shown = true;
    this.scrollTo("second-step");
  }

  private scrollTo(element: string): void {
    $("html, body").animate({
      scrollTop: $(element).offset().top,
    }, 400);
  }
}
