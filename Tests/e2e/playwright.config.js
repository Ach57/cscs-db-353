// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 60_000,
  retries: 0,
  workers: 1, // tests are stateful and must run sequentially
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'off', // run.spec.js takes its own screenshots, named by Test Case ID
    trace: 'retain-on-failure',
  },
});
