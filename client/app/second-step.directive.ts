import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: "[second-step]",
})
export class SecondStepDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
