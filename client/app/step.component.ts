import { Component, ViewChild } from "@angular/core";
import { FirstStepComponent } from "./first-step.component";
import { SecondStepComponent } from "./second-step.component";
import { CryptoService, EncryptedData } from "./services/crypto.service";

@Component({
  selector: "step-root",
  template: `
    <first-step
      (onPerpSubmit)="onPerpSubmit($event)"
    ></first-step>
    <second-step></second-step>
  `,
  providers: [
    CryptoService,
  ],
})
export class StepComponent {
  public encryptedDataArr: EncryptedData[] = [];
  @ViewChild(FirstStepComponent) private firstStep: FirstStepComponent;
  @ViewChild(SecondStepComponent) private secondStep: SecondStepComponent;

  constructor(
    private crypto: CryptoService,
  ) { }

  public onPerpSubmit(perpInput: string): void {
    const encryptedData: EncryptedData = this.crypto.encryptData(perpInput);
    this.encryptedDataArr.push(encryptedData);
    this.firstStep.RID = encryptedData.rid;
    this.secondStep.encryptedData = encryptedData;
    this.secondStep.shown = true;
  }
}
