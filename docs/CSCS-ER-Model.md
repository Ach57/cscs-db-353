# Comp 353 - WarmUp Project

## Authors:

## ER Model

```mermaid
flowchart TD

%% ===== ENTITIES =====
LOCATION["<b>LOCATION</b><br/><u>LID</u><br/>Type, Name, Address, City,<br/>Province, PostalCode,<br/>WebAddress, MaxCapacity"]
LOCPHONE(["PhoneNumber<br/>(multivalued)"])

EMPLOYEE["<b>EMPLOYEE</b><br/><u>MedCard</u><br/>SSN (unique, not null),<br/>FirstName, LastName, DOB,<br/>Phone, Address, City, Province,<br/>PostalCode, Email, Role, Mandate"]

MEMBER["<b>FAMILY MEMBER</b><br/><u>MedCard</u><br/>SSN, FirstName, LastName, DOB,<br/>Phone, Address, City, Province,<br/>PostalCode, Email"]

CLUBMEMBER["<b>CLUBMEMBER</b><br/><u>CMN</u><br/>FirstName, LastName, DOB,<br/>Height, Weight, SSN, MedCard,<br/>Phone, Address, City, Province, PostalCode<br/><i>Type(Major/Minor) - derived, not stored</i>"]

HOBBY["<b>HOBBY</b><br/><u>HobbyName</u>"]

PAYMENT["<b>PAYMENT</b><br/><u>PaymentID</u><br/>PaymentDate, Amount,<br/>Method, DateOfPayment"]

FIFAGAME["<b>FIFAGAME</b> (weak entity)<br/><u>GameID</u> (partial key)<br/>Team, Opponent, DateOfGame, FinalScore"]

%% ===== RELATIONSHIPS =====
WORKS_AT{"WORKS_AT<br/>StartDate, EndDate"}
MANAGES{"MANAGES"}
ASSOC_LOC{"ASSOC_WITH<br/>StartDate, EndDate"}
GUARDIAN{"GUARDIAN_OF<br/>Relation, StartDate, EndDate"}
AT_LOC{"CURRENTLY_AT"}
HAS_HOBBY{"HAS_HOBBY"}
MAKES{"MAKES"}
PLAYS{{"PLAYS (identifying)"}}
HELD_AT{"HELD_AT"}

%% ===== EDGES: multivalued attr =====
LOCATION --- LOCPHONE

%% ===== EDGES: WORKS_AT (M:N, Employee<->Location over time) =====
EMPLOYEE --- WORKS_AT
WORKS_AT --- LOCATION

%% ===== EDGES: MANAGES (1:1) =====
LOCATION --> MANAGES
MANAGES --> EMPLOYEE

%% ===== EDGES: ASSOC_LOC (M:N, FamilyMember<->Location over time) =====
MEMBER --- ASSOC_LOC
ASSOC_LOC --- LOCATION

%% ===== EDGES: GUARDIAN_OF (M:N, FamilyMember<->ClubMember over time) =====
MEMBER --- GUARDIAN
GUARDIAN --- CLUBMEMBER

%% ===== EDGES: CURRENTLY_AT (N:1, ClubMember->Location, current only) =====
CLUBMEMBER --- AT_LOC
AT_LOC --> LOCATION

%% ===== EDGES: HAS_HOBBY (M:N) =====
CLUBMEMBER --- HAS_HOBBY
HAS_HOBBY --- HOBBY

%% ===== EDGES: MAKES (1:N, ClubMember->Payment) =====
PAYMENT --- MAKES
MAKES --> CLUBMEMBER

%% ===== EDGES: PLAYS (1:N identifying, ClubMember->FIFAGame) =====
FIFAGAME --- PLAYS
PLAYS --> CLUBMEMBER

%% ===== EDGES: HELD_AT (N:1, FIFAGame->Location) =====
FIFAGAME --- HELD_AT
HELD_AT --> LOCATION
```

**Legend**

- ArrowHead `(-->)` points to the entity on the "1" side of the relationship. (e.g `MEMBER --- GUARDIAN`)
- Plain line `(--)` means M:N relationship have plain lines on both ends. (e.g `MANAGES --> EMPLOYEE`)
- `<u>` Underlined + labeled "(partial key)" = weak entity's partial key (Depends on a strong owner)
- Double-bordered diamond on `PLAYS` = identifying relationship for the weak entity FIFAGAME (it can't exist without a ClubMember).
- `PhoneNumber` on Location is drawn as a multivalued attribute (oval), as a location may have multiple numbers.

**Limitations:**

The EMPLOYEE and MEMBER (family member) are seperate entities with duplicate attribute sets (SSN, name, contact, info, etc). However; if the same physical person is both an employee and a family member, then this will result in duplicate information and there would be no way to inforce the `same SSN = same person`.

- To address this issue, we'll keep them seperate and accept the duplication risk.
