import { AfterViewInit, Component } from "@angular/core";

@Component({
  selector: "ng-modal",
  templateUrl: "./templates/preflight.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/modal.scss",
  ],
})
export class PreflightComponent implements AfterViewInit {

  public ngAfterViewInit(): void {
      const isIphone = navigator.userAgent.indexOf("iPhone") != -1 ;
      const isIpod = navigator.userAgent.indexOf("iPod") != -1 ;
      const isIpad = navigator.userAgent.indexOf("iPad") != -1 ;
      const isIos = isIphone || isIpod || isIpad ;

      if (isIos) {
          const callistoModal: HTMLElement = document.querySelector(".callisto-modal");
          callistoModal.style.display = "block";
      }
  }
}
