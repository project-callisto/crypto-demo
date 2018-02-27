import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PlainTextData } from "./services/crypto.service";

@Component({
  selector: "third-step",
  templateUrl: "./templates/third-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class ThirdStepComponent {
  @Input() public plainTextData: PlainTextData;
  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
}
