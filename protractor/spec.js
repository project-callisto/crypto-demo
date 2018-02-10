// protractor (angular + selenium) docs: http://www.protractortest.org/#/api
// // protractor defines methods like browser.get, element.getText
// jasmine docs https://jasmine.github.io/api/3.0/matchers.html
// // jasmine defines methods like toEqual, expect, toContain

describe('Valkyrie Demo', function() {
  const FirstSection = element(by.css('#first-step'));
  const PerpNameInput = element(by.css('.perp-name-form [type="text"]'));
  const PerpNameSubmit = element(by.css('.perp-name-form [type="submit"]'));

  beforeEach(function() {
    browser.get('/');
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('Valkyrie Demo');
  });

  it('should start with a perp name displayed', function() {
    expect(FirstSection.getText()).toContain('PERP NAME');
  });

  it('starts with no RID rendered', function() {
    expect(FirstSection.getText()).toContain('[[ RID ]]');
  });

  it('renders a RID after perp name input', function() {
    PerpNameInput.sendKeys('facebook.com/callistoorg');
    PerpNameSubmit.click();
    expect(FirstSection.getText()).not.toContain('[[ RID ]]');
  });

});
