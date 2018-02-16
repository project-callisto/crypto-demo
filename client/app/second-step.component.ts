import { Component, Input, ViewContainerRef } from "@angular/core";
import { EncryptedData } from "./services/crypto.service";

import * as $ from "jquery";

@Component({
  selector: "second-step",
  templateUrl: "./templates/second-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class SecondStepComponent {
  @Input() public encryptedData: EncryptedData;
  public shown: boolean = false;

  public scrollTo(): void {
    $("html, body").animate({
      scrollTop: $("#second-step").offset().top,
    }, 400);
  }

}
