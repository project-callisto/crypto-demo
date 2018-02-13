import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header.component";
import { FirstStepComponent } from "./first-step.component";
import { SecondStepComponent } from "./second-step.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FirstStepComponent,
    SecondStepComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
