import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { FifthStepComponent } from "./fifth-step.component";
import { FirstStepComponent } from "./first-step.component";
import { FooterComponent } from "./footer.component";
import { FourthStepComponent } from "./fourth-step.component";
import { GraphComponent } from "./graph.component";
import { HeaderComponent } from "./header.component";
import { IntroComponent } from "./intro.component";
import { LastStepComponent } from "./last-step.component";
import { NavComponent } from "./nav.component";
import { PreflightComponent } from "./preflight.component";
import { SecondStepComponent } from "./second-step.component";
import { SixthStepComponent } from "./sixth-step.component";
import { StepComponent } from "./step.component";
import { ThirdStepComponent } from "./third-step.component";

import { ClientDataService } from "./services/client-data.service";
import { CryptoService } from "./services/crypto.service";

@NgModule({
  declarations: [
    AppComponent,
    PreflightComponent,
    HeaderComponent,
    StepComponent,
    FirstStepComponent,
    SecondStepComponent,
    ThirdStepComponent,
    FooterComponent,
    FourthStepComponent,
    FifthStepComponent,
    SixthStepComponent,
    GraphComponent,
    IntroComponent,
    NavComponent,
    LastStepComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [
    ClientDataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
