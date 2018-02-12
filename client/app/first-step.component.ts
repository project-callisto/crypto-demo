import { Component } from "@angular/core";
import { CryptoService } from "./crypto.service";

import * as $ from "jquery";

@Component({
  selector: "first-step",
  templateUrl: "./first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FirstStepComponent {
  public crypto = new CryptoService();

  public encryptedDataArr = [];

  public addPerp(event: Event) {
    event.preventDefault();

    const newPerpInput: string = $("#newPerpInput").val();
    const encryptedData = this.crypto.encryptData(newPerpInput);

    this.encryptedDataArr.push(encryptedData);
    // encryptedData spec:
    // {
    //   'calcPrg': string,
    //   'calcKRecord': string,
    //   'calcDerivedS': string,
    // }

    // populate values
    $("#calc-prg").text(encryptedData.hashedPerpId);

    $("#calc-prg").text(encryptedData.encryptedRecord);
    // $("#calc-prg").text(encryptedData.calcDerivedS);

    // derived S
    $("#calc-prg").text(encryptedData.y);

    // display step
    $("#second-step").show();
    $("html, body").animate({
        scrollTop: $("#second-step").offset().top,
    }, 2000);

    if (this.encryptedDataArr.length >= 2) {
      console.log('decrypting', this.encryptedDataArr)
      var decryptedData = this.crypto.decryptData(this.encryptedDataArr);
      //  TODO: must wrap this in a promise so that you get value after callback.
      //  this should contain all decrypted data needed to graph!
      //  line is y = mx + b AKA y = slope * x + rid
    
   
      this.encryptedDataArr = [];
    }

  }
}
