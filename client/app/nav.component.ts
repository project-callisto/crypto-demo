import { AfterViewInit, Component, Input } from "@angular/core";

import * as $ from "jquery";
import "jquery-ui/ui/widgets/menu";

// [ docs ]
// https://api.jqueryui.com/menu/
// https://learn.jquery.com/jquery-ui/widget-factory/how-to-use-the-widget-factory/
// https://learn.jquery.com/jquery-ui/widget-factory/extending-widgets/
// https://github.com/jquery/jquery-ui/blob/74f8a0ac952f6f45f773312292baef1c26d81300/ui/widgets/menu.js
$.widget("custom.menu", $.ui.menu, {
  // move faster!
  delay: 0,
  // allow left to right navigation
  _keydown(event: any): void {
    switch (event.keyCode) {
      case $.ui.keyCode.LEFT:
        this.previous(event);
        break;
      case $.ui.keyCode.RIGHT:
        this.next(event);
        break;
      default:
        this._super(event);
    }
  },
});

@Component({
  selector: "step-nav",
  templateUrl: "./templates/nav.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/nav.scss",
  ],
})
export class NavComponent implements AfterViewInit {
  @Input() public sectionStep: number = 0;
  public maxSteps: number = 6;
  public Array: ArrayConstructor = Array;  // angular templates dont have Array by default

  public stepToID(key: number): string {
    return "#" + [
      "first-step",
      "second-step",
      "third-step",
      "fourth-step",
      "fifth-step",
      "sixth-step",
    ][key];
  }

  public ngAfterViewInit(): void {
    $(".step-display").menu();
  }
}
