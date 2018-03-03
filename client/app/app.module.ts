import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { FifthStepComponent } from "./fifth-step.component";
import { FirstStepComponent } from "./first-step.component";
import { FourthStepComponent } from "./fourth-step.component";
import { GraphComponent } from "./graph.component";
import { HeaderComponent } from "./header.component";
import { IntroComponent } from "./intro.component";
import { SecondStepComponent } from "./second-step.component";
import { CryptoService } from "./services/crypto.service";
import { SixthStepComponent } from "./sixth-step.component";
import { StepComponent } from "./step.component";
import { ThirdStepComponent } from "./third-step.component";

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
    GraphComponent,
    IntroComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [
    CryptoService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
