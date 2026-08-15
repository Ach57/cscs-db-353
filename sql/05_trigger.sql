-- Country Soccer Club System - Integrity Triggers
-- Run after 01_schema.sql + 02_seed.sql.

USE wqc353_1;

DROP TRIGGER IF EXISTS trg_location_before_insert;
DROP TRIGGER IF EXISTS trg_location_before_update;
DROP TRIGGER IF EXISTS trg_fifa_participation_before_insert;
DROP TRIGGER IF EXISTS trg_fifa_participation_before_update;
DROP TRIGGER IF EXISTS trg_club_member_before_insert;
DROP TRIGGER IF EXISTS trg_club_member_before_update;
DROP TRIGGER IF EXISTS trg_team_formation_assignment_before_insert;
DROP TRIGGER IF EXISTS trg_team_formation_assignment_before_update;
DROP TRIGGER IF EXISTS trg_personnel_assignment_before_insert;
DROP TRIGGER IF EXISTS trg_personnel_assignment_before_update;
DROP TRIGGER IF EXISTS trg_family_assignment_before_insert;
DROP TRIGGER IF EXISTS trg_family_assignment_before_update;
DROP TRIGGER IF EXISTS trg_team_formation_before_insert;
DROP TRIGGER IF EXISTS trg_team_formation_before_update;
DROP TRIGGER IF EXISTS trg_family_relation_before_delete;
DROP TRIGGER IF EXISTS trg_family_relation_before_update;

DELIMITER $$

-- 1) ClubMember: minimum registration age + location capacity
CREATE TRIGGER trg_club_member_before_insert
BEFORE INSERT ON ClubMember
FOR EACH ROW
BEGIN
    DECLARE max_capacity INT;
    DECLARE current_members INT;

    IF TIMESTAMPDIFF(YEAR, NEW.date_of_birth, NEW.registration_date) < 4 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A new club member must be at least 4 years old at registration.';
    END IF;

    SELECT capacity INTO max_capacity
      FROM Location
     WHERE location_id = NEW.location_id;

    SELECT COUNT(*) INTO current_members
      FROM ClubMember
     WHERE location_id = NEW.location_id;

    IF current_members >= max_capacity THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Location capacity reached: another active club member cannot be added.';
    END IF;
END$$

CREATE TRIGGER trg_club_member_before_update
BEFORE UPDATE ON ClubMember
FOR EACH ROW
BEGIN
    DECLARE max_capacity INT;
    DECLARE current_members INT;

    IF TIMESTAMPDIFF(YEAR, NEW.date_of_birth, NEW.registration_date) < 4 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A club member must have been at least 4 years old at registration.';
    END IF;

    IF NEW.location_id <> OLD.location_id THEN
        SELECT capacity INTO max_capacity
          FROM Location
         WHERE location_id = NEW.location_id;

        SELECT COUNT(*) INTO current_members
          FROM ClubMember
         WHERE location_id = NEW.location_id
           AND membership_number <> OLD.membership_number;

        IF current_members >= max_capacity THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Location capacity reached: club member cannot be transferred there.';
        END IF;
    END IF;
END$$

-- 2) Personnel location history: no overlapping assignments
CREATE TRIGGER trg_personnel_assignment_before_insert
BEFORE INSERT ON PersonnelAssignment
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT DEFAULT 0;

    SELECT COUNT(*) INTO overlap_count
      FROM PersonnelAssignment pa
     WHERE pa.personnel_id = NEW.personnel_id
       AND NEW.start_date <= COALESCE(pa.end_date, '9999-12-31')
       AND COALESCE(NEW.end_date, '9999-12-31') >= pa.start_date;

    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Personnel cannot operate at two locations during overlapping periods.';
    END IF;
END$$

CREATE TRIGGER trg_personnel_assignment_before_update
BEFORE UPDATE ON PersonnelAssignment
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT DEFAULT 0;

    SELECT COUNT(*) INTO overlap_count
      FROM PersonnelAssignment pa
     WHERE pa.personnel_id = NEW.personnel_id
       AND pa.assignment_id <> OLD.assignment_id
       AND NEW.start_date <= COALESCE(pa.end_date, '9999-12-31')
       AND COALESCE(NEW.end_date, '9999-12-31') >= pa.start_date;

    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Personnel cannot operate at two locations during overlapping periods.';
    END IF;
END$$

-- 3) Family-member location history: no overlapping assignments
CREATE TRIGGER trg_family_assignment_before_insert
BEFORE INSERT ON FamilyMemberAssignment
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT DEFAULT 0;

    SELECT COUNT(*) INTO overlap_count
      FROM FamilyMemberAssignment fa
     WHERE fa.family_member_id = NEW.family_member_id
       AND NEW.start_date <= COALESCE(fa.end_date, '9999-12-31')
       AND COALESCE(NEW.end_date, '9999-12-31') >= fa.start_date;

    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Family member cannot be associated with two locations during overlapping periods.';
    END IF;
END$$

CREATE TRIGGER trg_family_assignment_before_update
BEFORE UPDATE ON FamilyMemberAssignment
FOR EACH ROW
BEGIN
    DECLARE overlap_count INT DEFAULT 0;

    SELECT COUNT(*) INTO overlap_count
      FROM FamilyMemberAssignment fa
     WHERE fa.family_member_id = NEW.family_member_id
       AND fa.assignment_id <> OLD.assignment_id
       AND NEW.start_date <= COALESCE(fa.end_date, '9999-12-31')
       AND COALESCE(NEW.end_date, '9999-12-31') >= fa.start_date;

    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Family member cannot be associated with two locations during overlapping periods.';
    END IF;
END$$

-- 4) TeamFormation: no more than two teams in one session
--    Exactly two is checked in 04_verify.sql because the first row must be
--    allowed to exist while the second row is being inserted.
CREATE TRIGGER trg_team_formation_before_insert
BEFORE INSERT ON TeamFormation
FOR EACH ROW
BEGIN
    DECLARE formation_count INT DEFAULT 0;

    SELECT COUNT(*) INTO formation_count
      FROM TeamFormation
     WHERE session_id = NEW.session_id;

    IF formation_count >= 2 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A session can contain exactly two team formations; a third formation is not allowed.';
    END IF;
END$$

CREATE TRIGGER trg_team_formation_before_update
BEFORE UPDATE ON TeamFormation
FOR EACH ROW
BEGIN
    DECLARE formation_count INT DEFAULT 0;

    IF NEW.session_id <> OLD.session_id THEN
        SELECT COUNT(*) INTO formation_count
          FROM TeamFormation
         WHERE session_id = NEW.session_id
           AND formation_id <> OLD.formation_id;

        IF formation_count >= 2 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'A session can contain exactly two team formations; a third formation is not allowed.';
        END IF;
    END IF;
END$$

-- 5) TeamFormationAssignment integrity
--    - same location
--    - boys/girls homogeneity
--    - >= 3 hour spacing on same calendar day
--    - paid/renewed membership for the session year
--    - minors must have a current family-member relationship
-- Role validity is already enforced by the role ENUM and duplicate assignment
-- to one formation is prevented by the composite PRIMARY KEY.
CREATE TRIGGER trg_team_formation_assignment_before_insert
BEFORE INSERT ON TeamFormationAssignment
FOR EACH ROW
BEGIN
    DECLARE new_session_dt DATETIME;
    DECLARE new_location INT;
    DECLARE new_category ENUM('Boys', 'Girls');
    DECLARE member_gender ENUM('Male', 'Female');
    DECLARE member_location INT;
    DECLARE member_dob DATE;
    DECLARE conflict_count INT DEFAULT 0;
    DECLARE family_count INT DEFAULT 0;
    DECLARE paid_amount DECIMAL(10,2) DEFAULT 0;
    DECLARE required_fee DECIMAL(10,2);

    SELECT s.session_datetime, tf.location_id, tf.team_category
      INTO new_session_dt, new_location, new_category
      FROM TeamFormation tf
      JOIN Session s ON s.session_id = tf.session_id
     WHERE tf.formation_id = NEW.formation_id;

    SELECT gender, location_id, date_of_birth
      INTO member_gender, member_location, member_dob
      FROM ClubMember
     WHERE membership_number = NEW.membership_number;

    IF member_location <> new_location THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member location does not match the team formation location.';
    END IF;

    IF (new_category = 'Boys' AND member_gender <> 'Male')
       OR (new_category = 'Girls' AND member_gender <> 'Female') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member gender does not match the team formation category.';
    END IF;

    SELECT COUNT(*) INTO conflict_count
      FROM TeamFormationAssignment tfa
      JOIN TeamFormation tf2 ON tf2.formation_id = tfa.formation_id
      JOIN Session s2 ON s2.session_id = tf2.session_id
     WHERE tfa.membership_number = NEW.membership_number
       AND tfa.formation_id <> NEW.formation_id
       AND DATE(s2.session_datetime) = DATE(new_session_dt)
       AND ABS(TIMESTAMPDIFF(MINUTE, s2.session_datetime, new_session_dt)) < 180;

    IF conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Conflicting assignment: same-day formations must be at least 3 hours apart.';
    END IF;

    -- Minor/major status is evaluated on the session date.
    IF TIMESTAMPDIFF(YEAR, member_dob, DATE(new_session_dt)) < 18 THEN
        SET required_fee = 100.00;

        SELECT COUNT(*) INTO family_count
          FROM ClubMemberFamilyRelation cfr
         WHERE cfr.membership_number = NEW.membership_number
           AND cfr.start_date <= DATE(new_session_dt)
           AND (cfr.end_date IS NULL OR cfr.end_date >= DATE(new_session_dt));

        IF family_count = 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Minor club member must have a family member relationship active on the session date.';
        END IF;
    ELSE
        SET required_fee = 200.00;
    END IF;

    SELECT COALESCE(SUM(amount), 0) INTO paid_amount
      FROM Payment
     WHERE membership_number = NEW.membership_number
       AND membership_year = YEAR(new_session_dt);

    IF paid_amount < required_fee THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member is not eligible: membership fee for the session year is not fully paid.';
    END IF;
END$$

CREATE TRIGGER trg_team_formation_assignment_before_update
BEFORE UPDATE ON TeamFormationAssignment
FOR EACH ROW
BEGIN
    DECLARE new_session_dt DATETIME;
    DECLARE new_location INT;
    DECLARE new_category ENUM('Boys', 'Girls');
    DECLARE member_gender ENUM('Male', 'Female');
    DECLARE member_location INT;
    DECLARE member_dob DATE;
    DECLARE conflict_count INT DEFAULT 0;
    DECLARE family_count INT DEFAULT 0;
    DECLARE paid_amount DECIMAL(10,2) DEFAULT 0;
    DECLARE required_fee DECIMAL(10,2);

    SELECT s.session_datetime, tf.location_id, tf.team_category
      INTO new_session_dt, new_location, new_category
      FROM TeamFormation tf
      JOIN Session s ON s.session_id = tf.session_id
     WHERE tf.formation_id = NEW.formation_id;

    SELECT gender, location_id, date_of_birth
      INTO member_gender, member_location, member_dob
      FROM ClubMember
     WHERE membership_number = NEW.membership_number;

    IF member_location <> new_location THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member location does not match the team formation location.';
    END IF;

    IF (new_category = 'Boys' AND member_gender <> 'Male')
       OR (new_category = 'Girls' AND member_gender <> 'Female') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member gender does not match the team formation category.';
    END IF;

    SELECT COUNT(*) INTO conflict_count
      FROM TeamFormationAssignment tfa
      JOIN TeamFormation tf2 ON tf2.formation_id = tfa.formation_id
      JOIN Session s2 ON s2.session_id = tf2.session_id
     WHERE tfa.membership_number = NEW.membership_number
       AND NOT (tfa.formation_id = OLD.formation_id
                AND tfa.membership_number = OLD.membership_number)
       AND DATE(s2.session_datetime) = DATE(new_session_dt)
       AND ABS(TIMESTAMPDIFF(MINUTE, s2.session_datetime, new_session_dt)) < 180;

    IF conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Conflicting assignment: same-day formations must be at least 3 hours apart.';
    END IF;

    IF TIMESTAMPDIFF(YEAR, member_dob, DATE(new_session_dt)) < 18 THEN
        SET required_fee = 100.00;

        SELECT COUNT(*) INTO family_count
          FROM ClubMemberFamilyRelation cfr
         WHERE cfr.membership_number = NEW.membership_number
           AND cfr.start_date <= DATE(new_session_dt)
           AND (cfr.end_date IS NULL OR cfr.end_date >= DATE(new_session_dt));

        IF family_count = 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Minor club member must have a family member relationship active on the session date.';
        END IF;
    ELSE
        SET required_fee = 200.00;
    END IF;

    SELECT COALESCE(SUM(amount), 0) INTO paid_amount
      FROM Payment
     WHERE membership_number = NEW.membership_number
       AND membership_year = YEAR(new_session_dt);

    IF paid_amount < required_fee THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member is not eligible: membership fee for the session year is not fully paid.';
    END IF;
END$$

-- 6) Location: at most one Head location club-wide
CREATE TRIGGER trg_location_before_insert
BEFORE INSERT ON Location
FOR EACH ROW
BEGIN
    DECLARE head_count INT DEFAULT 0;

    IF NEW.location_type = 'Head' THEN
        SELECT COUNT(*) INTO head_count FROM Location WHERE location_type = 'Head';
        IF head_count > 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'The club can only have one Head location.';
        END IF;
    END IF;
END$$

CREATE TRIGGER trg_location_before_update
BEFORE UPDATE ON Location
FOR EACH ROW
BEGIN
    DECLARE head_count INT DEFAULT 0;

    IF NEW.location_type = 'Head' AND OLD.location_type <> 'Head' THEN
        SELECT COUNT(*) INTO head_count FROM Location
         WHERE location_type = 'Head' AND location_id <> OLD.location_id;
        IF head_count > 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'The club can only have one Head location.';
        END IF;
    END IF;
END$$

-- 7) FIFAParticipation: same eligibility rules as TeamFormationAssignment —
--    fee paid for the game year; minors also need an active family relation.

CREATE TRIGGER trg_fifa_participation_before_insert
BEFORE INSERT ON FIFAParticipation
FOR EACH ROW
BEGIN
    DECLARE game_dt DATE;
    DECLARE member_dob DATE;
    DECLARE paid_amount DECIMAL(10,2) DEFAULT 0;
    DECLARE required_fee DECIMAL(10,2);
    DECLARE family_count INT DEFAULT 0;

    SELECT game_date INTO game_dt FROM FIFAGame WHERE game_id = NEW.game_id;
    SELECT date_of_birth INTO member_dob FROM ClubMember WHERE membership_number = NEW.membership_number;

    IF TIMESTAMPDIFF(YEAR, member_dob, game_dt) < 18 THEN
        SET required_fee = 100.00;

        SELECT COUNT(*) INTO family_count
          FROM ClubMemberFamilyRelation cfr
         WHERE cfr.membership_number = NEW.membership_number
           AND cfr.start_date <= game_dt
           AND (cfr.end_date IS NULL OR cfr.end_date >= game_dt);

        IF family_count = 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Minor club member must have a family member relationship active on the game date.';
        END IF;
    ELSE
        SET required_fee = 200.00;
    END IF;

    SELECT COALESCE(SUM(amount), 0) INTO paid_amount FROM Payment
     WHERE membership_number = NEW.membership_number AND membership_year = YEAR(game_dt);

    IF paid_amount < required_fee THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member is not eligible: membership fee for the game year is not fully paid.';
    END IF;
END$$

CREATE TRIGGER trg_fifa_participation_before_update
BEFORE UPDATE ON FIFAParticipation
FOR EACH ROW
BEGIN
    DECLARE game_dt DATE;
    DECLARE member_dob DATE;
    DECLARE paid_amount DECIMAL(10,2) DEFAULT 0;
    DECLARE required_fee DECIMAL(10,2);
    DECLARE family_count INT DEFAULT 0;

    SELECT game_date INTO game_dt FROM FIFAGame WHERE game_id = NEW.game_id;
    SELECT date_of_birth INTO member_dob FROM ClubMember WHERE membership_number = NEW.membership_number;

    IF TIMESTAMPDIFF(YEAR, member_dob, game_dt) < 18 THEN
        SET required_fee = 100.00;

        SELECT COUNT(*) INTO family_count
          FROM ClubMemberFamilyRelation cfr
         WHERE cfr.membership_number = NEW.membership_number
           AND cfr.start_date <= game_dt
           AND (cfr.end_date IS NULL OR cfr.end_date >= game_dt);

        IF family_count = 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Minor club member must have a family member relationship active on the game date.';
        END IF;
    ELSE
        SET required_fee = 200.00;
    END IF;

    SELECT COALESCE(SUM(amount), 0) INTO paid_amount FROM Payment
     WHERE membership_number = NEW.membership_number AND membership_year = YEAR(game_dt);

    IF paid_amount < required_fee THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member is not eligible: membership fee for the game year is not fully paid.';
    END IF;
END$$

-- 8) ClubMemberFamilyRelation: a minor's last active family relation cannot
--    be deleted or end-dated, keeping the invariant that every active minor
--    always has at least one linked family member.
CREATE TRIGGER trg_family_relation_before_delete
BEFORE DELETE ON ClubMemberFamilyRelation
FOR EACH ROW
BEGIN
    DECLARE member_dob DATE;
    DECLARE other_active INT DEFAULT 0;

    SELECT date_of_birth INTO member_dob
      FROM ClubMember
     WHERE membership_number = OLD.membership_number;

    IF TIMESTAMPDIFF(YEAR, member_dob, CURDATE()) < 18 THEN
        SELECT COUNT(*) INTO other_active
          FROM ClubMemberFamilyRelation cfr
         WHERE cfr.membership_number = OLD.membership_number
           AND cfr.relation_id <> OLD.relation_id
           AND cfr.start_date <= CURDATE()
           AND (cfr.end_date IS NULL OR cfr.end_date >= CURDATE());

        IF other_active = 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Cannot remove this family relation: a minor club member must always have at least one active linked family member.';
        END IF;
    END IF;
END$$

CREATE TRIGGER trg_family_relation_before_update
BEFORE UPDATE ON ClubMemberFamilyRelation
FOR EACH ROW
BEGIN
    DECLARE member_dob DATE;
    DECLARE new_still_active INT DEFAULT 0;
    DECLARE other_active INT DEFAULT 0;

    SELECT date_of_birth INTO member_dob
      FROM ClubMember
     WHERE membership_number = NEW.membership_number;

    IF TIMESTAMPDIFF(YEAR, member_dob, CURDATE()) < 18 THEN
        IF NEW.start_date <= CURDATE()
           AND (NEW.end_date IS NULL OR NEW.end_date >= CURDATE()) THEN
            SET new_still_active = 1;
        END IF;

        IF new_still_active = 0 THEN
            SELECT COUNT(*) INTO other_active
              FROM ClubMemberFamilyRelation cfr
             WHERE cfr.membership_number = NEW.membership_number
               AND cfr.relation_id <> OLD.relation_id
               AND cfr.start_date <= CURDATE()
               AND (cfr.end_date IS NULL OR cfr.end_date >= CURDATE());

            IF other_active = 0 THEN
                SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Cannot update this family relation: a minor club member must always have at least one active linked family member.';
            END IF;
        END IF;
    END IF;
END$$

DELIMITER ;
