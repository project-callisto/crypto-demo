import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClientDataService } from "./services/client-data.service";
import { IEncryptedData, IPlainTextData } from "./services/crypto.service";

@Component({
  selector: "fourth-step",
  templateUrl: "./templates/fourth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FourthStepComponent {

  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
  public recordKey: string;
  public c: string;
  public eRecord: string;

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoEvent$.subscribe(() => {
      this.c = clientData.cryptoEncrypted.c;
      this.eRecord = clientData.cryptoEncrypted.eRecord;
      this.recordKey = clientData.cryptoPlainText.recordKeyStr;
    });
  }

}
