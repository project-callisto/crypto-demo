import { Component, EventEmitter, Input, Output } from "@angular/core";
@Component({
  selector: "sixth-step",
  templateUrl: "./templates/sixth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class SixthStepComponent {
  @Input() public decryptedData: {};
  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
}
