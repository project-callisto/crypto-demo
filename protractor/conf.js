const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  framework: 'jasmine',
  directConnect: true,
  baseUrl: 'http://localhost:49152/',
  capabilities: {
    'browserName': 'chrome'
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
