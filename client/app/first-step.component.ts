import { Component } from "@angular/core";
import { CryptoService } from "./crypto.service";


@Component({
  selector: "first-step",
  templateUrl: "./first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})


export class FirstStepComponent {
  public crypto = new CryptoService();

  public perp = "";

  public addPerp(newPerp: string) {
    if (newPerp) {
      this.perp = newPerp;
      this.crypto.run(newPerp);
    }
  }
}
