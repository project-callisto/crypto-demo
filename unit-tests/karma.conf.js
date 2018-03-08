// Karma configuration
// Generated on Fri Feb 23 2018 18:18:19 GMT-0800 (PST)

module.exports = function (config) {
  config.set({
    basePath: "./../",
    frameworks: [
      "jasmine",
      "karma-typescript",
      '@angular/cli',
    ],
    plugins: [
      require('karma-jasmine'),
      require('karma-typescript'),
      require('@angular/cli/plugins/karma'),
    ],
    files: [
      "client/app/services/crypto.service.ts",
      "unit-tests/client/*[sS]pec.ts",
    ],
    preprocessors: {
      "**/*.ts": "karma-typescript",
    },
    angularCli: {
      environment: 'dev'
    },
    karmaTypescriptConfig: {
      tsconfig: "unit-tests/tsconfig.json",
      compilerOptions: {
        allowJs: true,
      },
      bundlerOptions: {
        entrypoints: /\.[sS]pec\.ts$/,
        sourceMap: true,
        validateSyntax: true,
      },
      coverageOptions: {
        instrumentation: false,
      }
    },
    reporters: [
      "spec",
      "karma-typescript",
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
