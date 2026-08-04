# Comp 353 - Main Project

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
    [String] Gender (Boy, Girl),
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
    -- Gender is new: required to enforce "all players in a formation must be
    -- all-boys or all-girls" -- wasn't needed until team formations existed
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

SESSION (
    [Int] SessionID PK AUTO_INCREMENT,
    [DateTime] SessionDateTime,
    [String] Address,
    [String] Type (Training, Game)
    -- one Session has exactly 2 TEAM_FORMATION rows
    -- NOT enforceable via FK/PK alone -- check via trigger or app logic
)

TEAM_FORMATION (
    [Int] FormationID PK AUTO_INCREMENT,
    [String] TeamName,
    [String] Score (NULL = session in the future),
    [Int] LID FK -> LOCATION(LID),
    -- implements BELONGS_TO: every team tied to one location
    [Int] SessionID FK -> SESSION(SessionID),
    -- implements IN_SESSION: two formations per session, same or different LID
    [Int] CoachMedCard FK -> PERSONNEL(MedCard)
    -- implements COACHED_BY: Employee only (per mainProject-details.md --
    -- description never names FamilyMember as an eligible coach)
    -- Business rule, not enforced by FK: all players assigned to this
    -- formation must share Gender, and must be CLUB_MEMBER.LID = this.LID
)

TEAM_FORMATION_ASSIGNMENT (
    [Int] FormationID FK -> TEAM_FORMATION(FormationID),
    [Int] CMN FK -> CLUB_MEMBER(CMN),
    [String] Role (Goalkeeper, RightFullback, LeftFullback, CenterBack,
                    CenterBackSweeper, DefendingMidfielder, RightMidfielder,
                    CentralMidfielder, Striker, AttackingMidfielder, LeftWinger),
    PK (FormationID, CMN)
    -- Business rule, not enforced by FK: a CMN cannot be assigned to two
    -- formations on the same day unless their SessionDateTime start times
    -- are >= 3 hours apart -- enforced via trigger (see TRIGGER-1)
)

EMAIL_LOG (
    [Int] EmailID PK AUTO_INCREMENT,
    [Date] EmailDate,
    [String] Subject,
    [String] BodySnippet (max 100 chars),
    [Int] CMN FK -> CLUB_MEMBER(CMN),
    -- implements SENT_TO: the receiving club member
    [Int] FormationID FK -> TEAM_FORMATION(FormationID)
    -- implements ABOUT: the formation/session this email describes
    -- SenderLocation is NOT a stored column -- derive via
    -- FormationID -> TEAM_FORMATION.LID -> LOCATION.Name at query time
    -- Subject/BodySnippet ARE stored (not derived) -- log must freeze what
    -- was actually sent, independent of later edits to formation/coach data
)
```
