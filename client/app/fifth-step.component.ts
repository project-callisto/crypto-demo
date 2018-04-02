import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ClientDataService, ICoordGraph } from "./services/client-data.service";
import { IDecryptedData } from "./services/crypto.service";

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
    clientData.cryptoEvent$.subscribe(() => {
      this.pis = clientData.coords.map((coord: ICoordGraph) => coord.pi);
    });
  }

}
