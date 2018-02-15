import { AfterViewInit, Component, Input, ViewContainerRef } from "@angular/core";
import { EncryptedData } from "./services/crypto.service";

import * as $ from "jquery";

@Component({
  templateUrl: "./templates/second-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class SecondStepComponent implements AfterViewInit {
  @Input() public encryptedData: EncryptedData;

  public ngAfterViewInit(): void {
    this.scrollTo();
  }

  public scrollTo(): void {
    $("html, body").animate({
      scrollTop: $("#second-step").offset().top,
    }, 400);
  }

}
