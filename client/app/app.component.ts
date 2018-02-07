import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { CryptoService } from './crypto.service';
import { GraphService } from './graph.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
  ],
})
export class AppComponent implements OnInit {
  title = 'Valkyrie Demo';
  graph = new GraphService();

  ngOnInit() {
    this.graph.generateGraph();
  }

}
