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
      'web-server/server.js',
      'client/app/services/crypto-service.ts',
      'unit-tests/client/*[sS]pec.ts'
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript",
    },
    karmaTypescriptConfig: {
      tsconfig: "unit-tests/tsconfig.json",
      compilerOptions: {
        allowJs: true,
      }
    },
    reporters: [
      'spec',
      "karma-typescript"
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome'],
    concurrency: Infinity
  })
}
