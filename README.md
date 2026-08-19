# A Simple Database Application for the Country Soccer Club System (CSCS)

---

## Application Architecture

```mermaid
flowchart TD

subgraph CLIENT["Frontend — React + Vite"]
    UI["UI Components / Forms"]
    FETCH["API Client (fetch)"]
end

subgraph SERVER["Backend — Node.js + Express (bridge layer)"]
    ROUTES["Routes"]
    VALIDATE["Validation Middleware<br /> Zod"]
    CONTROLLERS["Controllers"]
    SERVICES["Services <br />business logic + SQL"]
    ERRHANDLER["Error Handler — AppError"]
    POOL["mysql2 Connection Pool"]
end

subgraph DB["MySQL — AITS Server"]
    TABLES[("Tables")]
    TRIGGERS{{"Triggers\nBEFORE INSERT / UPDATE / DELETE"}}
end

UI -->|"user submits form"| FETCH
FETCH -->|"HTTP request (JSON)"| ROUTES
ROUTES --> VALIDATE
VALIDATE -->|"shape valid"| CONTROLLERS
VALIDATE -.->|"shape invalid"| ERRHANDLER
CONTROLLERS --> SERVICES
SERVICES -->|"parameterized query"| POOL
POOL --> TABLES
TABLES -.->|"row write attempted"| TRIGGERS
TRIGGERS -->|"constraint satisfied"| TABLES
TRIGGERS -.->|"constraint violated:\nSIGNAL SQLSTATE '45000'"| POOL
TABLES -->|"success"| POOL
POOL -->|"result set"| SERVICES
POOL -.->|"DB error"| SERVICES
SERVICES -->|"200/201 + data"| CONTROLLERS
SERVICES -.->|"throws AppError"| ERRHANDLER
CONTROLLERS -->|"JSON success"| FETCH
ERRHANDLER -.->|"4xx/5xx + message"| FETCH
FETCH -->|"render result"| UI

classDef success stroke:#2e7d32,stroke-width:2px
classDef error stroke:#c62828,stroke-width:2px,stroke-dasharray: 4 2
classDef layer fill:#1F3864,color:#ffffff,stroke:#1F3864

class ROUTES,VALIDATE,CONTROLLERS,SERVICES,POOL layer
class ERRHANDLER error
class TRIGGERS error
```

## Entity Relation Diagram

```mermaid
flowchart TD

%% ===== LOCATION & PERSONNEL =====
subgraph LOC_PERSONNEL["Location & Personnel"]
LOCATION["<b>LOCATION</b><br/><u>LID</u><br/>Type, Name, Address, City,<br/>Province, PostalCode,<br/>WebAddress, MaxCapacity"]
LOCPHONE(["PhoneNumber<br/>(multivalued)"])
EMPLOYEE["<b>EMPLOYEE</b><br/><u>MedCard</u><br/>SSN (unique, not null),<br/>FirstName, LastName, DOB,<br/>Phone, Address, City, Province,<br/>PostalCode, Email, Role, Mandate"]
WORKS_AT{"WORKS_AT<br/>StartDate, EndDate"}
MANAGES{"MANAGES"}
end

%% ===== FAMILY & CLUB MEMBERS =====
subgraph FAMILY_CLUB["Family & Club Members"]
MEMBER["<b>FAMILY MEMBER</b><br/><u>MedCard</u><br/>SSN (unique, not null),<br/>FirstName, LastName, DOB,<br/>Phone, Address, City, Province,<br/>PostalCode, Email"]
CLUBMEMBER["<b>CLUBMEMBER</b><br/><u>CMN</u> (global auto-increment)<br/>FirstName, LastName, DOB,<br/>Height, Weight, SSN, MedCard,<br/>Phone, Address, City, Province, PostalCode<br/><i>Type(Major/Minor) - derived, not stored</i>"]
ASSOC_LOC{"ASSOC_WITH<br/>StartDate, EndDate"}
GUARDIAN{"GUARDIAN_OF<br/>Relation, StartDate, EndDate"}
AT_LOC{"CURRENTLY_AT"}
end

%% ===== HOBBIES & FINANCE =====
subgraph HOBBY_FIN["Hobbies & Finance"]
HOBBY["<b>HOBBY</b><br/><u>HobbyName</u>"]
PAYMENT["<b>PAYMENT</b><br/><u>PaymentID</u><br/>PaymentDate, Amount,<br/>Method(Cash/Debit/Credit),<br/>MembershipYear<br/><i>max 4 installments/year</i>"]
HAS_HOBBY{"HAS_HOBBY"}
MAKES{"MAKES"}
end

%% ===== FIFA =====
subgraph FIFA["FIFA Participation"]
FIFAGAME["<b>FIFAGAME</b><br/><u>GameID</u><br/>Team, Opponent, DateOfGame, FinalScore"]
PARTICIPATES{"PARTICIPATES_IN"}
HELD_AT{"HELD_AT"}
end

%% ===== SESSIONS & FORMATIONS =====
subgraph SESSIONS["Sessions & Team Formations"]
SESSION["<b>SESSION</b><br/><u>SessionID</u><br/>DateTime, Address, Type(Training/Game)"]
TEAMFORMATION["<b>TEAM FORMATION</b><br/><u>FormationID</u><br/>TeamName, Score"]
FORM_LOC{"BELONGS_TO"}
FORM_SESSION{"IN_SESSION"}
FORM_COACH{"COACHED_BY"}
ASSIGNED{"ASSIGNED_TO<br/>Role"}
end

%% ===== EMAIL =====
subgraph EMAIL["Email Notifications"]
EMAILLOG["<b>EMAIL LOG</b><br/><u>EmailID</u><br/>Date, Subject, BodySnippet(100 chars)"]
LOG_RECEIVER{"SENT_TO"}
LOG_FORMATION{"ABOUT"}
end

%% ===== EDGES =====
LOCATION --- LOCPHONE
EMPLOYEE --- WORKS_AT
WORKS_AT --- LOCATION
LOCATION --> MANAGES
MANAGES --> EMPLOYEE

MEMBER --- ASSOC_LOC
ASSOC_LOC --- LOCATION
MEMBER --- GUARDIAN
GUARDIAN --- CLUBMEMBER
CLUBMEMBER --- AT_LOC
AT_LOC --> LOCATION

CLUBMEMBER --- HAS_HOBBY
HAS_HOBBY --- HOBBY
PAYMENT --- MAKES
MAKES --> CLUBMEMBER

CLUBMEMBER --- PARTICIPATES
PARTICIPATES --- FIFAGAME
FIFAGAME --- HELD_AT
HELD_AT --> LOCATION

TEAMFORMATION --- FORM_LOC
FORM_LOC --> LOCATION
TEAMFORMATION --- FORM_SESSION
FORM_SESSION --> SESSION
TEAMFORMATION --- FORM_COACH
FORM_COACH --> EMPLOYEE
CLUBMEMBER --- ASSIGNED
ASSIGNED --- TEAMFORMATION

EMAILLOG --- LOG_RECEIVER
LOG_RECEIVER --> CLUBMEMBER
EMAILLOG --- LOG_FORMATION
LOG_FORMATION --> TEAMFORMATION
```

**Legend**

- `(-->)` points to the entity on the "1" side of the relationship.
- Plain line `(--)` = M:N relationship, plain on both ends.
- `<u>` = primary/partial key. Diamond = relationship (attributes listed on the diamond if it carries data).

---

## Constraints

### Location

- One Head location; any number of Branches.
- Head location must have: General Manager, deputy manager, treasurer, secretary, ≥1 administrator.
- GM of the Head location = President of the club.
- `MaxCapacity` = cap on _active_ club members at that location.

### Employee (Personnel)

- `SSN` unique, **not null**, across all personnel.
- `MedCard` unique across all personnel.
- `Role` ∈ {Administrator, Captain, Coach, Assistant Coach, Other} — GM counts as Administrator.
- `Mandate` ∈ {Volunteer, Salaried}.
- One role at a time.
- One location at a time, but time-based over their career (`WORKS_AT` start/end date; null end = still active) — can return to a prior location in a later stint.

### Family Member

- One location at a time, time-based (`ASSOC_WITH`), same pattern as Employee.
- `Relation` ∈ {Father, Mother, Grandfather, Grandmother, Tutor, Partner, Friend, Other}.
- Can have multiple children as club members.

### Club Member

- `CMN` globally unique, auto-increment — **not** scoped per location.
- Major ≥ 18 years old; Minor = 4–17.
- Minimum age **4** at registration.
- Minor must be linked to ≥1 family member; that link can change over time (`GUARDIAN_OF` is time-based).
- Hobbies optional, must come from the fixed `Hobby` list.
- One location at a time (current only).
- Major/Minor is **derived** from DOB, not stored.

### Payment / Finance

- Annual fee: $100 (minor) / $200 (major).
- Max 4 installments per year.
- Excess over the fee cap in a year → **donation**, derived (`SUM(payment) − cap`), not stored.
- Prior year's fees not fully paid → **inactive**, derived, not stored.
- Inactive members cannot participate in any game or activity — enforced at application/trigger level, not a simple FK.

### FIFA Game

- Per member per game: team played with, opponent, date, location, final score.

### Session / Team Formation

- One session = exactly 2 teams.
- Each team tied to one location; the two teams can share or differ in location.
- All players on a team must be club members from that team's location.
- Roles are drawn from a fixed 11-value list (Goalkeeper, Right/Left fullback, Center back, Center back/sweeper, Defending/holding midfielder, Right midfielder/winger, Central midfielder, Striker, Attacking midfielder, Left winger).
- All players in one formation must be all-boys or all-girls — no mixing.
- Conflict rule: a player can't be assigned to two formations same day unless start times are ≥3 hours apart — violating assignment rejected.

### Email

- Sent every Sunday, for the coming week's sessions.
- Subject: team name + date/time (e.g. "Montreal Group 6 Saturday 18-July-2026 2:00 PM training session").
- Body: member's name + role, coach's name + email, session type, address.
- Log stores: date, sender (location name), receiver, subject, first 100 chars of body.

## Running the application

**Requirements**

- Node Js
- docker
  Using `make` cmd (e.g `make help`)

```bash
General
  help                        Show available targets

Open Application
  open                        Open frontend application

Local DB
  start                       Start MySQL + Adminer (local)
  stop                        Stop local containers
  restart                     Restart local containers
  reset                       Wipe volumes and restart (local)
  logs                        Tail local container logs
  connect                     Open interactive MySQL shell (local)
  queries                     Run sql/03_queries.sql (local)
  verify                      Run sql/04_verify.sql — row counts (local)
  triggers                    Apply sql/05_trigger.sql (local)
  trigger-tests               Run sql/07_trigger_tests.sql PASS/FAIL table (local)
  email-event                 Apply sql/06_email_event.sql (local)
  email-test                  Fire sp_generate_weekly_schedule_emails for next 7 days (local)

Adminer
  adminer-start               Start Adminer → AITS server on :8081
  adminer-stop                Stop remote Adminer

Dev Stack
  dev-start                   Build + start MySQL, Backend, Frontend
  dev-stop                    Stop dev stack
  dev-restart                 Restart dev stack (rebuild images)
  dev-reset                   Wipe volumes + rebuild dev stack
  dev-logs                    Tail all dev services
  dev-logs-backend            Tail backend logs
  dev-logs-frontend           Tail frontend logs

Remote (AITS)
  remote-connect              Open interactive MySQL shell on AITS
  remote-schema               Apply schema to AITS (confirms first)
  remote-seed                 Seed AITS database (confirms first)
  remote-setup                Schema + seed on AITS (confirms first)
  remote-queries              Run sql/03_queries.sql on AITS
  remote-verify               Run sql/04_verify.sql on AITS — row counts
  remote-triggers             Apply sql/05_trigger.sql on AITS (confirms first)
  remote-trigger-tests        Run sql/07_trigger_tests.sql on AITS PASS/FAIL table
  remote-email-event          Apply sql/06_email_event.sql on AITS (confirms first)
  remote-email-test           Fire sp_generate_weekly_schedule_emails on AITS

```
