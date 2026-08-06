-- Query (i): Complete details for every location

WITH Phones AS (
    SELECT location_id, GROUP_CONCAT(phone_number SEPARATOR ', ') AS phone_numbers
    FROM LocationPhone
    GROUP BY location_id
),
GM AS (
    SELECT pa.location_id,
           CONCAT(p.first_name, ' ', p.last_name) AS gm_name
    FROM PersonnelAssignment pa
    JOIN Personnel p ON p.personnel_id = pa.personnel_id
    WHERE p.role = 'General Manager'
      AND pa.end_date IS NULL
),
PersonnelCount AS (
    SELECT location_id, COUNT(DISTINCT personnel_id) AS num_personnel
    FROM PersonnelAssignment
    WHERE end_date IS NULL
    GROUP BY location_id
),
MemberCount AS (
    SELECT location_id, COUNT(*) AS num_club_members
    FROM ClubMember
    GROUP BY location_id
),
FifaMemberCount AS (
    SELECT cm.location_id, COUNT(DISTINCT fp.membership_number) AS num_fifa_players
    FROM ClubMember cm
    JOIN FIFAParticipation fp ON fp.membership_number = cm.membership_number
    GROUP BY cm.location_id
)
SELECT
    l.name          AS location_name,
    l.address,
    l.city,
    l.province,
    l.postal_code,
    ph.phone_numbers,
    l.web_address,
    l.location_type,
    l.capacity,
    gm.gm_name       AS general_manager,
    COALESCE(pc.num_personnel, 0)    AS num_personnel,
    COALESCE(mc.num_club_members, 0) AS num_club_members,
    COALESCE(fc.num_fifa_players, 0) AS num_fifa_players
FROM Location l
LEFT JOIN Phones ph           ON ph.location_id = l.location_id
LEFT JOIN GM gm                ON gm.location_id = l.location_id
LEFT JOIN PersonnelCount pc    ON pc.location_id = l.location_id
LEFT JOIN MemberCount mc       ON mc.location_id = l.location_id
LEFT JOIN FifaMemberCount fc   ON fc.location_id = l.location_id
ORDER BY num_club_members ASC;


-- Query (ii): Major club members who played >= 1 FIFA game

WITH AgeCalc AS (
    SELECT membership_number,
           TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age
    FROM ClubMember
),
PrevYearPay AS (
    SELECT membership_number, SUM(amount) AS total_paid
    FROM Payment
    WHERE membership_year = YEAR(CURDATE()) - 1
    GROUP BY membership_number
),
GameCounts AS (
    SELECT membership_number, COUNT(*) AS num_games
    FROM FIFAParticipation
    GROUP BY membership_number
)
SELECT
    l.name AS location_name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    a.age,
    cm.city,
    cm.province,
    CASE WHEN COALESCE(p.total_paid, 0) >= 200 THEN 'Active' ELSE 'Inactive' END AS status,
    g.num_games
FROM ClubMember cm
JOIN AgeCalc a      ON a.membership_number = cm.membership_number
JOIN Location l     ON l.location_id = cm.location_id
JOIN GameCounts g   ON g.membership_number = cm.membership_number
LEFT JOIN PrevYearPay p ON p.membership_number = cm.membership_number
WHERE a.age >= 18
ORDER BY g.num_games ASC;


-- Query (iii): Club members with >= 4 different hobbies

WITH AgeCalc AS (
    SELECT membership_number,
           TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age
    FROM ClubMember
),
PrevYearPay AS (
    SELECT membership_number, SUM(amount) AS total_paid
    FROM Payment
    WHERE membership_year = YEAR(CURDATE()) - 1
    GROUP BY membership_number
),
HobbyCounts AS (
    SELECT membership_number, COUNT(DISTINCT hobby_id) AS num_hobbies
    FROM ClubMemberHobby
    GROUP BY membership_number
    HAVING COUNT(DISTINCT hobby_id) >= 4
)
SELECT
    l.name AS location_name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    a.age,
    cm.city,
    cm.province,
    CASE
        WHEN COALESCE(p.total_paid, 0) >= (CASE WHEN a.age >= 18 THEN 200 ELSE 100 END)
        THEN 'Active' ELSE 'Inactive'
    END AS status,
    h.num_hobbies
FROM ClubMember cm
JOIN AgeCalc a       ON a.membership_number = cm.membership_number
JOIN Location l      ON l.location_id = cm.location_id
JOIN HobbyCounts h   ON h.membership_number = cm.membership_number
LEFT JOIN PrevYearPay p ON p.membership_number = cm.membership_number
ORDER BY a.age DESC, l.name ASC;


-- QUERY-4 (iv) Get all major club members (18+) who have never participated in any FIFA game --
SELECT
    l.name AS location_name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) AS age,
    cm.city,
    cm.province,

    CASE
        WHEN COALESCE((
            SELECT SUM(p.amount)
            FROM Payment p
            WHERE p.membership_number = cm.membership_number
              AND p.membership_year = YEAR(CURDATE()) - 1
        ), 0) >=
        CASE
            WHEN TIMESTAMPDIFF(
                YEAR,
                cm.date_of_birth,
                STR_TO_DATE(
                    CONCAT(YEAR(CURDATE()) - 1, '-12-31'),
                    '%Y-%m-%d'
                )
            ) >= 18
            THEN 200
            ELSE 100
        END
        THEN 'Active'
        ELSE 'Inactive'
    END AS status
FROM ClubMember cm
JOIN Location l
    ON l.location_id = cm.location_id
WHERE TIMESTAMPDIFF(
          YEAR,
          cm.date_of_birth,
          CURDATE()
      ) >= 18
  AND NOT EXISTS (
      SELECT 1
      FROM FIFAParticipation fp
      WHERE fp.membership_number = cm.membership_number
  )
ORDER BY
    location_name ASC,
    age ASC;

-- QUERY-5 (v): total number of club members for every age
SELECT
    TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
    COUNT(*) AS total_club_members
FROM ClubMember
GROUP BY age
ORDER BY age DESC;

-- QUERY-6 (vi): Major members who are also family members
SELECT
    cm.membership_number                         AS member_number,
    CONCAT(cm.first_name, ' ', cm.last_name)      AS member_name,
    child.membership_number                       AS associated_member_number,
    CONCAT(child.first_name, ' ', child.last_name) AS associated_member_name,
    child.date_of_birth                            AS associated_dob,
    child.ssn                                      AS associated_ssn,
    child.medicare_number                          AS associated_medicare_number,
    child.phone_number                             AS associated_phone,
    child.address                                  AS associated_address,
    child.city                                     AS associated_city,
    child.province                                 AS associated_province,
    child.postal_code                              AS associated_postal_code,
    r.relationship_type,
    CASE WHEN r.end_date IS NULL THEN 'Active' ELSE 'Ended' END AS status
FROM ClubMember cm
JOIN FamilyMember fm ON fm.ssn = cm.ssn
JOIN ClubMemberFamilyRelation r ON r.family_member_id = fm.family_member_id
JOIN ClubMember child ON child.membership_number = r.membership_number
WHERE TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) >= 18;


-- QUERY-7 (vii): Fees, major members, 2023-2025
SELECT
    cm.membership_number,
    CONCAT(cm.first_name, ' ', cm.last_name) AS member_name,
    p.membership_year,
    SUM(p.amount) AS total_paid
FROM ClubMember cm
JOIN Payment p ON p.membership_number = cm.membership_number
WHERE TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) >= 18
  AND p.membership_year BETWEEN 2023 AND 2025
GROUP BY cm.membership_number, member_name, p.membership_year
ORDER BY cm.membership_number, p.membership_year;


-- QUERY-8 (viii): Members with >=4 FIFA games (all members)
SELECT
    cm.membership_number,
    CONCAT(cm.first_name, ' ', cm.last_name) AS member_name,
    COUNT(fp.game_id) AS games_played
FROM ClubMember cm
JOIN FIFAParticipation fp ON fp.membership_number = cm.membership_number
GROUP BY cm.membership_number, member_name
HAVING COUNT(fp.game_id) >= 4;


-- QUERY-11: Members with ≥5 FIFA games
USE wqc353_1;

SELECT
    cm.membership_number,
    CONCAT(cm.first_name, ' ', cm.last_name) AS member_name,
    COUNT(fp.game_id) AS games_played,
    MIN(YEAR(fg.game_date)) AS min_year_played,
    MAX(YEAR(fg.game_date)) AS max_year_played
FROM ClubMember cm
JOIN FIFAParticipation fp ON fp.membership_number = cm.membership_number
JOIN FIFAGame fg ON fg.game_id = fp.game_id
GROUP BY cm.membership_number, member_name
HAVING COUNT(fp.game_id) >= 5
ORDER BY games_played DESC;
-- QUERY-9: Primary family members with ≥2 FIFA-participating
USE wqc353_1;

WITH ActiveRelations AS (
    SELECT r.family_member_id, r.membership_number, r.relationship_type
    FROM ClubMemberFamilyRelation r
    WHERE r.end_date IS NULL
),
FifaChildren AS (
    SELECT DISTINCT ar.family_member_id, ar.membership_number
    FROM ActiveRelations ar
    JOIN FIFAParticipation fp ON fp.membership_number = ar.membership_number
),
QualifyingFamilies AS (
    SELECT family_member_id
    FROM FifaChildren
    GROUP BY family_member_id
    HAVING COUNT(DISTINCT membership_number) >= 2
)
SELECT
    fm.first_name AS family_first_name,
    fm.last_name AS family_last_name,
    cm.membership_number,
    cm.first_name AS child_first_name,
    cm.last_name AS child_last_name,
    cm.date_of_birth AS child_dob,
    ar.relationship_type
FROM QualifyingFamilies qf
JOIN FamilyMember fm ON fm.family_member_id = qf.family_member_id
JOIN FifaChildren fc ON fc.family_member_id = qf.family_member_id
JOIN ActiveRelations ar ON ar.family_member_id = fc.family_member_id AND ar.membership_number = fc.membership_number
JOIN ClubMember cm ON cm.membership_number = fc.membership_number
ORDER BY fm.first_name ASC, fm.last_name ASC, cm.membership_number ASC;
-- QUERY-8: Locations with ≥2 FIFA participants
USE wqc353_1;

WITH GM AS (
    SELECT pa.location_id,
           CONCAT(p.first_name, ' ', p.last_name) AS gm_name
    FROM PersonnelAssignment pa
    JOIN Personnel p ON p.personnel_id = pa.personnel_id
    WHERE p.role = 'General Manager'
      AND pa.end_date IS NULL
),
MemberCounts AS (
    SELECT
        location_id,
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) < 18 THEN 1 ELSE 0 END) AS num_minor_members,
        SUM(CASE WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) >= 18 THEN 1 ELSE 0 END) AS num_major_members
    FROM ClubMember
    GROUP BY location_id
),
FifaCounts AS (
    SELECT cm.location_id, COUNT(DISTINCT fp.membership_number) AS num_fifa_participants
    FROM ClubMember cm
    JOIN FIFAParticipation fp ON fp.membership_number = cm.membership_number
    GROUP BY cm.location_id
)
SELECT
    l.name AS location_name,
    l.address,
    l.city,
    l.province,
    l.postal_code,
    l.web_address,
    l.location_type,
    l.capacity,
    gm.gm_name AS general_manager,
    COALESCE(mc.num_minor_members, 0) AS num_minor_members,
    COALESCE(mc.num_major_members, 0) AS num_major_members,
    fc.num_fifa_participants
FROM Location l
JOIN FifaCounts fc ON fc.location_id = l.location_id
LEFT JOIN GM gm ON gm.location_id = l.location_id
LEFT JOIN MemberCounts mc ON mc.location_id = l.location_id
WHERE fc.num_fifa_participants >= 2
ORDER BY fc.num_fifa_participants DESC;
