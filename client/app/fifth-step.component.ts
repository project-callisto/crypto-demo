import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClientDataService } from "./services/client-data.service";
import { ICoord, IDecryptedData } from "./services/crypto.service";

@Component({
  selector: "fifth-step",
  templateUrl: "./templates/fifth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FifthStepComponent {

  @Input() public shown: boolean = false;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
  public pis: string[];

  constructor(
    private clientData: ClientDataService,
  ) {
    clientData.cryptoDecrypted$.subscribe(
      (cryptoDecrypted: IDecryptedData) => {
        const coords: ICoord[] = cryptoDecrypted.coords;
        const pis: string[] = [];
        for (const i in coords) {
          pis.push(coords[i].pi);
        }
        this.pis = pis;
      },
    );
  }

}
