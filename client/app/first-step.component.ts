import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SecondStepComponent } from "./second-step.component";

@Component({
  selector: "first-step",
  templateUrl: "./templates/first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FirstStepComponent {
  @Input() public RID: string = '[[ RID ]]';
  @Output() public onPerpSubmit = new EventEmitter<string>();

  public perpSubmit(event: Event, perpInput: string): void {
    event.preventDefault();
    this.onPerpSubmit.emit(perpInput);
  }
}
