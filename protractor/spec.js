// protractor (angular + selenium) docs: http://www.protractortest.org/#/api
// // protractor defines methods like browser.get, element.getText
// jasmine docs https://jasmine.github.io/api/3.0/matchers.html
// // jasmine defines methods like toEqual, expect, toContain

describe('Valkyrie Demo', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Valkyrie Demo');
  });

  it('advances to step 1', () => {
    // there's only 1 article visible on page start
    expect(article(1).isPresent()).toBeTruthy();
    expect(article(2).isPresent()).toBeFalsy();
    // we click the "next" button in the 1st article
    article(1).next();
    // and now a second article is visible
    expect(article(2).isPresent()).toBeTruthy();
  })

  function article(index) {
    this = $(`step-root > *:nth-child(${index}) article`);
    this.next = () => { this.$('button:contains("next")').click(); }
    return this
  }

});
