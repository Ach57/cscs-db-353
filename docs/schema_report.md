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

## Foreign Keys

| Table                    | Foreign Key         | References   |
| ------------------------ | ------------------- | ------------ |
| PersonnelAssignment      | `personnel_id`      | Personnel    |
| PersonnelAssignment      | `location_id`       | Location     |
| FamilyMemberAssignment   | `family_member_id`  | FamilyMember |
| FamilyMemberAssignment   | `location_id`       | Location     |
| ClubMember               | `location_id`       | Location     |
| ClubMemberFamilyRelation | `membership_number` | ClubMember   |
| ClubMemberFamilyRelation | `family_member_id`  | FamilyMember |
| ClubMemberHobby          | `membership_number` | ClubMember   |
| ClubMemberHobby          | `hobby_id`          | Hobby        |
| Payment                  | `membership_number` | ClubMember   |
| FIFAParticipation        | `membership_number` | ClubMember   |
| FIFAParticipation        | `game_id`           | FIFAGame     |
| LocationPhone            | `location_id`       | Location     |

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

## Main Data Types

| Data Type       | Purpose                                                        |
| --------------- | -------------------------------------------------------------- |
| `INT`           | Primary and foreign keys                                       |
| `VARCHAR`       | Names, addresses, emails, phone numbers, SSN, Medicare numbers |
| `DATE`          | Birth dates, assignment dates, payment dates, game dates       |
| `DECIMAL(10,2)` | Payment amounts                                                |
| `DECIMAL(5,2)`  | Height and weight                                              |
| `ENUM`          | Personnel role, mandate, payment method                        |
