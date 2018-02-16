import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header.component";
import { StepComponent } from "./step.component";
import { FirstStepComponent } from "./first-step.component";
import { SecondStepComponent } from "./second-step.component";
import { ThirdStepComponent } from "./third-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { FifthStepComponent } from "./fifth-step.component";
import { SixthStepComponent } from "./sixth-step.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    StepComponent,
    FirstStepComponent,
    SecondStepComponent,
    ThirdStepComponent,
    FourthStepComponent,
    FifthStepComponent,
    SixthStepComponent,
  ],
  imports: [
    BrowserModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
