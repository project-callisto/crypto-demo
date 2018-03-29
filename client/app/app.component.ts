import { AfterViewInit, Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <ng-modal class="ng-modal"></ng-modal>
    <a href="#intro-step" class="skip-to-main sr-only-focusable">Skip to main content</a>
    <header-root class="main-content"></header-root>
    <step-root class="main-content"></step-root>
    <footer-root class="main-content"></footer-root>
  `,
  styleUrls: [
    "./styles/base.scss",
  ],
})
export class AppComponent implements AfterViewInit {

  public ngAfterViewInit(): void {
    // restart the page at the top
    window.onbeforeunload = (): void => {
      window.scrollTo(0, 0);
    };
    // clear any navigation hrefs
    window.location.href = "#";
  }
}
