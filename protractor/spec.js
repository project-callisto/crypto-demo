// protractor (angular + selenium) docs: http://www.protractortest.org/#/api
// // protractor defines methods like browser.get, element.getText
// jasmine docs https://jasmine.github.io/api/3.0/matchers.html
// // jasmine defines methods like toEqual, expect, toContain

describe('Valkyrie Demo', function() {

  beforeEach(function() {
    browser.get('/');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Valkyrie Demo');
  });

  it('should start with a perp name displayed', function() {
    const text = element(by.css('section:first-child')).getText();
    expect(text).toContain('PERP NAME');
  });

});
