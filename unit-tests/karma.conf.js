// Karma configuration
// Generated on Fri Feb 23 2018 18:18:19 GMT-0800 (PST)

module.exports = function (config) {
  config.set({
    basePath: "./../",
    frameworks: [
      "jasmine",
      '@angular/cli',
    ],
    plugins: [
      require('karma-jasmine'),
      require('@angular/cli/plugins/karma'),
      require('karma-chrome-launcher'),
      require("karma-spec-reporter"),
    ],
    files: [
      "client/app/services/crypto.service.ts",
      "unit-tests/client/*[sS]pec.ts",
    ],
    angularCli: {
      environment: 'dev'
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: [
      "spec",
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: [
      "Chrome",
    ],
    concurrency: Infinity
  })
}
