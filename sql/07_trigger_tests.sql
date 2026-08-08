-- Country Soccer Club System - Trigger Integrity Tests
-- Run after 01_schema.sql + 02_seed.sql + 05_trigger.sql.
--
-- Each test is run inside a stored procedure that catches the trigger's
-- SIGNAL (via a CONTINUE HANDLER) instead of letting it abort the script,
-- and logs one PASS/FAIL row per test into a results table.
--
-- All test data is inserted and then ROLLBACK'd, so nothing persists in
-- the real tables. The results table is created ENGINE=MEMORY, which is
-- non-transactional, so it survives that ROLLBACK and is still there for
-- the final SELECT and for you to screenshot.
--
-- A NULL trigger_message is expected (not an error) on every row where
-- expected = SUCCESS: no SIGNAL means the CONTINUE HANDLER never ran, so
-- there was nothing to log -- that's the correct, passing outcome.
--
-- Run with --table so the results print as an aligned, bordered table
-- instead of raw tab-separated output:
--   docker exec -i -e MYSQL_PWD="$MYSQL_ROOT_PASSWORD" cscs-dev-db \
--     mysql -u root wqc353_1 --table < sql/07_trigger_tests.sql

USE wqc353_1;

DROP TEMPORARY TABLE IF EXISTS test_results;
CREATE TEMPORARY TABLE test_results (
    test_id INT PRIMARY KEY,
    description VARCHAR(150),
    expected VARCHAR(10),
    actual VARCHAR(10),
    verdict VARCHAR(4),
    trigger_message VARCHAR(255)
) ENGINE = MEMORY;

DROP PROCEDURE IF EXISTS sp_run_trigger_tests;

DELIMITER $$

CREATE PROCEDURE sp_run_trigger_tests()
BEGIN
    DECLARE v_err_msg TEXT DEFAULT NULL;
    DECLARE v_orig_cap INT;
    DECLARE v_test_personnel INT;
    DECLARE v_test_session INT;
    DECLARE v_formA INT;
    DECLARE v_conflict_session INT;
    DECLARE v_formConflict INT;
    DECLARE v_ok_session INT;
    DECLARE v_formOK INT;
    DECLARE v_test_major INT;
    DECLARE v_test_nopay INT;
    DECLARE v_test_minor INT;

    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_err_msg = MESSAGE_TEXT;
    END;

    -- ================================================================
    -- 1) ClubMember: minimum registration age
    -- ================================================================
    SET v_err_msg = NULL;
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (1, 'Test', 'TooYoung', '2023-01-01', 'Male', '2024-01-01', 'TESTSSN001', 'TESTMED001');
    INSERT INTO test_results VALUES
        (1, 'ClubMember registered under age 4', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    -- ================================================================
    -- 2) ClubMember: location capacity
    --    Temporarily pin capacity to the current headcount so the next
    --    insert is guaranteed to overflow it, then restore it either way.
    -- ================================================================
    SET v_orig_cap = (SELECT capacity FROM Location WHERE location_id = 3);
    UPDATE Location
       SET capacity = (SELECT COUNT(*) FROM ClubMember WHERE location_id = 3)
     WHERE location_id = 3;

    SET v_err_msg = NULL;
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (3, 'Test', 'Overflow', '2015-01-01', 'Male', '2024-01-01', 'TESTSSN002', 'TESTMED002');
    INSERT INTO test_results VALUES
        (2, 'ClubMember insert at location already at capacity', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    UPDATE Location SET capacity = v_orig_cap WHERE location_id = 3;

    SET v_err_msg = NULL;
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (1, 'Test', 'ValidMinor', '2015-01-01', 'Male', '2024-01-01', 'TESTSSN003', 'TESTMED003');
    INSERT INTO test_results VALUES
        (3, 'Valid ClubMember insert', 'SUCCESS', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'PASS', 'FAIL'), v_err_msg);

    -- ================================================================
    -- 3) PersonnelAssignment: no overlapping location history
    --    personnel_id 1 has an open-ended assignment at location 1 since
    --    2019-01-01, so any new open-ended assignment for them conflicts.
    --    The non-overlapping case uses a freshly inserted Personnel row
    --    so it isn't sensitive to whatever assignment history already
    --    exists for a given personnel_id in the seed data.
    -- ================================================================
    SET v_err_msg = NULL;
    INSERT INTO PersonnelAssignment (personnel_id, location_id, start_date, end_date)
    VALUES (1, 2, '2024-01-01', NULL);
    INSERT INTO test_results VALUES
        (4, 'Personnel overlapping assignment', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    INSERT INTO Personnel
        (first_name, last_name, date_of_birth, ssn, medicare_number, role, mandate)
    VALUES
        ('Test', 'FreshPersonnel', '1985-01-01', 'TESTPSSN01', 'TESTPMED01', 'Other', 'Volunteer');
    SET v_test_personnel = LAST_INSERT_ID();

    SET v_err_msg = NULL;
    INSERT INTO PersonnelAssignment (personnel_id, location_id, start_date, end_date)
    VALUES (v_test_personnel, 3, '2021-04-01', NULL);
    INSERT INTO test_results VALUES
        (5, 'Personnel non-overlapping assignment', 'SUCCESS', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'PASS', 'FAIL'), v_err_msg);

    -- ================================================================
    -- 4) FamilyMemberAssignment: no overlapping location history
    --    family_member_id 1 is ongoing since 2020-01-10; family_member_id
    --    4's assignment is fully closed (ended 2023-01-01, never reopened).
    -- ================================================================
    SET v_err_msg = NULL;
    INSERT INTO FamilyMemberAssignment (family_member_id, location_id, start_date, end_date)
    VALUES (1, 2, '2024-01-01', NULL);
    INSERT INTO test_results VALUES
        (6, 'Family member overlapping assignment', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    SET v_err_msg = NULL;
    INSERT INTO FamilyMemberAssignment (family_member_id, location_id, start_date, end_date)
    VALUES (4, 2, '2023-02-01', NULL);
    INSERT INTO test_results VALUES
        (7, 'Family member non-overlapping assignment', 'SUCCESS', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'PASS', 'FAIL'), v_err_msg);

    -- ================================================================
    -- 5) TeamFormation: exactly two formations per session
    --    Build a fresh session so the count starts at zero.
    -- ================================================================
    INSERT INTO Session (session_datetime, address, session_type)
    VALUES ('2030-01-01 10:00:00', 'Test Field', 'Training');
    SET v_test_session = LAST_INSERT_ID();

    SET v_err_msg = NULL;
    INSERT INTO TeamFormation (session_id, location_id, head_coach_id, team_name, score, team_category)
    VALUES (v_test_session, 1, 1, 'Test Team A', NULL, 'Boys');
    SET v_formA = LAST_INSERT_ID();
    INSERT INTO test_results VALUES
        (8, '1st TeamFormation in a new session', 'SUCCESS', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'PASS', 'FAIL'), v_err_msg);

    SET v_err_msg = NULL;
    INSERT INTO TeamFormation (session_id, location_id, head_coach_id, team_name, score, team_category)
    VALUES (v_test_session, 2, 1, 'Test Team B', NULL, 'Boys');
    INSERT INTO test_results VALUES
        (9, '2nd TeamFormation in same session', 'SUCCESS', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'PASS', 'FAIL'), v_err_msg);

    SET v_err_msg = NULL;
    INSERT INTO TeamFormation (session_id, location_id, head_coach_id, team_name, score, team_category)
    VALUES (v_test_session, 3, 1, 'Test Team C', NULL, 'Boys');
    INSERT INTO test_results VALUES
        (10, '3rd TeamFormation in same session', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    -- ================================================================
    -- 6) TeamFormationAssignment: location match, gender match, 3-hour
    --    conflict window, minor/family check, membership fee check.
    --    Fresh members are used so results don't depend on prior payments.
    -- ================================================================

    -- location mismatch: member 3 (Maxime) is registered at location 2,
    -- v_formA is at location 1.
    SET v_err_msg = NULL;
    INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
    VALUES (v_formA, 3, 'Right Fullback');
    INSERT INTO test_results VALUES
        (11, 'Assignment location mismatch', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    -- gender mismatch: member 2 (Sophie, Female) vs v_formA (Boys), same location.
    SET v_err_msg = NULL;
    INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
    VALUES (v_formA, 2, 'Left Winger');
    INSERT INTO test_results VALUES
        (12, 'Assignment gender mismatch', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    -- fresh major member, fully paid for the 2030 session year -> should succeed
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (1, 'Test', 'MajorPaid', '1990-01-01', 'Male', '2024-01-01', 'TESTSSN004', 'TESTMED004');
    SET v_test_major = LAST_INSERT_ID();
    INSERT INTO Payment (membership_number, payment_date, amount, payment_method, membership_year, installment_number)
    VALUES (v_test_major, '2029-12-31', 200.00, 'Debit', 2030, 1);

    SET v_err_msg = NULL;
    INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
    VALUES (v_formA, v_test_major, 'Striker');
    INSERT INTO test_results VALUES
        (13, 'Valid paid-up major member assignment', 'SUCCESS', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'PASS', 'FAIL'), v_err_msg);

    -- fresh major member with NO payment on record for 2030 -> should be rejected
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (1, 'Test', 'MajorUnpaid', '1990-01-01', 'Male', '2024-01-01', 'TESTSSN005', 'TESTMED005');
    SET v_test_nopay = LAST_INSERT_ID();

    SET v_err_msg = NULL;
    INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
    VALUES (v_formA, v_test_nopay, 'Left Winger');
    INSERT INTO test_results VALUES
        (14, 'Unpaid membership fee blocks assignment', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    -- 3-hour conflict: same day as v_test_session (10:00), 90 minutes later.
    INSERT INTO Session (session_datetime, address, session_type)
    VALUES ('2030-01-01 11:30:00', 'Test Field 2', 'Training');
    SET v_conflict_session = LAST_INSERT_ID();
    INSERT INTO TeamFormation (session_id, location_id, head_coach_id, team_name, score, team_category)
    VALUES (v_conflict_session, 1, 1, 'Test Team Conflict', NULL, 'Boys');
    SET v_formConflict = LAST_INSERT_ID();

    SET v_err_msg = NULL;
    INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
    VALUES (v_formConflict, v_test_major, 'Center Back');
    INSERT INTO test_results VALUES
        (15, 'Same-day assignment <3h apart', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    -- non-conflicting: same day, 4 hours later.
    INSERT INTO Session (session_datetime, address, session_type)
    VALUES ('2030-01-01 14:00:00', 'Test Field 3', 'Training');
    SET v_ok_session = LAST_INSERT_ID();
    INSERT INTO TeamFormation (session_id, location_id, head_coach_id, team_name, score, team_category)
    VALUES (v_ok_session, 1, 1, 'Test Team OK', NULL, 'Boys');
    SET v_formOK = LAST_INSERT_ID();

    SET v_err_msg = NULL;
    INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
    VALUES (v_formOK, v_test_major, 'Attacking Midfielder');
    INSERT INTO test_results VALUES
        (16, 'Same-day assignment >=3h apart', 'SUCCESS', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'PASS', 'FAIL'), v_err_msg);

    -- minor with no active family relation, but fully paid -> should still
    -- be rejected on the family-relation check.
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (1, 'Test', 'MinorNoFamily', '2020-01-01', 'Male', '2024-01-01', 'TESTSSN006', 'TESTMED006');
    SET v_test_minor = LAST_INSERT_ID();
    INSERT INTO Payment (membership_number, payment_date, amount, payment_method, membership_year, installment_number)
    VALUES (v_test_minor, '2029-12-31', 100.00, 'Debit', 2030, 1);

    SET v_err_msg = NULL;
    INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
    VALUES (v_formA, v_test_minor, 'Center Back');
    INSERT INTO test_results VALUES
        (17, 'Minor with no family relation blocks assignment', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

END$$

DELIMITER ;

START TRANSACTION;
CALL sp_run_trigger_tests();
ROLLBACK;

DROP PROCEDURE sp_run_trigger_tests;

SELECT * FROM test_results ORDER BY test_id;

SELECT
    SUM(verdict = 'PASS') AS passed,
    SUM(verdict = 'FAIL') AS failed,
    COUNT(*) AS total
FROM test_results;

DROP TEMPORARY TABLE test_results;
