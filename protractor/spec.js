// protractor (angular + selenium) docs: http://www.protractortest.org/#/api
// // protractor defines methods like browser.get, element.getText
// jasmine docs https://jasmine.github.io/api/3.0/matchers.html
// // jasmine defines methods like toEqual, expect, toContain

describe('Valkyrie Demo', () => {
  const FirstStep = $('first-step section');
  const SecondStep = $('second-step section');
  const ThirdStep = $('third-step section');
  const FourthStep = $('fourth-step section');
  const FifthStep = $('fifth-step section');
  const SixthStep = $('sixth-step section');
  const PerpNameInput = $('#perpInput');
  const PerpNameSubmit = $('.perp-name-form [type="submit"]');
  const RIDDisplay = $('.rid-display');

  function RIDExpectations() {
    expect(RIDDisplay.getText()).not.toContain('[[ Randomly Generated Key ]]');
    expect(RIDDisplay.getText()).toBeTruthy();
    expect(RIDDisplay.getText()).not.toContain('NaN');
  }

  function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  async function doPerpInput(perp = 'facebook.com/callistoorg') {
    PerpNameInput.sendKeys(perp);
    PerpNameSubmit.click();
    await sleep(1000); // this is bad, but satisfies our needs
    RIDExpectations();
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

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Valkyrie Demo');
  });

  it('should start with a perp name displayed', () => {
    expect(FirstStep.getText()).toContain('PERP NAME');
  });

  it('starts with no RID rendered', () => {
    expect(RIDDisplay.getText()).toContain('[[ Randomly Generated Key ]]');
  });

  it('renders a RID after perp name input', () => {
    doPerpInput();
    RIDExpectations();
  });

  it('renders a RID for perp names starting with a', () => {
    doPerpInput('apple');
    RIDExpectations();
  });

  it('renders a RID for perp names starting with z', () => {
    doPerpInput('zebra');
    RIDExpectations();
  });

  it('advances to step 2', () => {
    expect(SecondStep.isPresent()).toBeFalsy();
    doPerpInput();
    expect(SecondStep.isPresent()).toBeTruthy();
  });

  it('advances to step 3', () => {
    expect(ThirdStep.isPresent()).toBeFalsy();
    doPerpInput();
    AdvanceStepTwo();
    expect(ThirdStep.isPresent()).toBeTruthy();
  });

  it('advances to step 4', () => {
    expect(FourthStep.isPresent()).toBeFalsy();
    doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    expect(FourthStep.isPresent()).toBeTruthy();
  });

  it('advances to step 5', () => {
    expect(FifthStep.isPresent()).toBeFalsy();
    doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    AdvanceStepFour();
    expect(FifthStep.isPresent()).toBeTruthy();
  });

  it('advances to step 6', () => {
    expect(SixthStep.isPresent()).toBeFalsy();
    doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    AdvanceStepFour();
    AdvanceStepFive();
    expect(SixthStep.isPresent()).toBeTruthy();
  });

});
