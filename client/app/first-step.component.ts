import { Component } from "@angular/core";
import { CryptoService } from "./crypto.service";

import * as $ from "jquery";

@Component({
  selector: "first-step",
  templateUrl: "./templates/first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FirstStepComponent {
  public crypto: CryptoService = new CryptoService();
  public encryptedDataArr: Array<object> = [];

  public addPerp(event: Event): void {
    event.preventDefault();

    const newPerpInput: string = $("#newPerpInput").val();
    const encryptedData: object = this.crypto.encryptData(newPerpInput);

    this.encryptedDataArr.push(encryptedData);

    // populate values
    $("#calc-rid").text(encryptedData['rid']);
    $("#calc-prg").text(encryptedData['hashedPerpId']);
    $("#calc-k-record").text(encryptedData['encryptedRecord']);
    $("#calc-derived-s").text(encryptedData['y']);

    // display step
    $("#second-step").show();
    $("html, body").animate({
        scrollTop: $("#second-step").offset().top,
    }, 400);

  }
}
