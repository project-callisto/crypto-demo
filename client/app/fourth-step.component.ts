import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EncryptedData } from "./services/crypto.service";

@Component({
  selector: "fourth-step",
  templateUrl: "./templates/fourth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FourthStepComponent {
  @Input() public encryptedData: EncryptedData;
  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
}
