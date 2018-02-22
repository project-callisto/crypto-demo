import * as jsdom from "jsdom";

const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html></html>`);

global.window = dom.window;
global.document = dom.window.document;
