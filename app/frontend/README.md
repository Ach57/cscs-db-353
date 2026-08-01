# CSCS Database System

A web application for the COMP 353 Main Project (Summer 2026).

The application manages the Country Soccer Club System (CSCS) database through a React + TypeScript frontend and a database backend.

---

# Tech Stack

Frontend
- React
- TypeScript
- Vite
- React Router
- Axios

Backend
- (To be implemented)

Database
- MySQL

---

# Frontend Structure

The frontend is organized according to the project requirements.

```
src
│
├── components
│   └── layout
│       ├── Layout.tsx
│       ├── Navbar.tsx
│       └── Sidebar.tsx
│
├── pages
│   ├── Dashboard
│   ├── Locations
│   ├── Personnel
│   ├── FamilyMembers
│   ├── ClubMembers
│   ├── TeamFormations
│   ├── Payments
│   └── Reports
│
├── router
│   └── AppRouter.tsx
│
└── services
    └── api.ts
```

---

# Page Organization

The pages are based directly on the COMP 353 project requirements.

## Dashboard

Landing page for the application.

Future improvements may include:
- Number of club members
- Number of personnel
- Number of locations
- Upcoming training sessions
- Membership statistics

---

## Management Pages

These correspond to the CRUD operations required by the project.

- Locations
- Personnel
- Family Members
- Club Members
- Team Formations
- Payments

Each page will eventually support:

- Create
- View
- Edit
- Delete

where applicable.

---

## Reports

The project specifies numerous SQL report queries.

Instead of creating a separate page for every report, all reports will be grouped under a single **Reports** page.

The Reports page will allow the user to:

- Select a report
- Enter any required parameters
- Execute the SQL query
- Display the results in a table

---

# Running the Frontend

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

(Assuming `vite.config.ts` has been configured to use port `3000`.)

---

# Required Packages

```bash
npm install react-router-dom axios lucide-react
```

---

# Current Progress

- [x] React + TypeScript project created
- [x] Routing configured
- [x] Layout created
- [x] Navbar created
- [x] Sidebar created
- [x] Dashboard page created

## Remaining

### CRUD Pages

- [ ] Locations
- [ ] Personnel
- [ ] Family Members
- [ ] Club Members
- [ ] Team Formations
- [ ] Payments

### Reports

- [ ] SQL Report Interface

### Backend

- [ ] API Integration
- [ ] Database Connection
- [ ] Authentication (if implemented)

---

# Notes

The frontend is being developed independently of the backend using a modular structure. Once the backend API is complete, the placeholder pages will be connected to their corresponding endpoints using Axios.