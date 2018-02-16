import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { StepComponent } from "./step.component";
import { FirstStepComponent } from "./first-step.component";
import { HeaderComponent } from "./header.component";
import { SecondStepComponent } from "./second-step.component";
import { SecondStepDirective } from "./second-step.directive";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StepComponent,
    FirstStepComponent,
    SecondStepComponent,
  ],
  imports: [
    BrowserModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
