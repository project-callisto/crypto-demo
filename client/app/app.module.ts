import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CryptoService } from './crypto.service';
import { GraphService } from './graph.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    CryptoService,
    GraphService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    // access services defined in this constructor with this.VAR
    // eg. this.crypto, this.graph
    private crypto: CryptoService,
    private graph: GraphService,
  ) { }

}
