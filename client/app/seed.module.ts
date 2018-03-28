import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { GraphComponent } from "./graph.component";
import { ClientDataService } from "./services/client-data.service";

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  bootstrap: [],
})
export class SeedModule {
}
