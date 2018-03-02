import { AfterContentChecked, Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { GraphComponent } from "./graph.component";
import { DecryptedData } from "./services/crypto.service";

@Component({
  selector: "fifth-step",
  templateUrl: "./templates/fifth-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FifthStepComponent implements AfterContentChecked {
  @Input() public RID: string;
  @Input() public shown: boolean = false;
  @Input() public decryptedData: DecryptedData;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(GraphComponent) public graph: GraphComponent;

  public ngAfterContentChecked(): void {
    if (this.graph && this.decryptedData) {
      this.graph.decryptedData = this.decryptedData;
    }
  }

}
