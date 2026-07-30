# What we must deliver

1. **`E/R diagram`** -- full schema with cardinality constraints and key attributes underlined
2. **`SQL DDL — CREATE TABLE`** scripts for at least 7 relations (Locations, Personnel, FamilyMembers, ClubMembers, Hobbies, Payments, FIFA_Games + junction/weak-entity tables you'll need)
3. **`SQL DML`** -- populate every table with ≥10 tuples, chosen so each query below returns ≥2 rows
4. **`8 SQL queries (i–viii)`** — joins, aggregation, sorting, subqueries on membership status, FIFA participation, hobbies, donations, etc.
5. **`PDF report`** — originality form cover page, E/R diagram, DDL with keys/types justified, the 8 queries, and SELECT COUNT(\*) output per table

## Key modeling traps to catch early:

- Personnel/FamilyMember location assignment is time-based (start/end date), not a static FK — needs a history table, not a column on Personnel.

- ClubMember↔FamilyMember relationship is also time-based and many-to-many (with a `relationship_type`).

- `"Active/inactive"` status is derived (prior year's fees fully paid), not stored — compute it in queries.

- Donations are derived from payments exceeding the fee cap — no separate donation table needed, compute via `SUM(payment) - fee_cap`.

- Membership number is globally unique, auto-increment — don't scope it per location.

- Hobbies is a clean many-to-many junction table.

## Repo structure

```bash
cscs-db/
├── README.md
├── docs/
│   ├── er-diagram.png (or .drawio/.dbml source)
│   └── report/           # final PDF assembled here
├── sql/
│   ├── 01_schema.sql      # DDL only
│   ├── 02_seed.sql        # sample data, ≥10 rows/table
│   ├── 03_queries.sql     # i–viii, numbered/commented
│   └── 04_verify.sql      # COUNT(*) checks
└── .gitignore
```

Keeping it flat — this is 8 queries and 7-ish tables, not a multi-service app. No ORM, no app layer needed since GUI is optional and not graded heavily. One SQL dialect (MySQL, since that's what AITS hosts) throughout.

## WorkFlow/tickets

We're going to treat this as one sprint.

1. ERD-1: Draft E/R diagram from spec, identify entities/relationships/cardinalities
2. ERD-2: Review ERD as a group — resolve the time-based-association design decision (History tables) before writing SQL
3. DDL-1: Write 01_schema.sql (tables, keys, FKs, constraints — NOT NULL SSN, unique Medicare#, etc.)
4. DDL-2: Peer review schema against spec constraints (checklist: every "must," "cannot," "no two X" in the doc)
5. SEED-1: Write 02_seed.sql — data must be realistic and satisfy every query having ≥2 results
6. QUERY-1..8: One ticket per query (i–viii), each assignee writes + tests their own, since they're independent
7. VERIFY-1: Run 04_verify.sql, capture output for report
8. REPORT-1: Assemble final PDF (ERD + DDL rationale + queries + counts + signed cover page)

Branch per ticket, PR into `develop`, one person merges after a teammate runs the SQL locally to confirm it executes clean.

## Hosting

Since AITS server access is pending, we'll keep `01_schema.sql/02_seed.sql` connection-agnostic (no hardcoded DB name assumptions, no vendor-specific syntax beyond standard MySQL) so the moment we get credentials it's just mysql -u user -p db < 01_schema.sql. No need to block any work on that.
