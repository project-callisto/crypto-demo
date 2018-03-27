import { AfterContentChecked, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { GraphComponent } from "./graph.component";
import { CryptoService, ICoord, IDecryptedData } from "./services/crypto.service";

@Component({
  selector: "fifth-step",
  templateUrl: "./templates/fifth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FifthStepComponent {
  @Input() public pi: string[];
  @Input() public rid: string;
  @Input() public shown: boolean = false;
  @Input() public decryptedData: IDecryptedData;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
}
