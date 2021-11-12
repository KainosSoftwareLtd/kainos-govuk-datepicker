const path = require('path');
const fs = require('fs');
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
      show: false,
      windowSize: '1200x900'
    }
  },
  async bootstrap() {
    await holdBeforeFileExists(path.resolve(__dirname, './dist'));
  },
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

function holdBeforeFileExists(filePath, timeout = 5000) {
  return new Promise((resolve)=>{
    var timer = setTimeout(function () {
      resolve();
    },timeout);

    var inter = setInterval(function () {
      if(fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()){
        clearInterval(inter);
        clearTimeout(timer);
        resolve();
      }
    }, 100);
  });
}