--- Queries for the Country Soccer Club System

-- Get all club members who have at least four different hobbies --
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
    END AS status,

    COUNT(DISTINCT cmh.hobby_id) AS number_of_hobbies
FROM ClubMember cm
JOIN Location l
    ON l.location_id = cm.location_id
JOIN ClubMemberHobby cmh
    ON cmh.membership_number = cm.membership_number
GROUP BY
    l.location_id,
    l.name,
    cm.membership_number,
    cm.first_name,
    cm.last_name,
    cm.date_of_birth,
    cm.city,
    cm.province
HAVING COUNT(DISTINCT cmh.hobby_id) >= 4
ORDER BY
    age DESC,
    location_name ASC;

-- Get all major club members (18+) who have never participated in any FIFA game --
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