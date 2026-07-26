-- =========================================================
-- CSCS (Country Soccer Club System) - Verification
-- SELECT COUNT(*) FROM R for every relation R in the database
-- =========================================================

USE wqc353_1;

SELECT 'Location' AS table_name, COUNT(*) AS row_count FROM Location
UNION ALL SELECT 'LocationPhone', COUNT(*) FROM LocationPhone
UNION ALL SELECT 'Personnel', COUNT(*) FROM Personnel
UNION ALL SELECT 'PersonnelAssignment', COUNT(*) FROM PersonnelAssignment
UNION ALL SELECT 'FamilyMember', COUNT(*) FROM FamilyMember
UNION ALL SELECT 'FamilyMemberAssignment', COUNT(*) FROM FamilyMemberAssignment
UNION ALL SELECT 'ClubMember', COUNT(*) FROM ClubMember
UNION ALL SELECT 'ClubMemberFamilyRelation', COUNT(*) FROM ClubMemberFamilyRelation
UNION ALL SELECT 'Hobby', COUNT(*) FROM Hobby
UNION ALL SELECT 'ClubMemberHobby', COUNT(*) FROM ClubMemberHobby
UNION ALL SELECT 'Payment', COUNT(*) FROM Payment
UNION ALL SELECT 'FIFAGame', COUNT(*) FROM FIFAGame
UNION ALL SELECT 'FIFAParticipation', COUNT(*) FROM FIFAParticipation;