# Comp 353 - Main Project

## Normalization Analysis: BCNF and 3NF

This document answers project items 4 and 5:

4. Are all your relations in the database in BCNF? (Explain which ones and why not)
5. For any relation in your database, if it is not in BCNF, then show that it is in 3NF.

It builds directly on the relations and keys already established in
[`CSCS-DATABASE_RELATIONS.md`](./CSCS-DATABASE_RELATIONS.md) and
[`schema_report.md`](./schema_report.md) (item 3), and on the schema in
[`../sql/01_schema.sql`](../sql/01_schema.sql).

### Method and assumptions

For each relation we list its attributes, every candidate key (the declared
`PRIMARY KEY` plus any `UNIQUE` constraint that is `NOT NULL`), and every
non-trivial functional dependency (FD) implied either by a key/uniqueness
constraint or by an explicit business rule from the project description. A
relation is in **BCNF** iff, for every non-trivial FD `X -> A`, `X` is a
superkey. It is in **3NF** iff, for every non-trivial FD `X -> A`, either `X`
is a superkey **or** `A` is a prime attribute (part of some candidate key).
BCNF implies 3NF, so any relation shown to satisfy BCNF automatically
satisfies 3NF as well.

Two deliberate scoping decisions, both explained in detail after the table:

- We do **not** treat `PostalCode -> City, Province` as a functional
  dependency of this database, even though it is true in the real world.
  No table declares a uniqueness constraint on postal code, and the project
  description does not model postal codes through a canonical reference
  table, so nothing in the schema requires or enforces that dependency.
- `EmailLog` looks, at first glance, like `formation_id -> subject` holds
  (the subject text is derived from `TeamFormation`/`Session` data). We show
  below why this is **not** actually a functional dependency of the stored
  relation, because of how the log table is used.

`UNIQUE` columns that also allow `NULL` (e.g. `ClubMember.ssn`,
`ClubMember.medicare_number`) are noted as candidate keys "when populated" —
MySQL permits multiple `NULL`s under `UNIQUE`, so strictly speaking they are
not candidate keys in the classical (never-null) sense. This distinction is
noted for completeness but never changes a BCNF verdict below, because the
always-populated surrogate key of each such table is already sufficient to
determine every other attribute.

### Per-relation analysis

At a glance — every relation is in BCNF; see below for the candidate keys,
FDs, and reasoning behind each verdict.

| # | Relation | BCNF? |
|---|----------|:-----:|
| 1 | `Location` | Yes |
| 2 | `LocationPhone` | Yes |
| 3 | `Personnel` | Yes |
| 4 | `PersonnelAssignment` | Yes |
| 5 | `FamilyMember` | Yes |
| 6 | `FamilyMemberAssignment` | Yes |
| 7 | `ClubMember` | Yes |
| 8 | `ClubMemberFamilyRelation` | Yes |
| 9 | `Hobby` | Yes |
| 10 | `ClubMemberHobby` | Yes |
| 11 | `Payment` | Yes |
| 12 | `FIFAGame` | Yes |
| 13 | `FIFAParticipation` | Yes |
| 14 | `Session` | Yes |
| 15 | `TeamFormation` | Yes |
| 16 | `TeamFormationAssignment` | Yes |
| 17 | `EmailLog` | Yes |

---

**1. `Location`**
- Candidate keys: `{location_id}`, `{name}`
- FDs: `location_id -> {all other attrs}`; `name -> {all other attrs}`
- Why BCNF: every FD's LHS is a candidate key.

**2. `LocationPhone`**
- Candidate key: `{location_id, phone_number}`
- FDs: none beyond the key (all-key relation)
- Why BCNF: trivially — all-key relations have no non-trivial FDs.

**3. `Personnel`**
- Candidate keys: `{personnel_id}`, `{ssn}`
- FDs: `personnel_id -> {all other attrs}`; `ssn -> {all other attrs}`
- Why BCNF: both determinants are candidate keys.

**4. `PersonnelAssignment`**
- Candidate keys: `{assignment_id}`, `{personnel_id, location_id, start_date}`
- FDs: `assignment_id -> {personnel_id, location_id, start_date, end_date}`;
  `{personnel_id, location_id, start_date} -> {assignment_id, end_date}`
- Why BCNF: a `personnel_id`/`location_id` pair alone does **not** determine
  `start_date` — the spec explicitly allows a person to return to the same
  location in a later stint (e.g. Roger Smith at Montréal) — so there is no
  partial dependency to worry about.

**5. `FamilyMember`**
- Candidate keys: `{family_member_id}`, `{ssn}`
- FDs and reasoning: same pattern as `Personnel` (#3).

**6. `FamilyMemberAssignment`**
- Candidate keys: `{assignment_id}`, `{family_member_id, location_id, start_date}`
- FDs and reasoning: same pattern as `PersonnelAssignment` (#4).

**7. `ClubMember`**
- Candidate keys: `{membership_number}`; `{ssn}` and `{medicare_number}` when populated
- FDs: `membership_number -> {all other attrs}` (and `ssn`, `medicare_number`
  likewise, when non-null)
- Why BCNF: `location_id` is fully determined by `membership_number`
  (current location only, per spec); it does not itself determine anything
  else.

**8. `ClubMemberFamilyRelation`**
- Candidate keys: `{relation_id}`, `{membership_number, family_member_id, start_date}`
- FDs: `relation_id -> {all other attrs}`;
  `{membership_number, family_member_id, start_date} -> {relation_id, relationship_type, family_member_type, end_date}`
- Why BCNF: a `(membership_number, family_member_id)` pair alone is **not**
  unique — the relationship (and its Primary/Secondary status) is tracked
  per time period, since a minor can be re-associated with different family
  members over time — so there is no partial dependency from a proper
  subset of the natural key.

**9. `Hobby`**
- Candidate keys: `{hobby_id}`, `{hobby_name}`
- FDs: `hobby_id -> hobby_name`; `hobby_name -> hobby_id`
- Why BCNF: both determinants are candidate keys.

**10. `ClubMemberHobby`**
- Candidate key: `{membership_number, hobby_id}`
- FDs: none beyond the key (all-key relation)
- Why BCNF: trivially — all-key relation.

**11. `Payment`**
- Candidate keys: `{payment_id}`, `{membership_number, membership_year, installment_number}`
- FDs: `payment_id -> {all other attrs}`;
  `{membership_number, membership_year, installment_number} -> {payment_id, payment_date, amount, payment_method}`
- Why BCNF: no proper subset of the natural key (e.g.
  `{membership_number, membership_year}` alone) determines any other
  attribute, since a member can make up to 4 differently-dated,
  differently-sized installments in the same year.

**12. `FIFAGame`**
- Candidate key: `{game_id}`
- FDs: `game_id -> {all other attrs}`
- Why BCNF: single candidate key, so BCNF holds automatically once no other
  attribute-to-attribute dependency exists — and none does:
  `team_score`/`opponent_score`/`team_name`/`opponent_name`/`game_date`
  don't determine each other.

**13. `FIFAParticipation`**
- Candidate key: `{game_id, membership_number}`
- FDs: none beyond the key (all-key relation)
- Why BCNF: trivially — all-key relation.

**14. `Session`**
- Candidate key: `{session_id}`
- FDs: `session_id -> {session_datetime, address, session_type}`
- Why BCNF: single candidate key; nothing else is unique enough to be a
  determinant (two sessions could coincidentally share a
  datetime/address/type).

**15. `TeamFormation`**
- Candidate key: `{formation_id}`
- FDs: `formation_id -> {all other attrs}`
- Why BCNF: single candidate key. Note `(session_id, location_id)` is
  **not** a key: the spec explicitly allows both of a session's two
  `TeamFormation`s to share a `location_id` (an intra-club scrimmage), so no
  smaller determinant exists.

**16. `TeamFormationAssignment`**
- Candidate key: `{formation_id, membership_number}`
- FDs: `{formation_id, membership_number} -> role`
- Why BCNF: the only non-trivial FD is a full (not partial) dependency on
  the whole composite key — `role` is specific to a member's participation
  in one specific formation, not derivable from `formation_id` or
  `membership_number` alone.

**17. `EmailLog`**
- Candidate key: `{email_id}`
- FDs: `email_id -> {all other attrs}`
- Why BCNF: see the deep dive below; `formation_id -> subject` is **not** a
  valid FD of this relation.

### Conclusion for item 4

**Every relation in the database is in BCNF.** No relation requires the
weaker BCNF-vs-3NF distinction from item 5 to be invoked, because no
violation was found. Item 5 ("for any relation not in BCNF...") is therefore
vacuously satisfied — there is nothing to decompose or additionally justify.

That said, we deliberately stress-tested the schema for the two situations
that most commonly produce a "3NF but not BCNF" relation, to make sure we
weren't missing one:

### Deep dive #1 — why `EmailLog.subject` is *not* a BCNF violation

At first glance, `EmailLog` looks suspicious: the email `subject` is built
entirely from `TeamFormation.team_name` and `Session.session_datetime` (see
the spec's example, `"Montreal Group 6 Saturday 18-July-2026 2:00 PM
training session"`), both of which are reachable via `formation_id`. If
`formation_id -> subject` really held as a functional dependency, `subject`
would be a non-prime attribute transitively dependent on a non-key
attribute — a violation of *both* BCNF and 3NF (the "A is prime" 3NF
exception would not save it, since `subject` is not part of any candidate
key), which would mean the log table needs decomposing.

It doesn't, because a functional dependency must hold across **every valid
state of the relation over time**, and `EmailLog` is explicitly a **write-once
audit log**: per the schema's own documentation, "subject/body_snippet are
stored as sent (audit trail), not re-derived if the formation is edited
later." If `TeamFormation.team_name` or `Session.session_datetime` is edited
*after* an email was logged, a later email referencing the *same*
`formation_id` will legitimately log a *different* `subject`. Two rows can
therefore share a `formation_id` while disagreeing on `subject` — which is
precisely what it means for `formation_id -> subject` to **not** hold. This
is the standard justification for the common "audit/log/history table"
pattern (the same reasoning that lets an invoice line item freeze a
product's price at time of purchase without violating normalization):
storing a point-in-time snapshot is not the same as storing a functionally
dependent value.

### Deep dive #2 — why `PostalCode -> City, Province` is out of scope

`Location`, `Personnel`, `FamilyMember`, and `ClubMember` all repeat the
`{address, city, province, postal_code}` attribute group. In the real world,
a postal code determines its city and province, which is the textbook
example of a BCNF-violating FD hiding among address fields. We chose **not**
to model this as a functional dependency of our database, for two reasons:
(1) no table declares a uniqueness constraint on `postal_code` — the schema
doesn't assert it as a key of anything, and multiple locations legitimately
share a postal code (e.g. two branches in the same building); (2) the
project specification never introduces a canonical postal-code reference
entity, so treating it as an enforced FD would require inventing a
`PostalCode(code, city, province)` lookup table the spec doesn't ask for,
purely to satisfy a real-world fact the application never actually relies
on. If a future requirement needed to guarantee postal-code consistency,
the fix would be exactly that extra reference table — noted here so the
trade-off is explicit rather than silently assumed away.

### Summary

| Item | Result |
|------|--------|
| 4. All relations in BCNF? | **Yes**, all 17 relations. |
| 5. Non-BCNF relations shown to be 3NF? | N/A — no relation fails BCNF, so item 5's premise doesn't arise. Two candidate violations (`EmailLog`, postal code) were investigated and shown not to be real FDs of this schema. |
