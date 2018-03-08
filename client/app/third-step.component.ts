import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IPlainTextData } from "./services/crypto.service";

@Component({
  selector: "third-step",
  templateUrl: "./templates/third-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class ThirdStepComponent {
  @Input() public plainTextData: IPlainTextData;
  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
}
