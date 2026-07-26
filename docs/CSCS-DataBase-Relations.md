# Comp 353 - WarmUp Project

## Authors:

## DataBase Relations

```sql
LOCATION (
    [Int] LID PK,
    [String] Type (Head, Branch),
    [String] Name,
    [String] Address,
    [String] City,
    [String] Province,
    [String] PostalCode,
    [String] WebAddress,
    [Int] MaxCapacity
)

LOCATION_PHONE (
    [Int] LID FK -> LOCATION(LID),
    [String] PhoneNumber,
    PK (LID, PhoneNumber)
)

PERSONNEL (
    [Int] MedCard PK,
    [Int] SSN (NOT NULL, UNIQUE),
    [String] FirstName,
    [String] LastName,
    [Date] DateOfBirth,
    [String] PhoneNumber,
    [String] Address,
    [String] City,
    [String] Province,
    [String] PostalCode,
    [String] EmailAddress,
    [String] Role (GM, DeputyManager, Treasurer, Secretary, Administrator, Captain, Coach, AssistantCoach),
    [String] Mandate (Volunteer, Salaried)
)

PERSONNEL_ASSIGNMENT (
    [Int] AssignmentID PK,
    [Int] MedCard FK -> PERSONNEL(MedCard),
    [Int] LID FK -> LOCATION(LID),
    [Date] StartDate,
    [Date] EndDate (NULL = still active)
)

LOCATION.ManagerMedCard FK -> PERSONNEL(MedCard)
    -- implements the MANAGES relationship (1:1, Location -> current Personnel)
    -- add this column directly onto LOCATION

FAMILY_MEMBER (
    [Int] MedCard PK,
    [Int] SSN,
    [String] FirstName,
    [String] LastName,
    [Date] DateOfBirth,
    [String] PhoneNumber,
    [String] Address,
    [String] City,
    [String] Province,
    [String] PostalCode,
    [String] EmailAddress
)

FAMILY_MEMBER_ASSIGNMENT (
    [Int] AssignmentID PK,
    [Int] MedCard FK -> FAMILY_MEMBER(MedCard),
    [Int] LID FK -> LOCATION(LID),
    [Date] StartDate,
    [Date] EndDate (NULL = still active)
)

CLUB_MEMBER (
    [Int] CMN PK AUTO_INCREMENT,
    [String] FirstName,
    [String] LastName,
    [Date] DateOfBirth,
    [Decimal] Height,
    [Decimal] Weight,
    [Int] SSN,
    [Int] MedCard,
    [String] PhoneNumber,
    [String] Address,
    [String] City,
    [String] Province,
    [String] PostalCode,
    [Int] LID FK -> LOCATION(LID)
    -- implements CURRENTLY_AT (N:1, current location only)
    -- Type (Major/Minor) is DERIVED from DateOfBirth, not stored
)

CLUB_MEMBER_FAMILY (
    [Int] CMN FK -> CLUB_MEMBER(CMN),
    [Int] MedCard FK -> FAMILY_MEMBER(MedCard),
    [Date] StartDate,
    [Date] EndDate (NULL = current),
    [String] Relation (Father, Mother, Grandfather, Grandmother, Tutor, Partner, Friend, Other),
    PK (CMN, MedCard, StartDate)
)

HOBBY (
    [String] HobbyName PK
)

CLUB_MEMBER_HOBBY (
    [Int] CMN FK -> CLUB_MEMBER(CMN),
    [String] HobbyName FK -> HOBBY(HobbyName),
    PK (CMN, HobbyName)
)

PAYMENT (
    [Int] PaymentID PK AUTO_INCREMENT,
    [Int] CMN FK -> CLUB_MEMBER(CMN),
    [Date] PaymentDate,
    [Decimal] Amount,
    [String] Method (Cash, Debit, Credit),
    [Date] MembershipYearCovered
    -- "DateOfPayment" from spec = the year/period the payment covers, renamed for clarity
)

FIFA_GAME (
    [Int] GameID PK,
    [String] Team,
    [String] Opponent,
    [Date] DateOfGame,
    [Int] LID FK -> LOCATION(LID),
    [String] FinalScore
)

FIFA_PARTICIPATION (
    [Int] GameID FK -> FIFA_GAME(GameID),
    [Int] CMN FK -> CLUB_MEMBER(CMN),
    PK (GameID, CMN)
)
```
