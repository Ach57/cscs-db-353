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
