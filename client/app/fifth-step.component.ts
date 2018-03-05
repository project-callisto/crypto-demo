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
  @Input() public RID2: string;
  @Input() public RID3: string;
  @Input() public RID4: string;
  @Input() public shown: boolean = false;
  @Input() public decryptedData: DecryptedData;
  @Output() public advanceStep: EventEmitter<string> = new EventEmitter<string>();
<<<<<<< HEAD
}
=======
  @ViewChild(GraphComponent) public graph: GraphComponent;

  public ngAfterContentChecked(): void {
    if (this.graph && this.decryptedData) {
      this.graph.decryptedData = this.decryptedData;
    }
  }

}
>>>>>>> 50be108419fe9647cb4026bac0ba2cce83a8bfec
