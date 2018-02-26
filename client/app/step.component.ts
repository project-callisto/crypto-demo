import { Component, ViewChild } from "@angular/core";
import { FifthStepComponent } from "./fifth-step.component";
import { FirstStepComponent } from "./first-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { SecondStepComponent } from "./second-step.component";
import { CryptoService, EncryptedData, PlainTextData } from "./services/crypto.service";
import { SixthStepComponent } from "./sixth-step.component";
import { SummaryStepComponent } from "./summary-step.component";
import { ThirdStepComponent } from "./third-step.component";

import * as $ from "jquery";

@Component({
  selector: "step-root",
  template: `
    <first-step
      (advanceStep)="advanceFirstStep($event)"
    ></first-step>
    <second-step
      (advanceStep)="advanceSecondStep($event)"
    ></second-step>
    <third-step
      (advanceStep)="advanceThirdStep($event)"
    ></third-step>
    <fourth-step
      (advanceStep)="advanceFourthStep($event)"
    ></fourth-step>
    <fifth-step
      (advanceStep)="advanceFifthStep($event)"
    ></fifth-step>
    <sixth-step>
    (advanceStep)="advanceSixthStep($event)"
    </sixth-step>
  `,
  providers: [
    CryptoService,
  ],
})
export class StepComponent {
  // public encryptedDataArr: EncryptedData[] = [];
  private perpInput: string;
  private encryptedData: EncryptedData;
  private plainTextData: PlainTextData;
  @ViewChild(FirstStepComponent) private firstStep: FirstStepComponent;
  @ViewChild(SecondStepComponent) private secondStep: SecondStepComponent;
  @ViewChild(ThirdStepComponent) private thirdStep: ThirdStepComponent;
  @ViewChild(FourthStepComponent) private fourthStep: FourthStepComponent;
  @ViewChild(FifthStepComponent) private fifthStep: FifthStepComponent;
  @ViewChild(SixthStepComponent) private sixthStep: SixthStepComponent;
  @ViewChild(SummaryStepComponent) private summaryStep: SummaryStepComponent;

  constructor(
    public crypto: CryptoService,
  ) { }

 // input: perpname, username
 // display: kRecord
 private advanceFirstStep(perpInput: string): void {
  this.perpInput = perpInput;

  this.crypto.createDataSubmission(perpInput).then(
    (plainText: PlainTextData) => {
      const encryptedData: EncryptedData = this.crypto.encryptData(plainText);

      this.crypto.postData(encryptedData);

      this.plainTextData = plainText;
      this.secondStep.plainTextData = plainText;
      this.thirdStep.plainTextData = plainText;
      this.fourthStep.encryptedData = encryptedData;
      this.encryptedData = encryptedData;

      console.log('plainText', plainText, 'encryptedData', encryptedData);
      this.secondStep.shown = true;
      this.scrollTo("second-step");

      // TODO: add these
      // this.firstStep.recordKey = plainText.recordKey

      // TODO: remove these
      this.firstStep.recordKey = plainText.recordKey;
    },
  );
}

  // display RID
  private advanceSecondStep(): void {
    // this.secondStep.encryptedData = encryptedData;
        this.thirdStep.shown = true;
        this.scrollTo("third-step");

  }

  // display PRG(RID), m, kID, x
  // display unique y = mx + RID
  private advanceThirdStep(): void {
  
    this.fourthStep.shown = true;
    this.scrollTo("fourth-step");
  }

//   Display: 
// H(RID)
// EncPUB(KOC, x)
// EncPUB(KOC, y)
// EncGCM(Krecord, record) 
// EncGCM(KID, Krecord)  
  private advanceFourthStep(): void {

    this.crypto.createDataSubmission(this.perpInput).then(
      (plainText: PlainTextData) => {
        const encryptedData: EncryptedData = this.crypto.encryptData(plainText);
        this.crypto.postData(encryptedData);
        const decryptedData = this.crypto.decryptData(); 
        this.fifthStep.RID = decryptedData.strRid;
      },
    );

    this.fifthStep.shown = true;
    this.scrollTo("fifth-step");
  }

  // simulate data, display chart, display decrypted RID
  private advanceFifthStep(): void {
    this.sixthStep.shown = true;
    this.scrollTo("sixth-step");  
  }

  private advanceSixthStep(): void {
    this.summaryStep.shown = true;
    this.scrollTo('seventh-step');
  }

  private scrollTo(element: string): void {
    $("html, body").animate({
      scrollTop: $(element).offset().top,
    }, 400);
  }
}
