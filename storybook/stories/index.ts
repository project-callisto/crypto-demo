import { AfterViewInit } from "@angular/core";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/angular";
import bigInt = require("big-integer");
import { FifthStepComponent } from "./../../client/app/fifth-step.component";
import { FirstStepComponent } from "./../../client/app/first-step.component";
import { FourthStepComponent } from "./../../client/app/fourth-step.component";
import { GraphComponent } from "./../../client/app/graph.component";
import { NavComponent } from "./../../client/app/nav.component";
import { SecondStepComponent } from "./../../client/app/second-step.component";
import { ClientDataService, SeededClientDataService } from "./../../client/app/services/client-data.service";
import { SixthStepComponent } from "./../../client/app/sixth-step.component";
import { ThirdStepComponent } from "./../../client/app/third-step.component";

/* tslint:disable */

storiesOf("Cryptography Demo", module)

  .add("nav", () => ({
    component: NavComponent,
    props: { sectionStep: 3 },
  }))

  .add("first step", () => ({
    component: FirstStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        { provide: ClientDataService, useClass: SeededClientDataService },
      ],
      declarations: [
        NavComponent,
      ],
    },
  }))

  .add("second step", () => ({
    component: SecondStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        { provide: ClientDataService, useClass: SeededClientDataService },
      ],
      declarations: [
        NavComponent,
      ],
    },
  }))

  .add("third step", () => ({
    component: ThirdStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        { provide: ClientDataService, useClass: SeededClientDataService },
      ],
      declarations: [
        NavComponent,
      ],
    },
  }))

  .add("fourth step", () => ({
    component: FourthStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        { provide: ClientDataService, useClass: SeededClientDataService },
      ],
      declarations: [
        NavComponent,
      ],
    },
  }))

  .add("fifth step", () => ({
    component: FifthStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        { provide: ClientDataService, useClass: SeededClientDataService },
      ],
      declarations: [
        NavComponent,
        GraphComponent,
      ],
    },
  }))

  .add("sixth step", () => ({
    component: SixthStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        { provide: ClientDataService, useClass: SeededClientDataService },
      ],
      declarations: [
        NavComponent,
      ],
    },
  }))

  .add("graph", () => ({
    component: GraphComponent,
    moduleMetadata: {
      providers: [
        { provide: ClientDataService, useClass: SeededClientDataService },
      ],
    },
  }))

  ;
