import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClientDataService } from "./services/client-data.service";

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
  @Output() public advanceStep: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private clientData: ClientDataService,
  ) {
    //
  }

  public perpSubmit(event: Event, perpInput: string, userInput: string): void {
    event.preventDefault();
    if (perpInput && userInput) {
      this.clientData.submitUserInput(perpInput, userInput);
      this.advanceStep.emit();
    }
  }
}
