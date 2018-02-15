import {Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, ViewChild,
  ViewContainerRef } from "@angular/core";
import { SecondStepComponent } from "./second-step.component";
import { SecondStepDirective } from "./second-step.directive";
import { CryptoService, EncryptedData } from "./services/crypto.service";

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
  private RID: string = "[[ RID ]]";
  @ViewChild(SecondStepDirective) private secondStepHost: SecondStepDirective;

  constructor(
    private crypto: CryptoService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) { }

  public perpInputEvent(perpInput: string): void {
    if (perpInput) {
      this.getEncryptedData(perpInput);
    }
  }

  public perpSubmitEvent(event: Event, perpInput: string): void {
    event.preventDefault();
    if (perpInput) {
      const encryptedData: EncryptedData = this.getEncryptedData(perpInput);
      this.encryptedDataArr.push(encryptedData);
      const secondStep: SecondStepComponent = this.generateSecondStep();
      secondStep.encryptedData = encryptedData;
    }
  }

  public unmaskData(event: Event): void {
    // const unmaskedRecods = this.crypto.unmaskRecords(decryptedData.
    const decryptedData: object = this.crypto.decryptData(encryptedDataArr);
    this.graph.displayGraph(decryptedData);
  }

  private getEncryptedData(perpInput: string): EncryptedData {
    const encryptedData: EncryptedData = this.crypto.encryptData(perpInput);
    this.RID = encryptedData.rid;
    return encryptedData;
  }

  private generateSecondStep(): SecondStepComponent {
    const componentFactory: ComponentFactory<SecondStepComponent> =
      this.componentFactoryResolver.resolveComponentFactory(SecondStepComponent);
    const viewContainerRef: ViewContainerRef = this.secondStepHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef: ComponentRef<SecondStepComponent> = viewContainerRef.createComponent(componentFactory);
    return componentRef.instance;
  }


}
