import { Component, ViewChild } from "@angular/core";
import { FifthStepComponent } from "./fifth-step.component";
import { FirstStepComponent } from "./first-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { SecondStepComponent } from "./second-step.component";
import { CryptoService, EncryptedData, PlainTextData } from "./services/crypto.service";
import { SixthStepComponent } from "./sixth-step.component";
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
    <sixth-step></sixth-step>
  `,
  providers: [
    CryptoService,
  ],
})
export class StepComponent {
  // public encryptedDataArr: EncryptedData[] = [];
  private perpInput: string;
  @ViewChild(FirstStepComponent) private firstStep: FirstStepComponent;
  @ViewChild(SecondStepComponent) private secondStep: SecondStepComponent;
  @ViewChild(ThirdStepComponent) private thirdStep: ThirdStepComponent;
  @ViewChild(FourthStepComponent) private fourthStep: FourthStepComponent;
  @ViewChild(FifthStepComponent) private fifthStep: FifthStepComponent;
  @ViewChild(SixthStepComponent) private sixthStep: SixthStepComponent;

  constructor(
    public crypto: CryptoService,
  ) { }

  private postData(encryptedData: EncryptedData): void {
    $.post('/postData', encryptedData, (data, status) => {
      if (status !== 'success') {
        console.log('Error posting encrypted data to server');
        return;
      } 
    })
  }


  private advanceFirstStep(perpInput: string): void {
    this.perpInput = perpInput;

    this.crypto.createDataSubmission(perpInput).then(
      (plainText: PlainTextData) => {
        const encryptedData: EncryptedData = this.crypto.encryptData(plainText);

        this.postData(encryptedData);

        // this.encryptedDataArr.push(encryptedData);
        this.firstStep.RID = encryptedData.hashedRid;
        this.secondStep.encryptedData = encryptedData;
        this.secondStep.shown = true;
        this.scrollTo("second-step");
      },
    );
  }

  private advanceSecondStep(): void {
 
    this.crypto.createDataSubmission(this.perpInput).then(
      (plainText: PlainTextData) => {
        const encryptedData: EncryptedData = this.crypto.encryptData(plainText);

        this.postData(encryptedData);
        // this.encryptedDataArr.push(encryptedData);
        // this.secondStep.RID = encryptedData.hashedRid;
        // this.secondStep.encryptedData = encryptedData;
        // this.secondStep.shown = true;
        this.thirdStep.shown = true;
        this.scrollTo("third-step");
      },
    );
    

  }

  private advanceThirdStep(): void {
    this.crypto.decryptData();
    
    this.fourthStep.shown = true;
    this.scrollTo("fourth-step");
  }

  private advanceFourthStep(): void {
    this.fifthStep.shown = true;
    this.scrollTo("fifth-step");
  }

  private advanceFifthStep(): void {
    this.sixthStep.shown = true;
    this.scrollTo("sixth-step");
  }

  private scrollTo(element: string): void {
    $("html, body").animate({
      scrollTop: $(element).offset().top,
    }, 400);
  }
}
