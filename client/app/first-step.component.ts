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

    // console.log('URLSearchParams(document.cookie).get("PHPSESSID")')
    // const cookie = new URLSearchParams(document.cookie)
    // console.log(cookie.get("PHPSESSID"))

    // populate values
    $("#calc-rid").text(encryptedData.rid);
    $("#calc-prg").text(encryptedData.hashedPerpId);
    $("#calc-k-record").text(encryptedData.encryptedRecord);
    $("#calc-derived-s").text(encryptedData.y);

    // display step
    $("#second-step").show();
    $("html, body").animate({
        scrollTop: $("#second-step").offset().top,
    }, 400);

  }
}
