import { Component } from "@angular/core";
import { CryptoService } from "./crypto.service";


@Component({
  selector: "content-root",
  templateUrl: "./first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})


export class FirstStepComponent {
  public crypto = new CryptoService();

  perp = '';
  
  addPerp(newPerp: string) {
	  if (newPerp) {
      this.perp = newPerp;
      this.crypto.run();
	  }
  }
}
