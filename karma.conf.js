var webpackConfig = require('./webpack.config.js');
module.exports = function (config) {
  config.set({
    webpack: webpackConfig,
    basePath: '',
    frameworks: ['jasmine'],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      './src/**/*.test.ts'
    ],
    preprocessors: {
      './src/main.ts': ['webpack'],
      './src/**/*.test.ts': ['webpack']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    // reporters: ['spec'], //, 'kjhtml', 'karma-remap-istanbul'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,

    captureTimeout: 1200000,              // 20 minutes
    browserNoActivityTimeout: 100000,     // default 10,000ms
    browserDisconnectTolerance: 0,        // default 0 (5)
    browserDisconnectTimeout: 20000,      // 20000
    retryLimit: 1,                        // default 2 (5)

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222',
          '--no-sandbox',
        ],
      }
    }

  });
};
