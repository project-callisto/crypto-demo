import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FirstStepComponent } from './first-step.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstStepComponent,
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    FirstStepComponent,
  ]
})
export class AppModule {
}
