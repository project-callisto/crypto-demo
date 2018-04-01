import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClientDataService } from "./services/client-data.service";
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

  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
  public pi: string;
  public a: string;
  public kStr: string;
  public U: string;
  public s: string;

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoEvent$.subscribe(() => {
      this.pi = clientData.cryptoPlainText.pi;
      this.a = clientData.cryptoPlainText.a.toString();
      this.kStr = clientData.cryptoPlainText.kStr;
      this.U = clientData.cryptoPlainText.U.toString();
      this.s = clientData.cryptoPlainText.s.toString();
    });
  }

}
