import { Component, EventEmitter, Input, Output } from "@angular/core";

import * as $ from "jquery";

export interface IUserInput {
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
})
export class FirstStepComponent {
  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<IUserInput> = new EventEmitter<IUserInput>();

  public perpSubmit(event: Event, perpInput: string, userInput: string): void {
    event.preventDefault();
    if (perpInput && userInput) {
      const data: IUserInput = { perpInput, userName: userInput };
      this.advanceStep.emit(data);
    }
  }
}
