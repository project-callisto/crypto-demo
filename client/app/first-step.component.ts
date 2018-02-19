import { Component, EventEmitter, Input, Output } from "@angular/core";

import { SecondStepComponent } from "./second-step.component";
import { CryptoService, EncryptedData, PlainTextData } from "./services/crypto.service";

import * as $ from "jquery";

@Component({
  selector: "first-step",
  templateUrl: "./templates/first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
  providers: [
    CryptoService,
  ],
})
export class FirstStepComponent {
  @Input() public RID: string = "[[ RID ]]";
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();

  public perpSubmit(event: Event, perpInput: string): void {
    event.preventDefault();
    if (perpInput) {
      this.advanceStep.emit(perpInput);
    }
  }

}
