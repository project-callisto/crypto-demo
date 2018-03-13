import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/angular";
import { GraphComponent } from "./../../client/app/graph.component";

/* tslint:disable */

storiesOf("Graph Component", module)
  .add("[ old ] basic data case", () => ({
    component: GraphComponent,
    props: {
      decryptedData: {
        decryptedRecords: [
          {
            perpId: "cats",
            userName: "rawr",
          },
          {
            perpId: "cats",
            userName: "rawrrawr",
          },
        ],
        slope: "0",
        rid: "262108550597937648776688611164507323240",
        coords: [
          {
            x: "1818434665380007676359554890799410417095842042341340086408891582578268721910569813619141100161473208037330386221870060425125251101144293189703614005770237",
            y: "262108550597937648776688611164507323240",
          },
          {
            x: "11344692275121949748361894386279193887898012619349834304710963510243012768711475666489101525413667227450451378687425067218176305958637106351542310498779410",
            y: "162202106739573701233605305694756902612",
          },
        ],
      },
    },
  }));
