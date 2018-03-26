import { Component, ViewChild } from "@angular/core";
import { FifthStepComponent } from "./fifth-step.component";
import { FirstStepComponent, IUserInput } from "./first-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { IntroComponent } from "./intro.component";
import { LastStepComponent } from "./last-step.component";
import { SecondStepComponent } from "./second-step.component";
import { AsyncCryptoService } from "./services/async-crypto.service";
import { CryptoService, IDecryptedData, IEncryptedData, IPlainTextData } from "./services/crypto.service";
import { SixthStepComponent } from "./sixth-step.component";
import { ThirdStepComponent } from "./third-step.component";

import bigInt = require("big-integer");
import * as $ from "jquery";
import * as _sodium from "libsodium-wrappers";

@Component({
  selector: "step-root",
  template: `
    <intro-root
      (advanceStep)="advanceIntro()"
    ></intro-root>
    <first-step
      (advanceStep)="advanceFirstStep($event)"
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
  private perpInput: string;
  private userName: string;

  @ViewChild(IntroComponent) private introComp: IntroComponent;
  @ViewChild(FirstStepComponent) private firstStep: FirstStepComponent;
  @ViewChild(SecondStepComponent) private secondStep: SecondStepComponent;
  @ViewChild(ThirdStepComponent) private thirdStep: ThirdStepComponent;
  @ViewChild(FourthStepComponent) private fourthStep: FourthStepComponent;
  @ViewChild(FifthStepComponent) private fifthStep: FifthStepComponent;
  @ViewChild(SixthStepComponent) private sixthStep: SixthStepComponent;
  @ViewChild(LastStepComponent) private lastStep: LastStepComponent;

  constructor(
    private asyncCryptoService: AsyncCryptoService,
  ) {
    //
  }

  /*
   * advancer functions handle display logic for children
   * and interact with the crypto through promises chained from private functions
   */

  public advanceIntro(): void {
    this.firstStep.shown = true;
    this.scrollTo("first-step");
  }

  public advanceFirstStep(userInput: IUserInput): void {
    this.perpInput = userInput.perpInput;
    this.userName = userInput.userName;
    this.submitUserEntry().then(() => {
      this.secondStep.shown = true;
      this.scrollTo("second-step");
    });

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

  private async submitUserEntry(): Promise<void> {
    await this.asyncCryptoService.cryptoPromise.then((crypto: CryptoService): void => {
      const userPT: IPlainTextData = crypto.submitData(this.perpInput, this.userName);
      crypto.submitData(this.perpInput + this.perpInput, this.userName + "Alice");
      crypto.submitData("1234" + this.perpInput, this.userName + "Bob");
      crypto.submitData(this.perpInput, this.userName + this.userName);

      this.secondStep.plainTextData = userPT;
      this.thirdStep.plainTextData = userPT;
      const dataSubs: IEncryptedData[] = crypto.getDataSubmissions();
      this.fourthStep.encryptedData = dataSubs[0];

      const decryptedData: IDecryptedData = crypto.decryptData();
      this.fifthStep.decryptedData = decryptedData;
      this.fifthStep.coords = crypto.getCoords();
      this.sixthStep.record = JSON.stringify(decryptedData.decryptedRecords[0].perpId);
    });
  }

  // private async generateGraphData(): Promise<void> {
  //   await this.asyncCryptoService.cryptoPromise.then((crypto: CryptoService): void => {
  //     // unmatched perpInput
  //     // let encryptedData: IEncryptedData = crypto.submitAndEncrypt(
  //     //   this.perpInput + this.perpInput, this.userName + "Alice");
  //     // this.fifthStep.RID2 = encryptedData.hashedRid;
  //     // unmatched perpInput
  //     // encryptedData = crypto.submitAndEncrypt("1234" + this.perpInput, this.userName + "Bob");
  //     // this.fifthStep.RID3 = encryptedData.hashedRid;
  //     // matched perpInput, diff username
  //     // encryptedData = crypto.submitAndEncrypt(this.perpInput, this.userName + this.userName);
  //     // this.fifthStep.RID4 = encryptedData.hashedRid;
  //     // input is matched, trigger decryption

  //   });
  // }
}
