const { setHeadlessWhen } = require('@codeceptjs/configure');
const server = require('./server');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

const puppeteer = {
  url: 'http://localhost:8080/',
  show: true,
  windowSize: '1200x900',
};

if (process.env.CI) {
  puppeteer.chrome = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
}

exports.config = {
  tests: './src/__tests__/e2e/*.test.js',
  output: './output',
  helpers: {
    ChaiWrapper: {
      require: 'codeceptjs-chai',
    },
    Puppeteer: puppeteer,
  },
  async bootstrap() {
    await server;
  },
  async teardown() {
    await server.shutdown();
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
