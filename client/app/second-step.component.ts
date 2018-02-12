import { Component } from "@angular/core";
import { CryptoService } from "./crypto.service";

import * as $ from 'jquery';

@Component({
  selector: "second-step",
  templateUrl: "./second-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class SecondStepComponent {
  public crypto: CryptoService = new CryptoService();


  // public addPerp(event: Event): void {
  //   event.preventDefault();

  //   const newPerpInput: string = $("#newPerpInput").val();
  //   const encryptedData: object = this.crypto.encryptData(newPerpInput);

  //   // populate values
  //   $("#calc-rid").text(encryptedData.rid);
  //   $("#calc-prg").text(encryptedData.hashedPerpId);
  //   $("#calc-k-record").text(encryptedData.encryptedRecord);
  //   $("#calc-derived-s").text(encryptedData.y);

    // show graph?

    // // display step
    // $("#third-step").show();
    // $("html, body").animate({
    //     scrollTop: $("#third-step").offset().top,
    // }, 400);

  }
}

}
