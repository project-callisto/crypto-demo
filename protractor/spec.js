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

  async function RIDExpectations() {
    expect(await RIDDisplay.getText()).not.toContain('[[ Randomly Generated Key ]]');
    expect(await RIDDisplay.getText()).toBeTruthy();
    expect(await RIDDisplay.getText()).not.toContain('NaN');
  }

  async function doPerpInput(perp = 'facebook.com/callistoorg') {
    $('#perpInput').sendKeys(perp);
    $('#userInput').sendKeys('alice');
    PerpNameSubmit.click();
    await RIDExpectations();
  }

  async function AdvanceStepTwo() {
    await SecondStep.$('.advance-button').click();
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

  beforeEach(async () => {
    await browser.get('/');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Valkyrie Demo');
  });

  it('should start with a perp name displayed', async () => {
    expect(await FirstStep.getText()).toContain('PERP NAME');
  });

  it('starts with no RID rendered', async () => {
    expect(await RIDDisplay.getText()).toContain('[[ Randomly Generated Key ]]');
  });

  it('renders a RID after perp name input', async () => {
    await doPerpInput();
  });

  it('advances to step 2', async () => {
    expect(await SecondStep.isPresent()).toBeFalsy();
    await doPerpInput();
    expect(SecondStep.isPresent()).toBeTruthy();
  });

  it('advances to step 3', async () => {
    expect(await ThirdStep.isPresent()).toBeFalsy();
    await doPerpInput();
    AdvanceStepTwo();
    expect(ThirdStep.isPresent()).toBeTruthy();
  });

  it('advances to step 4', async () => {
    expect(await FourthStep.isPresent()).toBeFalsy();
    await doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    expect(FourthStep.isPresent()).toBeTruthy();
  });

  it('advances to step 5', async () => {
    expect(await FifthStep.isPresent()).toBeFalsy();
    await doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    AdvanceStepFour();
    expect(FifthStep.isPresent()).toBeTruthy();
  });

  it('advances to step 6', async () => {
    expect(await SixthStep.isPresent()).toBeFalsy();
    await doPerpInput();
    AdvanceStepTwo();
    AdvanceStepThree();
    AdvanceStepFour();
    AdvanceStepFive();
    expect(SixthStep.isPresent()).toBeTruthy();
  });

});
