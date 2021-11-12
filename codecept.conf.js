const { setHeadlessWhen } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './src/__tests__/e2e/*.test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      url: 'http://localhost:8080/',
      show: true,
      windowSize: '1200x900'
    }
  },
  bootstrap: null,
  mocha: {},
  name: 'date-picker',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}