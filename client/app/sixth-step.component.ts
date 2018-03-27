import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClientDataService } from "./services/client-data.service";
import { IDecryptedData } from "./services/crypto.service";

@Component({
  selector: "sixth-step",
  templateUrl: "./templates/sixth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class SixthStepComponent {

  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
  public perpId: string;

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoDecrypted$.subscribe(
      (cryptoDecrypted: IDecryptedData) => {
        this.perpId = JSON.stringify(cryptoDecrypted.decryptedRecords[0].perpId);
      },
    );
  }

}
