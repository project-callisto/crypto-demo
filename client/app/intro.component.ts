import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "intro-root",
  templateUrl: "./templates/intro.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class IntroComponent {
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
}
