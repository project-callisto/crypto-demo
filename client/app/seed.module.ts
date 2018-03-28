import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { FifthStepComponent } from "./fifth-step.component";
import { GraphComponent } from "./graph.component";
import { ClientDataService } from "./services/client-data.service";

export class SeededFifthStepComponent extends FifthStepComponent {
  constructor(
    private seededClientData: ClientDataService = new ClientDataService(),
  ) {
    super(seededClientData);
    seededClientData.submitUserInput("example perp", "asdadwad aiuwbd jd");
  }
}

export class SeededGraphComponent extends GraphComponent {
  constructor(
    private seededClientData: ClientDataService = new ClientDataService(),
  ) {
    super(seededClientData);
    seededClientData.submitUserInput("example perp", "asdadwad aiuwbd jd");
  }
}

@NgModule({
  declarations: [
    SeededGraphComponent,
    SeededFifthStepComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  bootstrap: [],
})
export class SeedModule {
}
