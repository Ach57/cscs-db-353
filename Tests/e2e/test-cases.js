/**
 * Mirrors "Test Cases" sheet in CSCS_Frontend_Test_Suite.xlsx.
 * Keep Test Case IDs identical to the Excel so screenshots and results
 * can be matched back to it 1:1.
 *
 * Each case's `actions` array is executed in order by e2e/run.spec.js.
 * established for the backend (routes/index.ts) as a starting guess for
 * the frontend's React Router paths -- confirm/adjust per your actual app.
 *
 * Action types supported by the runner:
 *   { type: 'goto',   path }                 navigate to a route
 *   { type: 'click',  selector }             click an element
 *   { type: 'fill',   selector, value }      type into a field
 *   { type: 'select',  selector, value }     choose a <select> option
 *   { type: 'wait',   ms }                   pause (use sparingly; prefer
 *                                             Playwright's auto-waiting)
 *
 * `expect`: 'error' | 'success' -- which generic assertion to run after
 * the last action (see ASSERTIONS in run.spec.js). Leave as 'manual' if
 * you'd rather just eyeball the screenshot instead of auto-asserting.
 */

module.exports = [
  {
    id: 'TC-001',
    suite: 'Location Management',
    type: 'Negative',
    title: 'Reject a second Head location',
    actions: [
      { type: 'goto', path: '/locations' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Type
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_type"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:last-child .ag-cell[col-id="location_type"] .ag-picker-field-wrapper',
      },
      { type: 'click', selector: '.ag-list-item:has-text("Head")' },

      // 2. Location Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="name"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: 'Second HQ' },

      // 3. Address
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="address"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: '2 Main St' },

      // 4. City
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="city"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: 'Laval' },

      // 5. Province
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="province"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: 'QC' },

      // 6. Postal Code
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="postal_code"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: 'H2B 2B2' },

      // 7. Phone Number(s)
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="phone_numbers"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: '555-444-3322' },

      // 8. Website
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="web_address"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'https://SecondHqCscs.ca',
      },

      // 9. Capacity
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="capacity"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="capacity"] input',
        value: '50',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
    ],
    expect: 'error',
  },
  // {
  //   id: 'TC-002',
  //   suite: 'Location Management',
  //   type: 'Positive',
  //   title: 'Create a Branch location',
  //   actions: [
  //     { type: 'goto', path: '/locations' },
  //     { type: 'click', selector: 'text=Add record' },
  //     { type: 'fill', selector: '[name="name"]', value: 'West Branch' },
  //     { type: 'fill', selector: '[name="address"]', value: '3 Main St' },
  //     { type: 'fill', selector: '[name="city"]', value: 'Laval' },
  //     { type: 'fill', selector: '[name="province"]', value: 'QC' },
  //     { type: 'fill', selector: '[name="postal_code"]', value: 'H3C3C3' },
  //     { type: 'select', selector: '[name="location_type"]', value: 'Branch' },
  //     { type: 'fill', selector: '[name="capacity"]', value: '40' },
  //     { type: 'click', selector: 'text=Save changes' },
  //   ],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-003',
  //   suite: 'Location Management',
  //   type: 'Negative',
  //   title: 'Reject promoting a Branch to Head',
  //   actions: [
  //     { type: 'goto', path: '/locations' },
  //     { type: 'click', selector: 'text=West Branch' },
  //     { type: 'select', selector: '[name="location_type"]', value: 'Head' },
  //     { type: 'click', selector: 'text=Save changes' },
  //   ],
  //   expect: 'error',
  // },

  // // TC-004 .. TC-028: same shape, ported from the Excel's Suite/Title/Type
  // // columns with `actions: []` left for you to fill in using the pattern
  // // above. Run `node e2e/list-remaining.js` to print the ones still empty.
  // {
  //   id: 'TC-004',
  //   suite: 'Personnel Management',
  //   type: 'Negative',
  //   title: 'Reject overlapping personnel assignment',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-005',
  //   suite: 'Personnel Management',
  //   type: 'Positive',
  //   title: 'Accept a sequential personnel assignment',
  //   actions: [],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-006',
  //   suite: 'Family Member Management',
  //   type: 'Negative',
  //   title: 'Reject overlapping family member assignment',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-007',
  //   suite: 'Family Member Management',
  //   type: 'Positive',
  //   title: 'Accept a sequential family member assignment',
  //   actions: [],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-008',
  //   suite: 'Family Member Management',
  //   type: 'Negative',
  //   title: "Reject deleting a minor's only family relation",
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-009',
  //   suite: 'Family Member Management',
  //   type: 'Positive',
  //   title: 'Accept removing one of two relations when another remains active',
  //   actions: [],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-010',
  //   suite: 'Family Member Management',
  //   type: 'Negative',
  //   title: "Reject end-dating a minor's last active relation",
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-011',
  //   suite: 'Club Member Management',
  //   type: 'Negative',
  //   title: 'Reject registering a club member under age 4',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-012',
  //   suite: 'Club Member Management',
  //   type: 'Negative',
  //   title: 'Reject registering a member at a full-capacity location',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-013',
  //   suite: 'Club Member Management',
  //   type: 'Positive',
  //   title: 'Accept a valid club member registration',
  //   actions: [],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-014',
  //   suite: 'Club Member Management',
  //   type: 'Negative',
  //   title: 'Reject transferring a member into a full location',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-015',
  //   suite: 'Team Formation Management',
  //   type: 'Positive',
  //   title: 'Accept the first formation in a new session',
  //   actions: [],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-016',
  //   suite: 'Team Formation Management',
  //   type: 'Positive',
  //   title: 'Accept a second same-category formation in the same session',
  //   actions: [],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-017',
  //   suite: 'Team Formation Management',
  //   type: 'Negative',
  //   title: 'Reject a different-category formation in the same session',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-018',
  //   suite: 'Team Formation Management',
  //   type: 'Negative',
  //   title: 'Reject a third formation in the same session',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-019',
  //   suite: 'Formation Assignment (Roster)',
  //   type: 'Negative',
  //   title: 'Reject assigning a member from a different location',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-020',
  //   suite: 'Formation Assignment (Roster)',
  //   type: 'Negative',
  //   title: 'Reject assigning a member of the wrong gender',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-021',
  //   suite: 'Formation Assignment (Roster)',
  //   type: 'Negative',
  //   title: 'Reject a same-day assignment under 3 hours apart',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-022',
  //   suite: 'Formation Assignment (Roster)',
  //   type: 'Positive',
  //   title: 'Accept a same-day assignment at least 3 hours apart',
  //   actions: [],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-023',
  //   suite: 'Formation Assignment (Roster)',
  //   type: 'Negative',
  //   title: 'Reject assigning a minor with no active family relation',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-024',
  //   suite: 'Formation Assignment (Roster)',
  //   type: 'Negative',
  //   title: 'Reject assigning a member with unpaid fees',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-025',
  //   suite: 'Formation Assignment (Roster)',
  //   type: 'Positive',
  //   title: 'Accept assigning a paid-up, eligible member',
  //   actions: [],
  //   expect: 'success',
  // },
  // {
  //   id: 'TC-026',
  //   suite: 'FIFA Participation',
  //   type: 'Negative',
  //   title: 'Reject logging an unpaid member as a FIFA participant',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-027',
  //   suite: 'FIFA Participation',
  //   type: 'Negative',
  //   title: 'Reject logging a minor with no active family relation',
  //   actions: [],
  //   expect: 'error',
  // },
  // {
  //   id: 'TC-028',
  //   suite: 'FIFA Participation',
  //   type: 'Positive',
  //   title: 'Accept logging a paid-up, eligible member',
  //   actions: [],
  //   expect: 'success',
  // },
];
