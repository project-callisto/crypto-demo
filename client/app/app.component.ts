import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { CryptoService } from './crypto.service';
import { GraphService } from './graph.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './styles/base.scss',
  ],
})
export class AppComponent implements OnInit {
  title = 'Callisto'; // only used as an example, not a necessary variable
  graph = new GraphService();

  // angular lifecycle hooks ref: https://angular.io/guide/lifecycle-hooks
  ngOnInit() {
    this.graph.generateGraph();
  }

}
