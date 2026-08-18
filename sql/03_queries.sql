-- QUERY-8
-- Start Query
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
-- End Query

-- QUERY-9
-- Start Query
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
-- End Query

-- QUERY-10
-- Start Query
SET @loc_id     = 1;
SET @start_date = '2026-01-01';
SET @end_date   = '2026-12-31';

SELECT
    p.first_name AS head_coach_first_name,
    p.last_name  AS head_coach_last_name,
    s.session_datetime AS start_time,
    s.address,
    s.session_type,
    tf.team_name,
    tf.score,
    tp.total_players,
    cm.first_name AS player_first_name,
    cm.last_name  AS player_last_name,
    tfa.role
FROM TeamFormation tf
JOIN Session s ON s.session_id = tf.session_id
JOIN Personnel p ON p.personnel_id = tf.head_coach_id
JOIN TeamFormationAssignment tfa ON tfa.formation_id = tf.formation_id
JOIN ClubMember cm ON cm.membership_number = tfa.membership_number
JOIN (
    SELECT formation_id, COUNT(*) AS total_players
    FROM TeamFormationAssignment
    GROUP BY formation_id
) tp ON tp.formation_id = tf.formation_id
WHERE tf.location_id = @loc_id
  AND s.session_datetime BETWEEN @start_date AND @end_date
ORDER BY s.session_datetime ASC, tf.formation_id, cm.last_name;
-- End Query

-- QUERY-11
-- Start Query
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
-- End Query

-- QUERY-12
-- Start Query
SET @start_date = '2025-01-01';
SET @end_date   = '2025-05-31';

WITH TrainingStats AS (
    SELECT
        tf.location_id,
        COUNT(DISTINCT tf.formation_id) AS num_training_sessions,
        COUNT(tfa.membership_number)    AS num_training_players
    FROM TeamFormation tf
    JOIN Session s ON s.session_id = tf.session_id
    LEFT JOIN TeamFormationAssignment tfa ON tfa.formation_id = tf.formation_id
    WHERE s.session_type = 'Training'
      AND DATE(s.session_datetime) BETWEEN @start_date AND @end_date
    GROUP BY tf.location_id
),
GameStats AS (
    SELECT
        tf.location_id,
        COUNT(DISTINCT tf.formation_id) AS num_game_sessions,
        COUNT(tfa.membership_number)    AS num_game_players
    FROM TeamFormation tf
    JOIN Session s ON s.session_id = tf.session_id
    LEFT JOIN TeamFormationAssignment tfa ON tfa.formation_id = tf.formation_id
    WHERE s.session_type = 'Game'
      AND DATE(s.session_datetime) BETWEEN @start_date AND @end_date
    GROUP BY tf.location_id
)
SELECT
    l.name AS location_name,
    COALESCE(ts.num_training_sessions, 0) AS num_training_sessions,
    COALESCE(ts.num_training_players, 0)  AS num_training_players,
    COALESCE(gs.num_game_sessions, 0)     AS num_game_sessions,
    COALESCE(gs.num_game_players, 0)      AS num_game_players
FROM Location l
LEFT JOIN TrainingStats ts ON ts.location_id = l.location_id
LEFT JOIN GameStats gs     ON gs.location_id = l.location_id
WHERE COALESCE(gs.num_game_sessions, 0) >= 4
ORDER BY num_game_sessions DESC;
-- End Query

-- QUERY-13
-- Start Query
WITH PrevYearPay AS (
    SELECT membership_number, SUM(amount) AS total_paid
    FROM Payment
    WHERE membership_year = YEAR(CURDATE()) - 1
    GROUP BY membership_number
),
ActiveMembers AS (
    SELECT cm.membership_number
    FROM ClubMember cm
    LEFT JOIN PrevYearPay p ON p.membership_number = cm.membership_number
    WHERE COALESCE(p.total_paid, 0) >=
          CASE
              WHEN TIMESTAMPDIFF(
                       YEAR, cm.date_of_birth,
                       STR_TO_DATE(CONCAT(YEAR(CURDATE()) - 1, '-12-31'), '%Y-%m-%d')
                   ) >= 18
              THEN 200
              ELSE 100
          END
),
FifaCounts AS (
    SELECT membership_number, COUNT(*) AS num_fifa_games
    FROM FIFAParticipation
    GROUP BY membership_number
)
SELECT
    l.name AS location_name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) AS age,
    cm.phone_number,
    cm.email,
    fc.num_fifa_games
FROM ClubMember cm
JOIN ActiveMembers am ON am.membership_number = cm.membership_number
JOIN FifaCounts fc    ON fc.membership_number = cm.membership_number
JOIN Location l        ON l.location_id = cm.location_id
WHERE NOT EXISTS (
    SELECT 1
    FROM TeamFormationAssignment tfa
    WHERE tfa.membership_number = cm.membership_number
)
ORDER BY location_name ASC, fc.num_fifa_games ASC;
-- End Query

-- QUERY-14
-- Start Query
WITH AgeAtReg AS (
    SELECT
        membership_number,
        TIMESTAMPDIFF(YEAR, date_of_birth, registration_date) AS age_at_registration
    FROM ClubMember
),
PrevYearPay AS (
    SELECT membership_number, SUM(amount) AS total_paid
    FROM Payment
    WHERE membership_year = YEAR(CURDATE()) - 1
    GROUP BY membership_number
)
SELECT
    l.name AS location_name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    CASE WHEN COALESCE(p.total_paid, 0) >= 200 THEN 'Active' ELSE 'Inactive' END AS status,
    cm.registration_date AS date_joined,
    TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) AS age,
    cm.phone_number,
    cm.email
FROM ClubMember cm
JOIN AgeAtReg ar        ON ar.membership_number = cm.membership_number
JOIN Location l          ON l.location_id = cm.location_id
LEFT JOIN PrevYearPay p ON p.membership_number = cm.membership_number
WHERE ar.age_at_registration < 18
  AND TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) >= 18
ORDER BY location_name ASC, age ASC;
-- End Query

-- QUERY-15
-- Start Query
WITH PrevYearPay AS (
    SELECT membership_number, SUM(amount) AS total_paid
    FROM Payment
    WHERE membership_year = YEAR(CURDATE()) - 1
    GROUP BY membership_number
),
ActiveMembers AS (
    SELECT cm.membership_number
    FROM ClubMember cm
    LEFT JOIN PrevYearPay p ON p.membership_number = cm.membership_number
    WHERE COALESCE(p.total_paid, 0) >=
          CASE
              WHEN TIMESTAMPDIFF(
                       YEAR, cm.date_of_birth,
                       STR_TO_DATE(CONCAT(YEAR(CURDATE()) - 1, '-12-31'), '%Y-%m-%d')
                   ) >= 18
              THEN 200
              ELSE 100
          END
),
GoalkeeperOnly AS (
    SELECT membership_number
    FROM TeamFormationAssignment
    GROUP BY membership_number
    HAVING COUNT(*) = SUM(CASE WHEN role = 'Goalkeeper' THEN 1 ELSE 0 END)
),
FifaCounts AS (
    SELECT membership_number, COUNT(*) AS num_fifa_games
    FROM FIFAParticipation
    GROUP BY membership_number
)
SELECT
    l.name AS location_name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) AS age,
    cm.phone_number,
    cm.email,
    COALESCE(fc.num_fifa_games, 0) AS num_fifa_games
FROM ClubMember cm
JOIN ActiveMembers am     ON am.membership_number = cm.membership_number
JOIN GoalkeeperOnly gk    ON gk.membership_number = cm.membership_number
JOIN Location l            ON l.location_id = cm.location_id
LEFT JOIN FifaCounts fc   ON fc.membership_number = cm.membership_number
ORDER BY location_name ASC, cm.membership_number ASC;
-- End Query

-- QUERY-16
-- Start Query
WITH RequiredRoles AS (
    SELECT tfa.membership_number
    FROM TeamFormationAssignment tfa
    WHERE tfa.role IN (
        'Goalkeeper',
        'Right Fullback',
        'Center Back or Sweeper',
        'Defending or Holding Midfielder',
        'Striker'
    )
    GROUP BY tfa.membership_number
    HAVING COUNT(DISTINCT tfa.role) = 5
),
PrevYearPay AS (
    SELECT membership_number, SUM(amount) AS total_paid
    FROM Payment
    WHERE membership_year = YEAR(CURDATE()) - 1
    GROUP BY membership_number
)
SELECT
    l.name AS location_name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    CASE WHEN COALESCE(p.total_paid, 0) >= 200 THEN 'Active' ELSE 'Inactive' END AS status,
    cm.registration_date AS date_joined,
    TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) AS age,
    cm.phone_number,
    cm.email
FROM ClubMember cm
JOIN RequiredRoles rr ON rr.membership_number = cm.membership_number
JOIN Location l        ON l.location_id = cm.location_id
LEFT JOIN PrevYearPay p ON p.membership_number = cm.membership_number
WHERE COALESCE(p.total_paid, 0) >=
    CASE WHEN TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) >= 18
         THEN 200 ELSE 100 END
ORDER BY l.name ASC, cm.membership_number ASC;
-- End Query

-- QUERY-17
-- Start Query
SET @location_id = 1;

WITH PrevYearPay AS (
    SELECT membership_number, SUM(amount) AS total_paid
    FROM Payment
    WHERE membership_year = YEAR(CURDATE()) - 1
    GROUP BY membership_number
),
ActiveMembersHere AS (
    SELECT cm.membership_number
    FROM ClubMember cm
    LEFT JOIN PrevYearPay p ON p.membership_number = cm.membership_number
    WHERE cm.location_id = @location_id
      AND COALESCE(p.total_paid, 0) >=
          CASE WHEN TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) >= 18
               THEN 200 ELSE 100 END
),
HeadCoachesHere AS (
    SELECT DISTINCT tf.head_coach_id
    FROM TeamFormation tf
    WHERE tf.location_id = @location_id
)
SELECT DISTINCT
    fm.first_name,
    fm.last_name,
    fm.phone_number
FROM FamilyMember fm
JOIN Personnel per              ON per.ssn = fm.ssn
JOIN HeadCoachesHere hc         ON hc.head_coach_id = per.personnel_id
JOIN ClubMemberFamilyRelation r ON r.family_member_id = fm.family_member_id
                               AND r.end_date IS NULL
JOIN ActiveMembersHere am       ON am.membership_number = r.membership_number;
-- End Query

-- QUERY-18
-- Start Query
WITH PrevYearPay AS (
    SELECT membership_number, SUM(amount) AS total_paid
    FROM Payment
    WHERE membership_year = YEAR(CURDATE()) - 1
    GROUP BY membership_number
),
ActiveMembers AS (
    SELECT cm.membership_number
    FROM ClubMember cm
    LEFT JOIN PrevYearPay p ON p.membership_number = cm.membership_number
    WHERE COALESCE(p.total_paid, 0) >=
          CASE
              WHEN TIMESTAMPDIFF(
                       YEAR, cm.date_of_birth,
                       STR_TO_DATE(CONCAT(YEAR(CURDATE()) - 1, '-12-31'), '%Y-%m-%d')
                   ) >= 18
              THEN 200
              ELSE 100
          END
),
GamePlayers AS (
    SELECT DISTINCT tfa.membership_number
    FROM TeamFormationAssignment tfa
    JOIN TeamFormation tf ON tf.formation_id = tfa.formation_id
    JOIN Session s ON s.session_id = tf.session_id
    WHERE s.session_type = 'Game'
),
Winners AS (
    SELECT DISTINCT tfa.membership_number
    FROM TeamFormationAssignment tfa
    JOIN TeamFormation tf  ON tf.formation_id = tfa.formation_id
    JOIN Session s          ON s.session_id = tf.session_id AND s.session_type = 'Game'
    JOIN TeamFormation opp ON opp.session_id = tf.session_id AND opp.formation_id <> tf.formation_id
    WHERE tf.score IS NOT NULL
      AND opp.score IS NOT NULL
      AND tf.score > opp.score
)
SELECT
    l.name AS location_name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) AS age,
    cm.phone_number,
    cm.email
FROM ClubMember cm
JOIN ActiveMembers am ON am.membership_number = cm.membership_number
JOIN GamePlayers gp   ON gp.membership_number = cm.membership_number
JOIN Location l        ON l.location_id = cm.location_id
WHERE NOT EXISTS (
    SELECT 1 FROM Winners w WHERE w.membership_number = cm.membership_number
)
ORDER BY location_name ASC, cm.membership_number ASC;
-- End Query

-- QUERY-19
-- Start Query
WITH MinorChildren AS (
    SELECT r.family_member_id, COUNT(DISTINCT r.membership_number) AS num_minor_members
    FROM ClubMemberFamilyRelation r
    JOIN ClubMember cm ON cm.membership_number = r.membership_number
    WHERE r.end_date IS NULL
      AND TIMESTAMPDIFF(YEAR, cm.date_of_birth, CURDATE()) < 18
    GROUP BY r.family_member_id
),
FifaChildren AS (
    SELECT r.family_member_id, COUNT(DISTINCT r.membership_number) AS num_fifa_members
    FROM ClubMemberFamilyRelation r
    JOIN FIFAParticipation fp ON fp.membership_number = r.membership_number
    WHERE r.end_date IS NULL
    GROUP BY r.family_member_id
),
CurrentAssignment AS (
    SELECT personnel_id, location_id
    FROM PersonnelAssignment
    WHERE end_date IS NULL
)
SELECT
    l.name AS location_name,
    p.first_name,
    p.last_name,
    mc.num_minor_members,
    fc.num_fifa_members,
    p.phone_number,
    p.email,
    p.role AS current_role
FROM Personnel p
JOIN FamilyMember fm         ON fm.ssn = p.ssn
JOIN MinorChildren mc        ON mc.family_member_id = fm.family_member_id
JOIN FifaChildren fc         ON fc.family_member_id = fm.family_member_id
JOIN CurrentAssignment ca    ON ca.personnel_id = p.personnel_id
JOIN Location l               ON l.location_id = ca.location_id
WHERE p.mandate = 'Volunteer'
ORDER BY location_name ASC, p.role ASC, p.first_name ASC, p.last_name ASC;
-- End Query