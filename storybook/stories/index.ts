import { AfterViewInit } from "@angular/core";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/angular";
import bigInt = require("big-integer");
import { FirstStepComponent } from "./../../client/app/first-step.component";
import { FourthStepComponent } from "./../../client/app/fourth-step.component";
import { NavComponent } from "./../../client/app/nav.component";
import { SecondStepComponent } from "./../../client/app/second-step.component";
import { SeededFifthStepComponent, SeededGraphComponent } from "./../../client/app/seed.module";
import { ClientDataService } from "./../../client/app/services/client-data.service";
import { SixthStepComponent } from "./../../client/app/sixth-step.component";
import { ThirdStepComponent } from "./../../client/app/third-step.component";

/* tslint:disable */

storiesOf("Valkyrie Demo", module)

  .add("nav", () => ({
    component: NavComponent,
    props: { sectionStep: 3 },
  }))

  .add("first step", () => ({
    component: FirstStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        ClientDataService,
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
        ClientDataService,
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
        ClientDataService,
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
        ClientDataService,
      ],
      declarations: [
        NavComponent,
      ],
    },
  }))

  .add("fifth step", () => ({
    component: SeededFifthStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        ClientDataService,
      ],
      declarations: [
        NavComponent,
        SeededGraphComponent,
      ],
    },
  }))

  .add("sixth step", () => ({
    component: SixthStepComponent,
    props: { shown: true },
    moduleMetadata: {
      providers: [
        ClientDataService,
      ],
      declarations: [
        NavComponent,
      ],
    },
  }))

  .add("graph", () => ({
    component: SeededGraphComponent,
    moduleMetadata: {
      providers: [
        ClientDataService,
      ],
    },
  }))

  ;
