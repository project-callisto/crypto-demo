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
    expect($('article:nth-child(1)').isPresent()).toBeFalsy();
    $('article:nth-child(0) button:contains("next")').click()
    expect($('article:nth-child(1)').isPresent()).toBeTruthy();
  })

});
