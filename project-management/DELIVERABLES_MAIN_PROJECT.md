# CSCS Main Project — What we must deliver

Extends the warm-up (`cscs-db`) schema. Same domain, but now: GUI, triggers,
automated emails, and 22 numbered SQL requirements (CRUD + reporting) instead
of 8 static queries. Demo is live, on an AITS lab PC, all members present.

## Deliverables

1. **`E/R diagram`** — updated/extended from warm-up. No UML. Must show
   keys, FDs, cardinalities. Note in the report any constraint the ERD can't
   express (e.g. the 3-hour formation conflict rule, boys/girls team
   homogeneity — these are business rules enforced in code/triggers, not the
   diagram).
2. **`E/R → Relations conversion`** — functional dependencies per relation,
   PK + candidate/alternate keys explicitly listed.
3. **`Normalization writeup`** — show 3NF for every relation. For each one,
   state whether it's in BCNF; if not, explain why and show it's still 3NF
   (decomposition discussion if relevant).
4. **`SQL DDL`** — extends `01_schema.sql` from warm-up with:
   - `Team`, `TeamFormation` (session date/time, address, score, location, boys/girls flag)
   - `TeamFormationAssignment` (club member, formation, role, head coach FK)
   - `FIFAGame`, `FIFAParticipation`
   - `EmailLog`
5. **`SQL DML`** — "sufficient representative tuples" per relation (spec is
   looser than warm-up's ≥10/table, but keep ≥10 as our internal floor so
   every query below returns ≥5 rows, per submission requirement).
6. **`22 SQL operations (1–22)`**, numbered/commented, split into 3 buckets:
   - **1–7: CRUD/transactions** — Create/Delete/Edit/Display Location,
     Personnel, FamilyMember, ClubMember, TeamFormation; assign/delete/edit
     a member to a formation (including the _rejected_ conflicting-assignment
     test case); make a payment.
   - **8–19: reporting queries** — joins/aggregation/subqueries per spec
     (FIFA participation, active/inactive derivation, coach lookups,
     role-based reports, win/loss, etc.)
   - **20–22: system behaviors** — trigger demonstration, integrity-constraint
     demonstration (conflict rejection), email generation + log demonstration.
7. **`Trigger(s)`** — at minimum, reject a formation assignment if the same
   club member is already assigned to another formation same day with <3hrs
   gap. Document rationale in report.
8. **`Weekly email job`** — runs conceptually "every Sunday" for the coming
   week's sessions; populates `EmailLog`. Doesn't need a real scheduler for
   the demo — a script/endpoint that generates the batch is enough, but the
   log table and email content format (subject/body spec) must be exact.
9. **`GUI (web interface)`** — CRUD screens for 1–7 minimum, plus a way to
   trigger/display 8–22. Graded on Functionality/Clarity/Simplicity — doesn't
   need to be fancy, needs to be clean and demo-able on a lab PC.
10. **`PDF report`** — cover page (Group ID, Team ID from AITS, student IDs +
    names), signed originality form, CONTRIBUTIONS section (per-member,
    specific — this is graded per-person), assumptions, E/R diagram, E/R→relation
    conversion + FDs + keys, normalization/BCNF analysis, DDL, all 22
    operations with ≥5 tuples of result each, trigger explanation, GUI
    screenshots.

## Key modeling traps (extends warm-up's list)

- Formation conflict rule (**<3hr gap same day**) applies per club member
  across _all_ their formation assignments — this is a cross-row constraint,
  not enforceable with a simple CHECK; needs a trigger (BEFORE INSERT/UPDATE).
- Boys/girls teams cannot mix within one formation — validate at
  assignment time, not just at team creation.
- "Active club member" (from warm-up: prior year's fees fully paid) is now a
  _precondition_ for game/activity participation — queries that touch
  FIFA participation or formation assignment should implicitly respect this,
  don't let inactive members show up in "who won a game" type reports.
- General manager of the **head** location = the club president — model as
  a role value + location-type constraint, not a separate entity.
- Personnel `role` is exclusive at any given time (one role at a time) — same
  time-based pattern as the location-history table from the warm-up.
- Head coach on a `TeamFormation` must themselves be Personnel (or a family
  member acting as coach — spec Q17 explicitly allows family members to be
  head coaches) — don't hard-FK head coach to Personnel only.
- `EmailLog` body is truncated to first 100 chars — store full body
  separately if you want to actually send/preview it, log table only needs
  the 100-char snapshot per spec.
- AITS connection verification is graded standalone (5 pts) — GUI/backend
  must literally connect to the AITS MySQL instance during demo, not a local
  copy.

## Repo structure (extends warm-up)

```bash
cscs-db/
├── README.md
├── docs/
│   ├── er-diagram.png
│   └── report/
├── sql/
│   ├── 01_schema.sql        # extended: +Team, TeamFormation, Assignment, FIFA*, EmailLog
│   ├── 02_seed.sql
│   ├── 03_operations.sql    # 1-22, numbered/commented (renamed from 03_queries.sql)
│   ├── 04_verify.sql
│   └── 05_trigger.sql       # trigger definitions, isolated for review
├── app/
│   ├── backend/             # AITS connection, CRUD + reporting endpoints
│   └── frontend/            # GUI
└── .gitignore
```

## Workflow/tickets (new sprint, builds on warm-up sprint)

1. ERD-3: Extend ERD with Team/TeamFormation/Assignment/FIFA\*/EmailLog,
   resolve conflict-rule & boys/girls constraints as design decisions
2. NORM-1: 3NF/BCNF pass on every relation (old + new), write justification
3. DDL-3: Extend schema.sql with new tables/constraints
4. TRIGGER-1: Write + test the formation-conflict trigger
5. SEED-2: Extend seed data to cover FIFA games, formations, emails
6. OPS-1..7: CRUD/transaction tickets (one each, since they map directly to GUI screens)
7. QUERY-8..19: One ticket per report query, independent, same as warm-up pattern
8. EMAIL-1: Email generation + log demonstration
9. GUI-1..N: One ticket per screen (Location, Personnel, FamilyMember,
   ClubMember, TeamFormation, Assignment, Payment, reports view)
10. INTEGRITY-1: Demo script proving the conflict rejection (Q21)
11. REPORT-2: Assemble final PDF — assumptions, ERD, FD/keys, normalization,
    DDL, all 22 ops w/ ≥5 result rows each, trigger explanation, GUI screenshots
12. DEMO-PREP: Verify AITS connection from a lab PC before demo day

## Grading weight (for prioritization — from official evaluation sheet)

- **Design/report (45 pts):** Conceptual E/R design 10, E/R→Relations 5,
  Normalization 5, Sample data 5, Organization & Report 15, GUI demo 5
- **Implementation (35 pts):** AITS connection 5, ops batches (5+5+5), trigger 5,
  integrity 5, emails 5, bonus 1
- **Individual (per member, /20 → /100 total):** contribution is graded
  per-person — CONTRIBUTIONS section needs to be specific and accurate, not
  boilerplate, since uneven participation gets uneven grades.

## Dates

- Report due via Moodle: **August 7, 2026, 23:55**
- Demos: **August 10–11, 2026** (slots posted on Moodle, first-come-first-served)
- All team members must attend the demo and be able to answer questions on
  any part of the system.
