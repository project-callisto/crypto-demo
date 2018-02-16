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
  private RID: string = "[[ RID ]]";
  @ViewChild(SecondStepDirective) private secondStepHost: SecondStepDirective;

  constructor(
    private crypto: CryptoService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  // public perpInputEvent(perpInput: string): void {
  //   if (perpInput) {
  //     this.getEncryptedData(perpInput);
  //   }
  // }

  public perpSubmitEvent(event: Event, perpInput: string): void {
    event.preventDefault();
    if (perpInput) {
      // const encryptedData: EncryptedData = this.getEncryptedData(perpInput);

      let cryptoService = this.crypto;
      let dataPromise = this.crypto.createDataSubmission(perpInput);

      dataPromise.then(function(plainText) {
        const encryptedData = cryptoService.encryptData(plainText);
        const secondStep: SecondStepComponent = this.generateSecondStep();
        secondStep.encryptedData = encryptedData;

     });
    }
  }

  private postEncryptedData(encryptedData: EncryptedData) {
    function postData(cT) {
      $.post('http://localhost:8080/postData', cT, (data, status) => {
        if (status !== 'success') {
          console.log('error posting encrypted data')
        }
      });
    }
  }

  // private getEncryptedData(perpInput: string): EncryptedData {
    


    // const encryptedData: EncryptedData = this.crypto.encryptData(perpInput);
    // this.RID = encryptedData.rid.toString();
    // return encryptedData;
  // }

  private generateSecondStep(): SecondStepComponent {
    const componentFactory: ComponentFactory<SecondStepComponent> =
      this.componentFactoryResolver.resolveComponentFactory(SecondStepComponent);
    const viewContainerRef: ViewContainerRef = this.secondStepHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef: ComponentRef<SecondStepComponent> = viewContainerRef.createComponent(componentFactory);
    return componentRef.instance;
  }
}

//     let dataPromise = this.crypto.createDataSubmission(perpInput);

//     var cryptoService = this.crypto;

//     // have to resolve this 'then' error
//     dataPromise.then(function(plainText) {

//       var encryptedData = cryptoService.encryptData(plainText);

//       $("#calc-rid").text(plainText.rid);
//       // TODO:
//       $("#calc-prg").text(encryptedData.hashedPerpId);
//       $("#calc-derived-s").text(plainText.y);
//       $("#calc-k-record").text(encryptedData.encryptedRecord);
      
//       // display step
//       $("#second-step").show();
//       $("html, body").animate({
//           scrollTop: $("#second-step").offset().top,
//       }, 400);
      
//       // TODO: submit post request to submit data

//       // TODO: create separate route to get data

//     }, function(err) {
//       // TODO: display error messages
//       console.log('Error');
//     });
//   }
