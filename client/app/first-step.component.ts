import { Component, EventEmitter, Input, Output } from "@angular/core";

import { SecondStepComponent } from "./second-step.component";
import { CryptoService, EncryptedData, PlainTextData } from "./services/crypto.service";

import * as $ from "jquery";

export interface UserInput {
  readonly perpInput: string;
  readonly userName: string;
}

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
  @Input() public recordKey: string = "[[ Randomly Generated Key ]]";
  @Output() public advanceStep: EventEmitter<UserInput> = new EventEmitter<UserInput>();

  public perpSubmit (event: Event, perpInput: string, userInput: string): void {
    event.preventDefault();
    if (perpInput && userInput) {
      const data = {perpInput, userName: userInput};
      this.advanceStep.emit(data);
    }
  }
}
