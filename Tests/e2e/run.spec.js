/**
 * Data-driven runner: executes every case in test-cases.js against the
 * running frontend, screenshots the result named by Test Case ID, and
 * writes a results file you can fold back into the Excel's Outcome /
 * Actual Result columns.
 *
 * Run:  npx playwright test e2e/run.spec.js
 * Screenshots land in: e2e/screenshots/<TestCaseID>.png
 * Results land in:     e2e/results.json
 *
 * Adjust ASSERTIONS below to match your app's actual error/success UI
 * (e.g. a toast component, an inline form error, a redirect). As written,
 * these are generic guesses -- confirm against your real markup.
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const cases = require('./test-cases');

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const RESULTS_PATH = path.join(__dirname, 'results.json');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const results = [];

async function runAction(page, action) {
  switch (action.type) {
    case 'goto':
      await page.goto(action.path);
      break;
    case 'click':
      await page.locator(action.selector).click();
      break;
    case 'dblclick':
      await page.locator(action.selector).dblclick();
      break;
    case 'fill':
      await page.locator(action.selector).fill(action.value);
      break;
    case 'select':
      await page.locator(action.selector).selectOption(action.value);
      break;
    case 'wait':
      await page.waitForTimeout(action.ms);
      break;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Generic pass/fail heuristics -- edit the selectors to match your app.
const ASSERTIONS = {
  async error(page) {
    // e.g. a toast/banner/inline error rendered somewhere on the page
    // const errorEl = page.locator(
    //   '[role="alert"], .error, .toast-error, text=/error|rejected|cannot|not allowed/i',
    // );
    // await expect(errorEl.first()).toBeVisible({ timeout: 5000 });
    await expect(
      page.getByText('The club can only have one Head location.'),
    ).toBeVisible({ timeout: 5000 });
  },
  async success(page) {
    // e.g. a success toast, OR simply the absence of an error banner
    const errorEl = page.locator('[role="alert"], .error, .toast-error');
    await expect(errorEl).toHaveCount(0);
  },
};

for (const tc of cases) {
  test(`${tc.id} — ${tc.title}`, async ({ page }) => {
    const outcome = {
      id: tc.id,
      suite: tc.suite,
      title: tc.title,
      type: tc.type,
    };

    if (tc.actions.length === 0) {
      outcome.status = 'Skipped';
      outcome.note = 'No actions defined yet in test-cases.js';
      results.push(outcome);
      test.skip(true, 'actions not yet defined');
      return;
    }

    try {
      for (const action of tc.actions) {
        await runAction(page, action);
      }

      if (tc.expect !== 'manual' && ASSERTIONS[tc.expect]) {
        await ASSERTIONS[tc.expect](page);
      }

      outcome.status = 'Passed';
    } catch (err) {
      outcome.status = 'Failed';
      outcome.note = err.message.split('\n')[0];
    } finally {
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `${tc.id}.png`),
        fullPage: true,
      });
      results.push(outcome);
    }

    if (outcome.status === 'Failed') {
      throw new Error(outcome.note);
    }
  });
}

test.afterAll(async () => {
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${RESULTS_PATH}`);
  console.log(`Screenshots written to ${SCREENSHOT_DIR}/<TestCaseID>.png`);
});
