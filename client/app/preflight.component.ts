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
      var isIphone = navigator.userAgent.indexOf("iPhone") != -1 ;
      var isIpod = navigator.userAgent.indexOf("iPod") != -1 ;
      var isIpad = navigator.userAgent.indexOf("iPad") != -1 ;
      var isIos = isIphone || isIpod || isIpad ;

      if(isIos) {
          document.querySelector('.callisto-modal').style.display = 'block';
      }
  }
}
