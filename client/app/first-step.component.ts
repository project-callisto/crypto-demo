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
  public crypto: CryptoService = new CryptoService();
  public encryptedDataArr: object = [];

  public addPerp(event: Event): void {
    event.preventDefault();

    const newPerpInput: string = $("#newPerpInput").val();
    const encryptedData: object = this.crypto.encryptData(newPerpInput);

    this.encryptedDataArr.push(encryptedData);
    // encryptedData spec:
    // {
    //   'calcPrg': string,
    //   'calcKRecord': string,
    //   'calcDerivedS': string,
    // }

    // populate values
    $("#calc-rid").text(encryptedData.rid);
    $("#calc-prg").text(encryptedData.hashedPerpId);
    $("#calc-k-record").text(encryptedData.encryptedRecord);
    $("#calc-derived-s").text(encryptedData.y);

    // display step
    $("#second-step").show();
    $("html, body").animate({
        scrollTop: $("#second-step").offset().top,
<<<<<<< HEAD
    }, 2000);

    if (this.encryptedDataArr.length >= 2) {
      console.log('decrypting', this.encryptedDataArr)
      var decryptedData = this.crypto.decryptData(this.encryptedDataArr);
      //  TODO: must wrap this in a promise so that you get value after callback.
      //  this should contain all decrypted data needed to graph!
      //  line is y = mx + b AKA y = slope * x + rid
    
   
      this.encryptedDataArr = [];
    }
=======
    }, 400);
>>>>>>> a6f5f3508dc0d82e3b5039c3eba945e886cf0456

  }
}
