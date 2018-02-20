// protractor (angular + selenium) docs: http://www.protractortest.org/#/api
// // protractor defines methods like browser.get, element.getText
// jasmine docs https://jasmine.github.io/api/3.0/matchers.html
// // jasmine defines methods like toEqual, expect, toContain

describe('Valkyrie Demo', function () {
  const FirstStep = element(by.css('first-step section'));
  const SecondStep = element(by.css('second-step section'));
  const ThirdStep = element(by.css('third-step section'));
  const FourthStep = element(by.css('fourth-step section'));
  const FifthStep = element(by.css('fifth-step section'));
  const SixthStep = element(by.css('sixth-step section'));
  const PerpNameInput = element(by.css('.perp-name-form [type="text"]'));
  const PerpNameSubmit = element(by.css('.perp-name-form [type="submit"]'));
  const RIDDisplay = element(by.css('.rid-display'));

  genericPerpInput = function (perp = 'facebook.com/callistoorg') {
    PerpNameInput.sendKeys(perp);
    PerpNameSubmit.click();
    setTimeout(() => {
      expect(RIDDisplay.getText()).not.toContain('[[ RID ]]');
      expect(RIDDisplay.getText()).toBeTruthy();
      expect(RIDDisplay.getText()).not.toContain('NaN');
    }, 10000);
  }

  AdvanceStepTwo = function () {
    SecondStep.element(by.css('.advance-button')).click();
  }

  AdvanceStepThree = function () {
    ThirdStep.element(by.css('.advance-button')).click();
  }

  AdvanceStepFour = function () {
    FourthStep.element(by.css('.advance-button')).click();
  }

  AdvanceStepFive = function () {
    FifthStep.element(by.css('.advance-button')).click();
  }

  beforeEach(function () {
    browser.get('/');
  });

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Valkyrie Demo');
  });

  it('should start with a perp name displayed', function () {
    expect(FirstStep.getText()).toContain('PERP NAME');
  });

  it('starts with no RID rendered', function () {
    expect(RIDDisplay.getText()).toContain('[[ RID ]]');
  });

  it('renders a RID after perp name input', function () {
    genericPerpInput();
  });

  it('renders a RID for perp names starting with a', function () {
    genericPerpInput('apple');
  });

  it('renders a RID for perp names starting with z', function () {
    genericPerpInput('zebra');
  });

  it('advances to step 2', function () {
    expect(SecondStep.isPresent()).toBeFalsy();
    genericPerpInput();
    expect(SecondStep.isPresent()).toBeTruthy();
  });

  it('advances to step 3', function () {
    expect(ThirdStep.isPresent()).toBeFalsy();
    genericPerpInput();
    AdvanceStepTwo();
    expect(ThirdStep.isPresent()).toBeTruthy();
  });

  it('advances to step 4', function () {
    expect(FourthStep.isPresent()).toBeFalsy();
    genericPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    expect(FourthStep.isPresent()).toBeTruthy();
  });

  it('advances to step 5', function () {
    expect(FifthStep.isPresent()).toBeFalsy();
    genericPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    AdvanceStepFour();
    expect(FifthStep.isPresent()).toBeTruthy();
  });

  it('advances to step 6', function () {
    expect(SixthStep.isPresent()).toBeFalsy();
    genericPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    AdvanceStepFour();
    AdvanceStepFive();
    expect(SixthStep.isPresent()).toBeTruthy();
  });

});
