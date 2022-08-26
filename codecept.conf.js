const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');
const server = require('./server');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

setCommonPlugins();

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
    await server;
  },
  async teardown() {
    await server.shutdown();
  },
  mocha: {},
  name: 'date-picker',
  plugins: {},
};
