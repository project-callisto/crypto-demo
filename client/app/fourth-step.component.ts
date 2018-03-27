import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClientDataService } from "./services/client-data.service";
import { IEncryptedData } from "./services/crypto.service";

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
  public encryptedData: IEncryptedData;

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoEncrypted$.subscribe(
      (cryptoEncrypted: IEncryptedData) => {
        this.encryptedData = cryptoEncrypted;
      },
    );
  }

}
