# Completed frontend sections

This package completes the current flat CRUD implementation for:

- Locations, including multiple phone numbers
- Personnel profiles
- Family-member profiles

## Frontend-only mode

The three sections use `localStorage` by default, so no backend is required.
Data persists after page refresh.

To use real HTTP endpoints later, add this to the Vite environment:

```env
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:5000
```

Expected endpoints:

- `/api/locations`
- `/api/personnel`
- `/api/family-members`

## Reset sample data

Open the browser console and run:

```js
localStorage.removeItem("cscs.locations");
localStorage.removeItem("cscs.personnel");
localStorage.removeItem("cscs.familyMembers");
location.reload();
```

## Not included yet

Personnel location-assignment history and family-member-to-child primary/secondary relationships are separate relational workflows. They depend on location/member selection and should be implemented as detail panels rather than columns in the flat CRUD table.
