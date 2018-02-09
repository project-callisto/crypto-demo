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
  public addPerp(event: Event) {
    event.preventDefault();

    const newPerpInput: string = $("#newPerpInput").val();
    const encryptedData = this.crypto.run(newPerpInput);
    // encryptedData spec:
    // {
    //   'calcPrg': string,
    //   'calcKRecord': string,
    //   'calcDerivedS': string,
    // }

    // populate values
    try {
      $("#calc-prg").text(encryptedData.calcPrg);
      $("#calc-prg").text(encryptedData.calcKRecord);
      $("#calc-prg").text(encryptedData.calcDerivedS);
    } catch (error) {
      console.log(error);
    }

    // display step
    $("#second-step").show();
    $("html, body").animate({
        scrollTop: $("#second-step").offset().top,
    }, 100);

  }
}
