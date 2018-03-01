import { Component, ViewChild } from "@angular/core";
import { FifthStepComponent } from "./fifth-step.component";
import { FirstStepComponent, IUserInput } from "./first-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { SecondStepComponent } from "./second-step.component";
import { CryptoService, DecryptedData, EncryptedData, PlainTextData } from "./services/crypto.service";
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
  private perpInput: string;
  private userName: string;

  @ViewChild(FirstStepComponent) private firstStep: FirstStepComponent;
  @ViewChild(SecondStepComponent) private secondStep: SecondStepComponent;
  @ViewChild(ThirdStepComponent) private thirdStep: ThirdStepComponent;
  @ViewChild(FourthStepComponent) private fourthStep: FourthStepComponent;
  @ViewChild(FifthStepComponent) private fifthStep: FifthStepComponent;
  @ViewChild(SixthStepComponent) private sixthStep: SixthStepComponent;
  @ViewChild(SummaryStepComponent) private summaryStep: SummaryStepComponent;

  constructor (
    public crypto: CryptoService,
  ) { }

  /*
   * advancer functions handle display logic for children
   * and interact with the crypto through promises chained from private functions
   */

  public advanceFirstStep (userInput: IUserInput): void {
    this.perpInput = userInput.perpInput;
    this.userName = userInput.userName;
    this.submitUserEntry().then(() => {
      this.secondStep.shown = true;
      this.scrollTo("second-step");
    });
  }

  public advanceSecondStep (): void {
    this.thirdStep.shown = true;
    this.scrollTo("third-step");
  }

  public advanceThirdStep (): void {
    this.fourthStep.shown = true;
    this.scrollTo("fourth-step");
  }

  public advanceFourthStep (): void {
    this.generateGraphData().then(() => {
      this.fifthStep.shown = true;
      this.scrollTo("fifth-step");
    });
  }

  public advanceFifthStep (): void {
    this.sixthStep.shown = true;
    this.scrollTo("sixth-step");
  }

  public advanceSixthStep (): void {
    this.summaryStep.shown = true;
    this.scrollTo("summary-step");
  }

  private scrollTo (element: string): void {
    $("html, body").animate({
      scrollTop: $(element).offset().top,
    }, 400);
  }

  private async submitUserEntry (): Promise<void> {
    await this.crypto.createDataSubmission(this.perpInput, this.userName).then(
      (plainText: PlainTextData) => {
        const encryptedData: EncryptedData = this.crypto.encryptData(plainText);
        this.crypto.postData(encryptedData);
        this.firstStep.recordKey = plainText.recordKey;
        this.secondStep.plainTextData = plainText;
        this.thirdStep.plainTextData = plainText;
        this.fourthStep.encryptedData = encryptedData;
      },
    );
  }

  private async generateGraphData (): Promise<void> {
    // matched perpInput, diff username
    // input is matched, which (in prod) will trigger decryption
    await this.submitAndEncrypt(this.perpInput, this.userName + this.userName).then(() => {
      const decryptedData: DecryptedData = this.crypto.decryptData();
      this.fifthStep.RID = decryptedData.strRid;
      this.fifthStep.graph.decryptedData = decryptedData;
      this.sixthStep.record = JSON.stringify(decryptedData.decryptedRecords);
    });
    // unmatched perpInput
    await this.submitAndEncrypt(this.perpInput + this.perpInput, "Alice");
    // unmatched perpInput
    await this.submitAndEncrypt(this.perpInput + "1", "Bob");
  }

  private async submitAndEncrypt (perpInput: string, userName: string): Promise<void> {
    await this.crypto.createDataSubmission(perpInput, userName).then(
      (plainText: PlainTextData) => {
        const encryptedData: EncryptedData = this.crypto.encryptData(plainText);
        this.crypto.postData(encryptedData);
      },
    );
  }
}
