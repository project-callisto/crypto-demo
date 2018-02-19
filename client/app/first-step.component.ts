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
    private crypto: CryptoService,
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

      // TODO: hook this up
      // const secondStep: SecondStepComponent = this.generateSecondStep();
      // secondStep.encryptedData = encryptedData;
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

//     let dataPromise = this.crypto.createDataSubmission(perpInput);

//     var cryptoService = this.crypto;

//     // have to resolve this 'then' error
//     dataPromise.then(function(plainText) {

//       var encryptedData = cryptoService.encryptData(plainText);

//       $("#calc-rid").text(plainText.rid);
//       // TODO:
//       $("#calc-prg").text(encryptedData.hashedPerpId);
//       $("#calc-derived-s").text(plainText.y);
//       $("#calc-k-record").text(encryptedData.encryptedRecord);

//       // display step
//       $("#second-step").show();
//       $("html, body").animate({
//           scrollTop: $("#second-step").offset().top,
//       }, 400);

//       // TODO: submit post request to submit data

//       // TODO: create separate route to get data

//     }, function(err) {
//       // TODO: display error messages
//       console.log('Error');
//     });
//   }
