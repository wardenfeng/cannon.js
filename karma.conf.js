// var webpackConfig = require('./webpack.config.js');
const webpack = require('webpack');

// Webpack config for testing / coverage only
const webpackTestConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader?silent=true',
        exclude: /node_modules/
      },
      {
        test: /src\/.+\.ts$/,
        exclude: /(node_modules|\.test\.ts$)/,
        loader: 'istanbul-instrumenter-loader',
        enforce: 'post',
        options: {
          esModules: true
        }
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.(ts|js)($|\?)/i
    })
  ],
  resolve: {
    extensions: ['.ts', '.js']
  }
};


module.exports = function (config) {
  config.set({
    webpack: webpackTestConfig,
    basePath: '',
    frameworks: ["jasmine"],
    singleRun: true,
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      './src/**/*.ts'
    ],
    exclude: [
      './src/**/*.d.ts',
    ],
    preprocessors: {
      'src/**/!(*.test).ts': ['webpack'],
      'src/**/*.test.ts': ['webpack']
    },

    reporters: [ 'progress', 'coverage-istanbul' ],
    coverageIstanbulReporter: {
      reports: [ 'text-summary', 'lcov' ],
      fixWebpackSourcePaths: true,
      dir: './coverage'
    },

    mime: {
      'text/x-typescript': ['ts','tsx']
    },

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
