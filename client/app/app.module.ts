import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { FirstStepComponent } from "./first-step.component";
import { HeaderComponent } from "./header.component";
import { SecondStepComponent } from "./second-step.component";
import { SecondStepDirective } from "./second-step.directive";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FirstStepComponent,
    SecondStepComponent,
    SecondStepDirective,
  ],
  imports: [
    BrowserModule,
  ],
  entryComponents: [
    SecondStepComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
