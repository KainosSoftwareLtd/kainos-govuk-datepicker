const path = require('path');
const fs = require('fs');
const { setHeadlessWhen } = require('@codeceptjs/configure');

const holdBeforeFileExists = (filePath, timeout = 5000) => new Promise((resolve) => {
  const timer = setTimeout(() => {
    resolve();
  }, timeout);

  const inter = setInterval(() => {
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
      clearInterval(inter);
      clearTimeout(timer);
      resolve();
    }
  }, 100);
});

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
      windowSize: '1200x900',
    },
  },
  async bootstrap() {
    await holdBeforeFileExists(path.resolve(__dirname, './dist'));
  },
  mocha: {},
  name: 'date-picker',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};
