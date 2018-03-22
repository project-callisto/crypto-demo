import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AsyncCryptoService } from "./services/async-crypto.service";
import { CryptoService } from "./services/crypto.service";

import * as $ from "jquery";

export interface IUserInput {
  readonly perpInput: string;
  readonly userName: string;
}

@Component({
  selector: "first-step",
  templateUrl: "./templates/first-step.component.html",
  styleUrls: [
    "./styles/base.scss",
    "./styles/step.scss",
  ],
})
export class FirstStepComponent implements OnInit {
  @Input() public shown: boolean = false;
  @Input() public recordKey: string = "[[ Awaiting Randomly Generated Key ]]";
  @Output() public advanceStep: EventEmitter<IUserInput> = new EventEmitter<IUserInput>();

  constructor(
    private asyncCryptoService: AsyncCryptoService,
  ) {
    //
  }

  public perpSubmit(event: Event, perpInput: string, userInput: string): void {
    event.preventDefault();
    if (perpInput && userInput) {
      const data: IUserInput = { perpInput, userName: userInput };
      this.advanceStep.emit(data);
    }
  }

  public ngOnInit(): void {
    this.createRecordKey();
  }

  private async createRecordKey(): Promise<void> {
    await this.asyncCryptoService.cryptoPromise.then((crypto: CryptoService): void => {
      this.recordKey = crypto.createRecordKey();
    });
  }

}
