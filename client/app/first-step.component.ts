import { Component } from "@angular/core";
import * as $ from "jquery"

@Component({
  selector: "first-step",
  templateUrl: "./first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FirstStepComponent {
  public perp = "";

  public addPerp(event: Event) {
    const newPerpInput: string = $("#newPerpInput").val();
    event.preventDefault();
    this.perp = newPerpInput;
    console.log("newPerpInput", newPerpInput);
  }
}
