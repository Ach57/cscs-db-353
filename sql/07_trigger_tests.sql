-- Country Soccer Club System - Trigger Integrity Tests
-- Run after 01_schema.sql + 02_seed.sql + 05_trigger.sql.
--
-- Each test is run inside a stored procedure that catches the trigger's
-- SIGNAL (via a CONTINUE HANDLER) instead of letting it abort the script,
-- and logs one PASS/FAIL row per test into a results table.
--
-- Tests 1-17 are inserted and then ROLLBACK'd, so nothing persists in the
-- real tables. Tests 18-21 (minor registration) call
-- sp_register_minor_club_member, which commits internally, so that section
-- instead cleans up its own rows explicitly at the end. Either way, the
-- results table is created ENGINE=MEMORY, which is non-transactional, so
-- it survives the tests 1-17 ROLLBACK and is still there for the final
-- SELECT and for you to screenshot.
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
DROP PROCEDURE IF EXISTS sp_run_minor_registration_tests;

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

    -- Adult DOB: this insert must fail on the capacity check alone, not on
    -- the minor-registration guard added below (section 7).
    SET v_err_msg = NULL;
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (3, 'Test', 'Overflow', '1990-01-01', 'Male', '2024-01-01', 'TESTSSN002', 'TESTMED002');
    INSERT INTO test_results VALUES
        (2, 'ClubMember insert at location already at capacity', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

    UPDATE Location SET capacity = v_orig_cap WHERE location_id = 3;

    -- Adult DOB, same reason: a direct INSERT of a minor is rejected by
    -- design (section 7), so this "plain valid insert" case has to be an
    -- adult to actually exercise the SUCCESS path.
    SET v_err_msg = NULL;
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (1, 'Test', 'ValidAdult', '1995-01-01', 'Male', '2024-01-01', 'TESTSSN003', 'TESTMED003');
    INSERT INTO test_results VALUES
        (3, 'Valid ClubMember insert (adult, direct)', 'SUCCESS', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
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

    -- Minor with no family relation active on the *session* date, but fully
    -- paid -> should still be rejected on the family-relation check.
    --
    -- sp_register_minor_club_member always creates an immediately-active
    -- relation and manages its own transaction (COMMIT/ROLLBACK), which
    -- can't be nested inside this procedure's enclosing transaction without
    -- prematurely committing tests 1-16. So this fixture is built directly:
    -- @cscs_allow_minor_insert is the same flag the procedure sets, and the
    -- relation is given a start_date after the 2030 test session so it
    -- isn't active yet on that date (while still satisfying the "a minor
    -- must have a family relation" rule going forward).
    SET @cscs_allow_minor_insert = 1;
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (1, 'Test', 'MinorNoFamily', '2020-01-01', 'Male', '2024-01-01', 'TESTSSN006', 'TESTMED006');
    SET @cscs_allow_minor_insert = 0;
    SET v_test_minor = LAST_INSERT_ID();
    INSERT INTO ClubMemberFamilyRelation
        (membership_number, family_member_id, relationship_type, family_member_type, start_date)
    VALUES (v_test_minor, 1, 'Father', 'Primary', '2031-06-01');
    INSERT INTO Payment (membership_number, payment_date, amount, payment_method, membership_year, installment_number)
    VALUES (v_test_minor, '2029-12-31', 100.00, 'Debit', 2030, 1);

    SET v_err_msg = NULL;
    INSERT INTO TeamFormationAssignment (formation_id, membership_number, role)
    VALUES (v_formA, v_test_minor, 'Center Back');
    INSERT INTO test_results VALUES
        (17, 'Minor with no family relation blocks assignment', 'ERROR', IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'),
         IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);

END$$

-- ================================================================
-- 7) ClubMember/ClubMemberFamilyRelation: a minor must be registered
--    with a linked family member already in the system.
--
--    sp_register_minor_club_member manages its own transaction (it
--    COMMITs), so it can't run inside sp_run_trigger_tests's enclosing
--    transaction without prematurely committing tests 1-16. This
--    procedure is therefore called plainly (no surrounding
--    START TRANSACTION/ROLLBACK) and cleans up its own rows at the end
--    instead of relying on a ROLLBACK to erase them.
-- ================================================================
CREATE PROCEDURE sp_run_minor_registration_tests()
BEGIN
    DECLARE v_err_msg TEXT DEFAULT NULL;
    DECLARE v_new_member INT DEFAULT NULL;

    -- Section 1's simple `GET DIAGNOSTICS CONDITION 1` capture is enough
    -- there because each of its statements runs cleanly (autocommit-free,
    -- one open transaction for the whole run). Here, a statement that
    -- fails while earlier MEMORY-table (test_results) writes are still
    -- uncommitted makes MySQL raise extra HY000 warnings about not being
    -- able to roll back the MEMORY table -- which can outrank our SIGNAL
    -- as "condition 1". Fixed at the source below with a COMMIT after
    -- every test_results write, so no risky statement ever runs with
    -- uncommitted MEMORY-table history behind it; this capture can then
    -- stay as simple as section 1's.
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 v_err_msg = MESSAGE_TEXT;
    END;

    -- direct INSERT of a minor is rejected
    SET v_err_msg = NULL;
    INSERT INTO ClubMember
        (location_id, first_name, last_name, date_of_birth, gender, registration_date, ssn, medicare_number)
    VALUES
        (1, 'Test', 'DirectMinorReject', '2018-01-01', 'Male', '2026-08-11', 'TESTSSN007', 'TESTMED007');
    INSERT INTO test_results VALUES
        (18, 'Direct INSERT of a minor club member is rejected', 'ERROR',
         IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'), IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);
    COMMIT;

    -- sp_register_minor_club_member rejects a family_member_id that doesn't exist
    SET v_err_msg = NULL;
    CALL sp_register_minor_club_member(
        1, 'Test', 'BadFamilyReject', '2018-01-01', 'Male', '2026-08-11',
        NULL, NULL, 'TESTSSN008', 'TESTMED008', NULL, NULL, NULL, NULL, NULL, NULL,
        999999, 'Father', 'Primary', '2026-08-11'
    );
    INSERT INTO test_results VALUES
        (19, 'sp_register_minor_club_member rejects a nonexistent family member', 'ERROR',
         IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'), IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);
    COMMIT;

    -- sp_register_minor_club_member succeeds with a valid family member,
    -- creating the ClubMember and its ClubMemberFamilyRelation together.
    SET v_err_msg = NULL;
    CALL sp_register_minor_club_member(
        1, 'Test', 'GoodFamilyAccept', '2018-01-01', 'Male', '2026-08-11',
        NULL, NULL, 'TESTSSN009', 'TESTMED009', NULL, NULL, NULL, NULL, NULL, NULL,
        1, 'Grandmother', 'Secondary', '2026-08-11'
    );
    SET v_new_member = @cscs_last_minor_membership_number;
    INSERT INTO test_results VALUES
        (20, 'sp_register_minor_club_member succeeds with a valid family member', 'SUCCESS',
         IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'), IF(v_err_msg IS NULL, 'PASS', 'FAIL'), v_err_msg);
    COMMIT;

    -- deleting that minor's only active family relation is rejected
    SET v_err_msg = NULL;
    DELETE FROM ClubMemberFamilyRelation WHERE membership_number = v_new_member;
    INSERT INTO test_results VALUES
        (21, 'Deleting a minor''s only active family relation is rejected', 'ERROR',
         IF(v_err_msg IS NULL, 'SUCCESS', 'ERROR'), IF(v_err_msg IS NULL, 'FAIL', 'PASS'), v_err_msg);
    COMMIT;

    -- Cleanup: these rows are real commits (the procedure manages its own
    -- transaction), so age the test 20 member up to an adult first --
    -- otherwise the delete-guard trigger just proven in test 21 blocks
    -- removing their only relation.
    IF v_new_member IS NOT NULL THEN
        UPDATE ClubMember SET date_of_birth = '2000-01-01' WHERE membership_number = v_new_member;
        DELETE FROM ClubMemberFamilyRelation WHERE membership_number = v_new_member;
        DELETE FROM ClubMember WHERE membership_number = v_new_member;
    END IF;
END$$

DELIMITER ;

START TRANSACTION;
CALL sp_run_trigger_tests();
ROLLBACK;

DROP PROCEDURE sp_run_trigger_tests;

CALL sp_run_minor_registration_tests();
DROP PROCEDURE sp_run_minor_registration_tests;

SELECT * FROM test_results ORDER BY test_id;

SELECT
    SUM(verdict = 'PASS') AS passed,
    SUM(verdict = 'FAIL') AS failed,
    COUNT(*) AS total
FROM test_results;

DROP TEMPORARY TABLE test_results;
