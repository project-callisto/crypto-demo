// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  framework: 'jasmine',
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
        'args': ['no-sandbox']
    }
  },
  specs: ['spec.js'],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
}
