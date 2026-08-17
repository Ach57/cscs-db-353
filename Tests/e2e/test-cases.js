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
  {
    id: 'TC-002',
    suite: 'Location Management',
    type: 'Positive',
    title: 'Create a Branch location',
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
      { type: 'click', selector: '.ag-list-item:has-text("Branch")' },

      // 2. Location Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="name"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: 'Third HQ' },

      // 3. Address
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="address"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: '3 Main St' },

      // 4. City
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="city"]',
      },
      { type: 'fill', selector: '.ag-text-field-input', value: 'Blain Ville' },

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
      { type: 'fill', selector: '.ag-text-field-input', value: '555-222-1111' },

      // 8. Website
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="web_address"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'https://ThirdHqCscs.ca',
      },

      // 9. Capacity
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="capacity"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="capacity"] input',
        value: '1',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'success',
  },
  {
    id: 'TC-003',
    suite: 'Location Management',
    type: 'Negative',
    title: 'Reject promoting a Branch to Head',
    actions: [
      { type: 'goto', path: '/locations' },
      { type: 'wait', ms: 800 },

      // 1. Change CSCS West Branch from Branch to Head
      {
        type: 'dblclick',
        selector:
          '.ag-row:has(.ag-cell[col-id="name"]:has-text("CSCS West Branch")) .ag-cell[col-id="location_type"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:has(.ag-cell[col-id="name"]:has-text("CSCS West Branch")) .ag-cell[col-id="location_type"] .ag-picker-field-wrapper',
      },
      { type: 'click', selector: '.ag-list-item:has-text("Head")' },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-004',
    suite: 'Personnel Management',
    type: 'Negative',
    title: 'Reject overlapping personnel assignment',
    actions: [
      { type: 'goto', path: '/people?tab=personnel-assignment' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Personnel ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="personnel_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="personnel_id"] input',
        value: '1',
      },

      // 2. Location ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '2',
      },

      // 3. End Date
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="end_date"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="end_date"] input',
        value: '2026-08-29',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    // 1. End-date the current assignment.
    // 2. Add a new assignment to a different location starting after that end date.
    // 3. Save.
    id: 'TC-005',
    suite: 'Personnel Management',
    type: 'Positive',
    title: 'Accept a sequential personnel assignment',
    actions: [
      { type: 'goto', path: '/people?tab=personnel-assignment' },
      { type: 'wait', ms: 800 },

      // 1. End-date the current assignment
      {
        type: 'dblclick',
        selector:
          '.ag-row:has(.ag-cell[col-id="personnel_id"]:has-text("1")) .ag-cell[col-id="end_date"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:has(.ag-cell[col-id="personnel_id"]:has-text("1")) .ag-cell[col-id="end_date"] input',
        value: '2026-08-20',
      },

      // 2. Add a new assignment
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // Personnel ID — same personnel
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="personnel_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="personnel_id"] input',
        value: '1',
      },

      // Location ID — different location
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '3',
      },

      // End date
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="end_date"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="end_date"] input',
        value: '2026-09-01',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'success',
  },
  {
    id: 'TC-006',
    suite: 'Family Member Management',
    type: 'Negative',
    title: 'Reject overlapping family member assignment',
    actions: [
      { type: 'goto', path: '/people?tab=family-member-assignment' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Family Member ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="family_member_id"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:last-child .ag-cell[col-id="family_member_id"] input',
        value: '1',
      },

      // 2. Location ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '2',
      },

      // 3. End Date
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="end_date"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="end_date"] input',
        value: '2026-08-29',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    // 1. End-date the current assignment.
    // 2. Add a new assignment starting after that end date.
    // 3. Save.
    id: 'TC-007',
    suite: 'Family Member Management',
    type: 'Positive',
    title: 'Accept a sequential family member assignment',
    actions: [
      { type: 'goto', path: '/people?tab=family-member-assignment' },
      { type: 'wait', ms: 800 },

      // 1. End-date the current assignment
      {
        type: 'dblclick',
        selector:
          '.ag-row:has(.ag-cell[col-id="family_member_id"]:has-text("1")) .ag-cell[col-id="end_date"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:has(.ag-cell[col-id="family_member_id"]:has-text("1")) .ag-cell[col-id="end_date"] input',
        value: '2026-08-16',
      },

      // 2. Add a new assignment
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // Family Member ID — same family member
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="family_member_id"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:last-child .ag-cell[col-id="family_member_id"] input',
        value: '1',
      },

      // Location ID — different location
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '3',
      },

      // Start date is automatically populated.

      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="end_date"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="end_date"] input',
        value: '2026-08-29',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'success',
  },
  {
    id: 'TC-008',
    suite: 'Family Member Management',
    type: 'Negative',
    title: "Reject deleting a minor's only family relation",
    actions: [
      { type: 'goto', path: '/people?tab=club-members-family-relation' },
      { type: 'wait', ms: 800 },

      // 1. Delete the first family relation for membership 1
      {
        type: 'click',
        selector:
          '.ag-row:has(.ag-cell[col-id="membership_number"]:has-text("1")) .ag-selection-checkbox',
      },
      {
        type: 'click',
        selector: 'button:text("Delete selected")',
      },
      { type: 'wait', ms: 800 },

      // 2. Delete the remaining family relation for membership 1
      {
        type: 'click',
        selector:
          '.ag-row:has(.ag-cell[col-id="membership_number"]:has-text("1")) .ag-selection-checkbox',
      },
      {
        type: 'click',
        selector: 'button:text("Delete selected")',
      },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-009',
    suite: 'Family Member Management',
    type: 'Positive',
    title: 'Accept removing one of two relations when another remains active',
    actions: [
      { type: 'goto', path: '/people?tab=club-members-family-relation' },
      { type: 'wait', ms: 800 },

      // Select one family relation for membership 2
      {
        type: 'click',
        selector:
          '.ag-row:has(.ag-cell[col-id="membership_number"]:has-text("2")) .ag-selection-checkbox',
      },

      // Delete the selected relation
      {
        type: 'click',
        selector: 'button:text("Delete selected")',
      },
      { type: 'wait', ms: 800 },
    ],
    expect: 'success',
  },
  {
    id: 'TC-010',
    suite: 'Family Member Management',
    type: 'Negative',
    title: "Reject end-dating a minor's last active relation",
    actions: [
      { type: 'goto', path: '/people?tab=club-members-family-relation' },
      { type: 'wait', ms: 800 },

      // End-date the remaining active relation for membership 1
      {
        type: 'dblclick',
        selector:
          '.ag-row:has(.ag-cell[col-id="membership_number"]:has-text("1")) .ag-cell[col-id="end_date"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:has(.ag-cell[col-id="membership_number"]:has-text("1")) .ag-cell[col-id="end_date"] input',
        value: '2026-08-29',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-011',
    suite: 'Club Member Management',
    type: 'Negative',
    title: 'Reject registering a club member under age 4',
    actions: [
      { type: 'goto', path: '/people?tab=club-members' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Location ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '2',
      },

      // 2. First Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="first_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Test',
      },

      // 3. Last Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="last_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Minor',
      },

      // 4. Date of Birth — under 4 years old
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="date_of_birth"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="date_of_birth"] input',
        value: '2022-08-20',
      },

      // 5. Gender
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="gender"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:last-child .ag-cell[col-id="gender"] .ag-picker-field-wrapper',
      },
      {
        type: 'click',
        selector: '.ag-list-item:has-text("Male")',
      },

      // 6. Registration Date
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="registration_date"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:last-child .ag-cell[col-id="registration_date"] input',
        value: '2026-08-17',
      },

      // 7. Height
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="height_cm"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="height_cm"] input',
        value: '100',
      },

      // 8. Weight
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="weight_kg"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="weight_kg"] input',
        value: '15',
      },

      // 9. Phone Number
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="phone_number"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: '514-555-1234',
      },

      // 10. Email
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="email"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'test.minor@example.com',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-012',
    suite: 'Club Member Management',
    type: 'Negative',
    title: 'Reject registering a member at a full-capacity location',
    actions: [
      { type: 'goto', path: '/people?tab=club-members' },
      { type: 'wait', ms: 800 },

      // 1. Move member 1 to location 11
      {
        type: 'dblclick',
        selector:
          '.ag-row:has(.ag-cell[col-id="membership_number"]:has-text("1")) .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:has(.ag-cell[col-id="membership_number"]:has-text("1")) .ag-cell[col-id="location_id"] input',
        value: '11',
      },

      // Save the location change
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },

      // 2. Add another club member
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // Location 11 — already at capacity
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '11',
      },

      // First Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="first_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Capacity',
      },

      // Last Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="last_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Test',
      },

      // Date of Birth
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="date_of_birth"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="date_of_birth"] input',
        value: '2000-01-01',
      },

      // Gender
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="gender"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:last-child .ag-cell[col-id="gender"] .ag-picker-field-wrapper',
      },
      {
        type: 'click',
        selector: '.ag-list-item:has-text("Male")',
      },

      // Registration Date
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="registration_date"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:last-child .ag-cell[col-id="registration_date"] input',
        value: '2026-08-17',
      },

      // Height
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="height_cm"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="height_cm"] input',
        value: '180',
      },

      // Weight
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="weight_kg"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="weight_kg"] input',
        value: '80',
      },

      // Phone
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="phone_number"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: '514-555-9999',
      },

      // Email
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="email"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'capacity.test@example.com',
      },

      // Try to save the second member
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-013',
    suite: 'Club Member Management',
    type: 'Positive',
    title: 'Accept a valid club member registration',
    actions: [
      { type: 'goto', path: '/people?tab=club-members' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Location ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '1',
      },

      // 2. First Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="first_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Valid',
      },

      // 3. Last Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="last_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Member',
      },

      // 4. Date of Birth
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="date_of_birth"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="date_of_birth"] input',
        value: '2000-01-15',
      },

      // 5. Gender
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="gender"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:last-child .ag-cell[col-id="gender"] .ag-picker-field-wrapper',
      },
      {
        type: 'click',
        selector: '.ag-list-item:has-text("Male")',
      },

      // 6. Registration Date
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="registration_date"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:last-child .ag-cell[col-id="registration_date"] input',
        value: '2026-08-17',
      },

      // 7. Height
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="height_cm"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="height_cm"] input',
        value: '180',
      },

      // 8. Weight
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="weight_kg"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="weight_kg"] input',
        value: '80',
      },

      // 9. Phone
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="phone_number"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: '514-555-4321',
      },

      // 10. Email
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="email"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'valid.member@example.com',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'success',
  },
  {
    id: 'TC-014',
    suite: 'Club Member Management',
    type: 'Negative',
    title: 'Reject transferring a member into a full location',
    actions: [
      { type: 'goto', path: '/people?tab=club-members' },
      { type: 'wait', ms: 800 },

      // Transfer the member created in TC-013 to full location 11
      {
        type: 'dblclick',
        selector:
          '.ag-row:has(.ag-cell[col-id="first_name"]:has-text("Valid")) .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:has(.ag-cell[col-id="first_name"]:has-text("Valid")) .ag-cell[col-id="location_id"] input',
        value: '11',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-015',
    suite: 'Team Formation Management',
    type: 'Positive',
    title: 'Accept the first formation in a new session',
    actions: [
      { type: 'goto', path: '/team-formations?tab=formations' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Session ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="session_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="session_id"] input',
        value: '10',
      },

      // 2. Location ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '1',
      },

      // 3. Head Coach ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="head_coach_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="head_coach_id"] input',
        value: '9',
      },

      // 4. Team Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="team_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Boys Team 10',
      },

      // 5. Score
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="score"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="score"] input',
        value: '0',
      },

      // 6. Team Category
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="team_category"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:last-child .ag-cell[col-id="team_category"] .ag-picker-field-wrapper',
      },
      {
        type: 'click',
        selector: '.ag-list-item:has-text("Boys")',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'success',
  },
  {
    id: 'TC-016',
    suite: 'Team Formation Management',
    type: 'Negative',
    title: 'Reject a second Boys formation in the same session',
    actions: [
      { type: 'goto', path: '/team-formations?tab=formations' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Session ID — same session as TC-015
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="session_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="session_id"] input',
        value: '10',
      },

      // 2. Location ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '1',
      },

      // 3. Head Coach ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="head_coach_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="head_coach_id"] input',
        value: '9',
      },

      // 4. Team Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="team_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Second Boys Team',
      },

      // 5. Score
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="score"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="score"] input',
        value: '0',
      },

      // 6. Team Category — same as TC-015
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="team_category"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:last-child .ag-cell[col-id="team_category"] .ag-picker-field-wrapper',
      },
      {
        type: 'click',
        selector: '.ag-list-item:has-text("Boys")',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-017',
    suite: 'Team Formation Management',
    type: 'Negative',
    title: 'Reject a different-category formation in the same session',
    actions: [
      { type: 'goto', path: '/team-formations?tab=formations' },
      { type: 'wait', ms: 800 },

      // Change the existing Boys formation in session 10 to Girls
      {
        type: 'dblclick',
        selector:
          '.ag-row:has(.ag-cell[col-id="session_id"]:has-text("10")) .ag-cell[col-id="team_category"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:has(.ag-cell[col-id="session_id"]:has-text("10")) .ag-cell[col-id="team_category"] .ag-picker-field-wrapper',
      },
      {
        type: 'click',
        selector: '.ag-list-item:has-text("Girls")',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-018',
    suite: 'Team Formation Management',
    type: 'Negative',
    title: 'Reject a third formation in the same session',
    actions: [
      { type: 'goto', path: '/team-formations?tab=formations' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Session ID — same session
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="session_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="session_id"] input',
        value: '10',
      },

      // 2. Location ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="location_id"] input',
        value: '1',
      },

      // 3. Head Coach ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="head_coach_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="head_coach_id"] input',
        value: '9',
      },

      // 4. Team Name
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="team_name"]',
      },
      {
        type: 'fill',
        selector: '.ag-text-field-input',
        value: 'Third Team 10',
      },

      // 5. Score
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="score"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="score"] input',
        value: '0',
      },

      // 6. Team Category
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="team_category"]',
      },
      {
        type: 'click',
        selector:
          '.ag-row:last-child .ag-cell[col-id="team_category"] .ag-picker-field-wrapper',
      },
      {
        type: 'click',
        selector: '.ag-list-item:has-text("Girls")',
      },

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-019',
    suite: 'Formation Assignment (Roster)',
    type: 'Negative',
    title: 'Reject assigning a member from a different location',
    actions: [
      { type: 'goto', path: '/team-formations?tab=assignments' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Formation ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="formation_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="formation_id"] input',
        value: '1',
      },

      // 2. Membership Number — member 25 is from a different location
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="membership_number"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:last-child .ag-cell[col-id="membership_number"] input',
        value: '25',
      },

      // Role defaults to Goalkeeper — leave it unchanged.

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
  {
    id: 'TC-020',
    suite: 'Formation Assignment (Roster)',
    type: 'Negative',
    title: 'Reject assigning a member of the wrong gender',
    actions: [
      { type: 'goto', path: '/team-formations?tab=assignments' },
      { type: 'click', selector: 'button:text("Add record")' },
      { type: 'wait', ms: 800 },

      // 1. Formation ID
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="formation_id"]',
      },
      {
        type: 'fill',
        selector: '.ag-row:last-child .ag-cell[col-id="formation_id"] input',
        value: '21',
      },

      // 2. Membership Number
      {
        type: 'dblclick',
        selector: '.ag-row:last-child .ag-cell[col-id="membership_number"]',
      },
      {
        type: 'fill',
        selector:
          '.ag-row:last-child .ag-cell[col-id="membership_number"] input',
        value: '2',
      },

      // Role defaults to Goalkeeper — leave unchanged.

      // Save
      { type: 'click', selector: 'button:text("Save changes")' },
      { type: 'wait', ms: 800 },
    ],
    expect: 'error',
  },
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
