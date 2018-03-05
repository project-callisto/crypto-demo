// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  framework: 'jasmine',
  directConnect: true,
  baseUrl: 'http://localhost:4202/',
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['no-sandbox']
    }
  },
  SELENIUM_PROMISE_MANAGER: false,
  specs: ['spec.js'],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { }
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    // https://github.com/angular/protractor/issues/4294#issuecomment-357941307
    let currentCommand = Promise.resolve();
    // Serialise all webdriver commands to prevent EPIPE errors
    const webdriverSchedule = browser.driver.schedule;
    browser.driver.schedule = (command, description) => {
      currentCommand = currentCommand.then(() =>
        webdriverSchedule.call(browser.driver, command, description)
      );
      return currentCommand;
    };
  }
}
