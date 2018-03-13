import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <a href="#first-step" class="skip-to-main sr-only-focusable">Skip to main content</a>
    <header-root class="main-content"></header-root>
    <step-root class="main-content"></step-root>
    <footer-root class="main-content"></footer-root>
  `,
  styleUrls: [
    "./styles/base.scss",
  ],
})
export class AppComponent {
}
