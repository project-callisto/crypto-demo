import { Component, EventEmitter, Input, Output } from "@angular/core";

import { SecondStepComponent } from "./second-step.component";
import { CryptoService, EncryptedData } from "./services/crypto.service";

import * as $ from "jquery";

@Component({
  selector: "first-step",
  templateUrl: "./templates/first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
  providers: [
    CryptoService,
  ],
})
export class FirstStepComponent {
  @Input() public RID: string = "[[ RID ]]";
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public crypto: CryptoService,
  ) { }

  private handlePerpInput(perpInput) {
    const cryptoService = this.crypto;
    const dataPromise = this.crypto.createDataSubmission(perpInput);
    const firstStep = this;

    dataPromise.then(function(plainText) {
      const encryptedData = cryptoService.encryptData(plainText);
      console.log("plainText", plainText, "encrypted", encryptedData);

      $.post("/postData", encryptedData, (data, status) => {
        if (status !== "success") {
          console.log("Error posting encrypted data to server");
          return;
        } else {

          firstStep.submissionCount += 1;

          if (firstStep.submissionCount >= 2) {
            cryptoService.decryptData();
            firstStep.submissionCount = 0;
          }
        }
      });
    });
}

  public perpSubmit(event: Event, perpInput: string): void {
    event.preventDefault();
    if (perpInput) {
      this.advanceStep.emit(perpInput);
    }
  }

  private postEncryptedData(encryptedData: EncryptedData) {
    function postData(cT) {
      $.post("http://localhost:8080/postData", cT, (data, status) => {
        if (status !== "success") {
          console.log("error posting encrypted data");
        }
      });
    }
  }

}
