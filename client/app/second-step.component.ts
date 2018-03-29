import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClientDataService } from "./services/client-data.service";
import { IPlainTextData } from "./services/crypto.service";

@Component({
  selector: "second-step",
  templateUrl: "./templates/second-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class SecondStepComponent {

  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
  public plainTextData: IPlainTextData;

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoEvent$.subscribe(() => {
      this.plainTextData = clientData.cryptoPlainText;
    });
  }

}
