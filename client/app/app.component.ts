import { Component } from "@angular/core";
import { OnInit } from "@angular/core";

// import { CryptoService } from "./crypto.service";
import { GraphService } from "./graph.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: [
    "./styles/base.scss",
  ],
})
export class AppComponent implements OnInit {
  public title = "Callisto"; // only used as an example, not a necessary variable
  public graph = new GraphService();
  // public crypto = new CryptoService();

  // angular lifecycle hooks ref: https://angular.io/guide/lifecycle-hooks
  public ngOnInit() {
    this.graph.generateGraph();
    // this.crypto.run();
  }
}
