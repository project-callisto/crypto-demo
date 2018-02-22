import * as jsdom from "jsdom";

const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html></html>`);
export const $ = require("jquery")(dom.window);
