import {Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewChild,
  ViewContainerRef } from "@angular/core";
import { SecondStepComponent } from "./second-step.component";
import { SecondStepDirective } from "./second-step.directive";
import { CryptoService, EncryptedData } from "./services/crypto.service";

import * as $ from "jquery";

@Component({
  selector: "first-step",
  templateUrl: "./templates/first-step.component.html",
  providers: [
    CryptoService,
  ],
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FirstStepComponent {
  public encryptedDataArr: object[] = [];
  @ViewChild(SecondStepDirective) private secondStepHost: SecondStepDirective;

  constructor(
    private crypto: CryptoService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  public perpInputProcessing(perpInput: string): void {
    const encryptedData: EncryptedData = this.crypto.encryptData(perpInput);

    this.encryptedDataArr.push(encryptedData);

    // populate values
    $("#calc-rid").text(encryptedData.rid);
    $("#calc-prg").text(encryptedData.hashedPerpId);
    $("#calc-k-record").text(encryptedData.encryptedRecord);
    $("#calc-derived-s").text(encryptedData.y);

    // display step
    const componentFactory: ComponentFactory<SecondStepComponent> =
      this.componentFactoryResolver.resolveComponentFactory(SecondStepComponent);
    const viewContainerRef: ViewContainerRef = this.secondStepHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef: ComponentRef<SecondStepComponent> = viewContainerRef.createComponent(componentFactory);
    componentRef.instance.encryptedData = encryptedData;

    $("html, body").animate({
        scrollTop: $("#second-step").offset().top,
    }, 400);
  }

  public perpInputEvent(event: Event): void {
    event.preventDefault();
    const perpInput: string = $("#perpInput").val();
    if (perpInput) { this.perpInputProcessing(perpInput); }
  }
}
