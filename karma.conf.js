var webpackConfig = require('./webpack.config.js');
module.exports = function (config) {
  config.set({
    webpack: webpackConfig,
    basePath: '',
    frameworks: ["jasmine"],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      'src/**/*.test.ts'
    ],
    preprocessors: {
      "src/**/*.ts": ['typescript', 'webpack', 'coverage'],
    },
    typescriptPreprocessor: {
      // options passed to the typescript compiler
      options: {
          sourceMap: true,
          target: 'es5',
          module: 'commonjs',
          noImplicitAny: true,
          noResolve: true,
          removeComments: true,
          concatenateOutput: false
      },
    },
    exclude: [
      'lib/**/*.ts'
    ],
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageReporter: {
      addNodeGlobals: true,
      instrumenterOptions: {
        istanbul: { noCompact: true }
      },
      reporters: [
        { type: 'json' },
      ],
      html: './coverage',
      dir: './coverage/',
      subdir: (browser) => {
        return browser.toLowerCase().split(/[ /-]/)[0]; // returns 'chrome'
      },
    },
    reporters: ['spec', "progress", 'coverage'],
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
