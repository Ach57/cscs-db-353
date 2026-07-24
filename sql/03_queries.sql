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