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

    public closeModal(event: Event): void {
        const callistoModal: HTMLElement = document.querySelector(".callisto-modal");
        callistoModal.style.display = "none";
    }

  public ngAfterViewInit(): void {
      const isIphone: boolean = navigator.userAgent.indexOf("iPhone") !== -1 ;
      const isIpod: boolean = navigator.userAgent.indexOf("iPod") !== -1 ;
      const isIpad: boolean = navigator.userAgent.indexOf("iPad") !== -1 ;
      const isIos: boolean = isIphone || isIpod || isIpad ;

      if (!isIos) {
          const callistoModal: HTMLElement = document.querySelector(".callisto-modal");
          callistoModal.style.display = "block";
      }
  }
}
