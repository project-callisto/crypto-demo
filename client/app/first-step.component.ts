import { Component } from "@angular/core";

@Component({
  selector: "content-root",
  templateUrl: "./first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FirstStepComponent {
    perp = '';
    addPerp(newPerp: string) {
	if (newPerp) {
	    this.perp = newPerp;
	    console.log(newPerp);
	}
    }
}
