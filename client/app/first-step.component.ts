import { Component } from "@angular/core";
import { CryptoService, EncryptedData } from "./services/crypto.service";

import * as $ from "jquery";

@Component({
  selector: "first-step",
  templateUrl: "./templates/first-step.component.html",
  providers: [
    CryptoService,
  ],
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})


function postData(cT) {
  $.post('http://localhost:8080/postData', cT, (data, status) => {
    if (status !== 'success') {
      console.log('error posting encrypted data to server');
    }
  });
}

export class FirstStepComponent {
  // public encryptedDataArr: object[] = [];

  constructor(private crypto: CryptoService) { }

  public perpInputProcessing(perpInput: string): void {
    // const encryptedData: EncryptedData = this.crypto.encryptData(perpInput);

    let dataPromise = this.crypto.createDataSubmission(perpInput);

    var cryptoService = this.crypto;

    // have to resolve this 'then' error
    dataPromise.then(function(plainText) {

      var encryptedData = cryptoService.encryptData(plainText);

      postData(encryptedData);
      

      $("#calc-rid").text(plainText.rid);
      // TODO:
      $("#calc-prg").text(plainText.hashedPerpId);
      $("#calc-derived-s").text(plainText.y);
      // $("#calc-k-record").text(plainText.encryptedRecord);
      
      // display step
      $("#second-step").show();
      $("html, body").animate({
          scrollTop: $("#second-step").offset().top,
      }, 400);
      
      // TODO: submit post request to submit data

      // TODO: create separate route to get data

    }, function(err) {
      // TODO: display error messages
      console.log('Error');
    });
  }

  public perpInputEvent(event: Event): void {
    event.preventDefault();
    const perpInput: string = $("#perpInput").val();
    if (perpInput) { this.perpInputProcessing(perpInput); }
  }
}
