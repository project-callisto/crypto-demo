import { AfterViewInit, Component } from "@angular/core";

@Component({
  selector: "ng-modal",
  templateUrl: './templates/preflight.component.html',
  styleUrls: [
    "./styles/base.scss",
    "./styles/modal.scss",
  ],
})
export class PreflightComponent implements AfterViewInit {

  public ngAfterViewInit(): void {
    // restart the page at the top
    window.onbeforeunload = (): void => {
      window.scrollTo(0, 0);
    };
    // clear any navigation hrefs
    window.location.href = "#";
  }
}
