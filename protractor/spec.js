// protractor (angular + selenium) docs: http://www.protractortest.org/#/api
// // protractor defines methods like browser.get, element.getText
// jasmine docs https://jasmine.github.io/api/3.0/matchers.html
// // jasmine defines methods like toEqual, expect, toContain

describe("Valkyrie Demo", () => {
  beforeEach(() => {
    browser.get("/");
  });

  it("should have a title", () => {
    expect(browser.getTitle()).toEqual("Valkyrie Demo");
  });

  it("advances to article 2", () => {
    // there's only 1 article visible on page start
    expect(article(1).isPresent()).toBeTruthy();
    expect(article(2).isPresent()).toBeFalsy();
    // we click the "next" button in the 1st article
    article(1).next();
    // and now a second article is visible
    expect(article(2).isPresent()).toBeTruthy();
  });

  it("advances to article 3", () => {
    expect(article(3).isPresent()).toBeFalsy();
    article(1).next();
    article(2).next();
    expect(article(3).isPresent()).toBeTruthy();
  });

  function article(index) {
    const element = $(`step-root *:nth-child(${index}) article`);
    if (index === 2) {
      element.next = () => {
        element.$("#userInput").sendKeys('user name');
        element.$("#perpInput").sendKeys('perp id');
        element.$(".advance-button").click();
      }
    } else {
      element.next = () => {
        element.$(".advance-button").click();
      }
    }
    return element;
  }

});
