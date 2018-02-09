import { Component } from "@angular/core";
import * as $ from "jquery";

@Component({
  selector: "first-step",
  templateUrl: "./first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FirstStepComponent {
  public addPerp(event: Event) {
    const newPerpInput: string = $("#newPerpInput").val();
    event.preventDefault();
  }
}
