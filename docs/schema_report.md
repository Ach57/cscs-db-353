# Database Schema -- Keys and Data Types

## Primary Keys

| Table                    | Primary Key                               |
| ------------------------ | ----------------------------------------- |
| Location                 | `location_id`                             |
| Personnel                | `personnel_id`                            |
| PersonnelAssignment      | `assignment_id`                           |
| FamilyMember             | `family_member_id`                        |
| FamilyMemberAssignment   | `assignment_id`                           |
| ClubMember               | `membership_number` (AUTO_INCREMENT)      |
| ClubMemberFamilyRelation | (`membership_number`, `family_member_id`) |
| Hobby                    | `hobby_id`                                |
| ClubMemberHobby          | (`membership_number`, `hobby_id`)         |
| Payment                  | `payment_id`                              |
| FIFAGame                 | `game_id`                                 |
| FIFAParticipation        | (`membership_number`, `game_id`)          |
| LocationPhone            | `phone_id`                                |
| Session                  | `session_id`                              |
| TeamFormation            | `formation_id`                            |
| TeamFormationAssignment  | (`formation_id`, `membership_number`)     |
| EmailLog                 | `email_id`                                |

## Foreign Keys

| Table                    | Foreign Key         | References             |
| ------------------------ | ------------------- | ---------------------- |
| PersonnelAssignment      | `personnel_id`      | Personnel              |
| PersonnelAssignment      | `location_id`       | Location               |
| FamilyMemberAssignment   | `family_member_id`  | FamilyMember           |
| FamilyMemberAssignment   | `location_id`       | Location               |
| ClubMember               | `location_id`       | Location               |
| ClubMemberFamilyRelation | `membership_number` | ClubMember             |
| ClubMemberFamilyRelation | `family_member_id`  | FamilyMember           |
| ClubMemberHobby          | `membership_number` | ClubMember             |
| ClubMemberHobby          | `hobby_id`          | Hobby                  |
| Payment                  | `membership_number` | ClubMember             |
| FIFAParticipation        | `membership_number` | ClubMember             |
| FIFAParticipation        | `game_id`           | FIFAGame               |
| LocationPhone            | `location_id`       | Location               |
| TeamFormation            | `location_id`       | Location               |
| TeamFormation            | `session_id`        | Session                |
| TeamFormation            | `personnel_id`      | Personnel (head coach) |
| TeamFormationAssignment  | `formation_id`      | TeamFormation          |
| TeamFormationAssignment  | `membership_number` | ClubMember             |
| EmailLog                 | `membership_number` | ClubMember (receiver)  |
| EmailLog                 | `formation_id`      | TeamFormation (about)  |

## Constraints

- `Personnel.ssn` and `FamilyMember.ssn` are **NOT NULL** and
  **UNIQUE**.
- Medicare numbers are **UNIQUE** for Personnel and FamilyMember.
- Personnel role is restricted using an `ENUM`.
- Personnel mandate is restricted to `Volunteer` or `Salaried`.
- Payment method is restricted to `Cash`, `Debit`, or `Credit`.
- Club member numbers are global `AUTO_INCREMENT` primary keys.
- Foreign keys prevent orphan records.
- `DATE` is used for dates and `DECIMAL(10,2)` for monetary values.
- `ClubMember.gender` is restricted to `Boy` or `Girl` — required to enforce
  formation homogeneity (not previously needed pre-TeamFormation).
- `Session.type` is restricted to `Training` or `Game`.
- `TeamFormationAssignment.role` is restricted to the 11-value `ENUM` from
  the spec (Goalkeeper, RightFullback, LeftFullback, CenterBack,
  CenterBackSweeper, DefendingMidfielder, RightMidfielder,
  CentralMidfielder, Striker, AttackingMidfielder, LeftWinger).
- The following are **business rules, not FK/CHECK-enforceable** — implement
  via trigger or application logic, documented here so they aren't lost:
  - A `Session` must have exactly two `TeamFormation` rows.
  - All members in one `TeamFormation` must share the same `gender`.
  - All members in one `TeamFormation` must belong to that formation's
    `location_id`.
  - A club member can't be assigned to two formations on the same day
    unless start times are ≥3 hours apart (rejected on violation).
  - `EmailLog.subject` / `body_snippet` are stored as sent (audit trail) —
    not re-derived from `TeamFormation` if it's edited later.

## Main Data Types

| Data Type       | Purpose                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| `INT`           | Primary and foreign keys                                                      |
| `VARCHAR`       | Names, addresses, emails, phone numbers, SSN, Medicare numbers                |
| `DATE`          | Birth dates, assignment dates, payment dates, game dates                      |
| `DATETIME`      | Session date/time (needed for the 3-hour gap comparison)                      |
| `DECIMAL(10,2)` | Payment amounts                                                               |
| `DECIMAL(5,2)`  | Height and weight                                                             |
| `ENUM`          | Personnel role, mandate, payment method, gender, session type, formation role |
| `VARCHAR(100)`  | `EmailLog.body_snippet` (hard capped at 100 chars per spec)                   |
