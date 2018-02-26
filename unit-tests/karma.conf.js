// Karma configuration
// Generated on Fri Feb 23 2018 18:18:19 GMT-0800 (PST)

module.exports = function (config) {
  config.set({
    basePath: './../',
    frameworks: [
      "jasmine",
      "karma-typescript"
    ],
    files: [
      'client/app/services/*.ts',
      'unit-tests/client/*[sS]pec.ts'
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript",
    },
    karmaTypescriptConfig: {
      tsconfig: "tsconfig.json",
      compilerOptions: {
        allowJs: true,
      }
    },
    // reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'spec',
      "karma-typescript"
    ],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    // [ dev mode ]
    autoWatch: true,
    singleRun: false,
    // [ ci mode ]
    // autoWatch: false,
    // singleRun: true,
    concurrency: Infinity
  })
}
