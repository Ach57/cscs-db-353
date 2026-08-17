# End To End Testing ( GUI server, Backend server, SQL server)

## Context

This mini-project is designed to automatically test the features in the frontend through an automatic script that will then take screenshots as proof and place them into a folder `screenshots` which will be used in the final report submission as proof of functionality.

## History

The current implementation runs on three servers

- `VITE` server for the frontend
- `express` server for the backend
- `SQL` server for the database

The `express` server acts as a bridge between the frontend and the database. It has minimal logic as possible, as the database has all the `TRIGGERS` defined in it which will respond as errors once violated and then carried out from the backend to the frontend to the end-user.

## Requirements

You must have python installed globally on your machine, preferably a verison of `python3.12@higher`. Install first a python virtual environemnt

1. Create the virtual environment:
   - `macOS / Linux: python3 -m venv .venv`
   - `Windows: python -m venv .venv`
2. Activate the virtual environment
   - macOS / Linux (Bash/Zsh): `source .venv/bin/activate`
   - Windows (Command Prompt): `.venv\Scripts\activate.bat`
   - Windows (PowerShell): `.venv\Scripts\Activate.ps1`
3. Install dependencies
   - `pip install -r requirements.txt`
4. Deactivate virtual envrionment
   - `deactivate`

You must have node installed globally on your machine, preferably a version of `v20.xx.xx@higher`. Start by install the dependencies in `package.json`

```json
"devDependencies": {
    "@playwright/test": "^1.62.1"
  }
```

### Playwright overview

Playwright is an automated browser driver for testing web applications.
Think of it this way:

- Your browser = Chrome, Edge, Firefox
- Playwright = the robot that controls the browser
- Your tests = instructions you give the robot

For example: instead of manually doing:

1. Open website
2. Click login
3. Enter username
4. Enter password
5. Click submit
6. Check the "Welcome" appears

You write

```js
test('user can log in', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.fill('#username', 'achraf');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

Then Playwright does all those browser actions automatically.

#### Installation

Step 1: Install the Playwright package:

- `npm install -D @playwright/test`

Step 2: Install the browsers

- `npx playwright install`

## Mini-Project Structure

```bash
.
├── fold-into-excel.py
├── list-remaining.js
├── playwright.config.js
├── README.md
├── requirements.txt
├── run.spec.js
└── test-cases.js
```
