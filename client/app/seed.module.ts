import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppModule } from "./app.module";
import { FifthStepComponent } from "./fifth-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { GraphComponent } from "./graph.component";
import { NavComponent } from "./nav.component";
import { ClientDataService } from "./services/client-data.service";

/* tslint:disable */

// export class SeededFourthStepComponent extends FourthStepComponent {
//   constructor(
//     private seededClientData: ClientDataService = new ClientDataService(),
//   ) {
//     super(seededClientData);
//     seededClientData.submitUserInput("example perp", "asdadwad aiuwbd jd");
//   }
// }

// export class SeededFifthStepComponent extends FifthStepComponent {
//   constructor(
//     private seededClientData: ClientDataService = new ClientDataService(),
//   ) {
//     super(seededClientData);
//     seededClientData.submitUserInput("example perp", "asdadwad aiuwbd jd");
//   }
// }

export class SeededGraphComponent extends GraphComponent {
  constructor(
    private seededClientData: ClientDataService = new ClientDataService(),
  ) {
    super(seededClientData);
    seededClientData.submitUserInput("example perp", "_____farts");
  }
}

@NgModule({
  declarations: [
    SeededGraphComponent,
    // SeededFifthStepComponent,
    // SeededFourthStepComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppModule,
  ],
  bootstrap: [],
})
export class SeedModule {
}
