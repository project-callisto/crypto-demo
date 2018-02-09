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
    const newPerpInput: string = $("#newPerpInput").val();
    event.preventDefault();

    this.crypto.run(newPerpInput);

    $("#second-step").show();
    $("html, body").animate({
        scrollTop: $("#second-step").offset().top,
    }, 2000);

  }
}
