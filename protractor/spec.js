// protractor (angular + selenium) docs: http://www.protractortest.org/#/api
// // protractor defines methods like browser.get, element.getText
// jasmine docs https://jasmine.github.io/api/3.0/matchers.html
// // jasmine defines methods like toEqual, expect, toContain

describe('Valkyrie Demo', function () {
  const FirstStep = $('first-step section');
  const SecondStep = $('second-step section');
  const ThirdStep = $('third-step section');
  const FourthStep = $('fourth-step section');
  const FifthStep = $('fifth-step section');
  const SixthStep = $('sixth-step section');
  const PerpNameInput = $('.perp-name-form [type="text"]');
  const PerpNameSubmit = $('.perp-name-form [type="submit"]');
  const RIDDisplay = $('.rid-display');

  function RIDExpectations() {
    expect(RIDDisplay.getText()).not.toContain('[[ RID ]]');
    expect(RIDDisplay.getText()).toBeTruthy();
    expect(RIDDisplay.getText()).not.toContain('NaN');
  }

  function doPerpInput(perp = 'facebook.com/callistoorg') {
    PerpNameInput.sendKeys(perp);
    PerpNameSubmit.click();
    console.log('initalizing promise');
    return new Promise(() => {
      setTimeout(() => {
        RIDExpectations();
        console.log('resolved promise');
      }, 1000);
    });
  }

  function AdvanceStepTwo() {
    SecondStep.$('.advance-button').click();
  }

  function AdvanceStepThree() {
    ThirdStep.$('.advance-button').click();
  }

  function AdvanceStepFour() {
    FourthStep.$('.advance-button').click();
  }

  function AdvanceStepFive() {
    FifthStep.$('.advance-button').click();
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

  it('renders a RID after perp name input', async function () {
    await doPerpInput();
    console.log('awaited doPerpInput');
    RIDExpectations();
  });

  it('renders a RID for perp names starting with a', function () {
    doPerpInput('apple');
  });

  it('renders a RID for perp names starting with z', function () {
    doPerpInput('zebra');
  });

  it('advances to step 2', function () {
    expect(SecondStep.isPresent()).toBeFalsy();
    doPerpInput();
    expect(SecondStep.isPresent()).toBeTruthy();
  });

  it('advances to step 3', function () {
    expect(ThirdStep.isPresent()).toBeFalsy();
    doPerpInput();
    AdvanceStepTwo();
    expect(ThirdStep.isPresent()).toBeTruthy();
  });

  it('advances to step 4', function () {
    expect(FourthStep.isPresent()).toBeFalsy();
    doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    expect(FourthStep.isPresent()).toBeTruthy();
  });

  it('advances to step 5', function () {
    expect(FifthStep.isPresent()).toBeFalsy();
    doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    AdvanceStepFour();
    expect(FifthStep.isPresent()).toBeTruthy();
  });

  it('advances to step 6', function () {
    expect(SixthStep.isPresent()).toBeFalsy();
    doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    AdvanceStepFour();
    AdvanceStepFive();
    expect(SixthStep.isPresent()).toBeTruthy();
  });

});
