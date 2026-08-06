-- Country Soccer Club System - Triggers
-- Item 6: "Create at least one trigger to execute some of the requirements
-- specified in the description above."
--
-- Applied separately from 01_schema.sql (not part of docker-entrypoint-initdb.d)
-- so it can be reviewed/demoed on its own. Run after 01_schema.sql + 02_seed.sql:
--   mysql -u <user> -p wqc353_1 < sql/05_trigger.sql

USE wqc353_1;

DROP TRIGGER IF EXISTS trg_team_formation_assignment_before_insert;

DELIMITER $$

-- BEFORE INSERT on TeamFormationAssignment enforces three business rules
-- from the spec that cannot be expressed with a plain FK/CHECK constraint,
-- because each one requires comparing the new row against other rows
-- (in this table or a related one):
--
--   1. Location match: every player assigned to a TeamFormation must be a
--      club member currently at that formation's location.
--   2. Boys/girls homogeneity: all players in one TeamFormation must share
--      the same gender as the formation's team_category.
--   3. Conflict rule: a club member cannot be assigned to two formations on
--      the same calendar day unless the sessions' start times are at least
--      3 hours apart (violating assignment rejected) -- this is item 21's
--      integrity-demonstration requirement.
CREATE TRIGGER trg_team_formation_assignment_before_insert
BEFORE INSERT ON TeamFormationAssignment
FOR EACH ROW
BEGIN
    DECLARE new_session_dt DATETIME;
    DECLARE new_location INT;
    DECLARE new_category ENUM('Boys', 'Girls');
    DECLARE member_gender ENUM('Male', 'Female');
    DECLARE member_location INT;
    DECLARE conflict_count INT DEFAULT 0;

    -- New formation's session datetime, location, and boys/girls category
    SELECT s.session_datetime, tf.location_id, tf.team_category
      INTO new_session_dt, new_location, new_category
      FROM TeamFormation tf
      JOIN Session s ON s.session_id = tf.session_id
     WHERE tf.formation_id = NEW.formation_id;

    -- Club member's current gender and current location
    SELECT gender, location_id
      INTO member_gender, member_location
      FROM ClubMember
     WHERE membership_number = NEW.membership_number;

    -- Rule 1: club member must be at the same location as the formation
    IF member_location <> new_location THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member location does not match the team formation location.';
    END IF;

    -- Rule 2: club member's gender must match the formation's boys/girls category
    IF (new_category = 'Boys' AND member_gender <> 'Male')
       OR (new_category = 'Girls' AND member_gender <> 'Female') THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Club member gender does not match the team formation category (boys/girls homogeneity rule).';
    END IF;

    -- Rule 3: same club member, same calendar day, formation start times
    -- less than 3 hours apart => reject
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
            SET MESSAGE_TEXT = 'Conflicting assignment: club member is already assigned to a formation on the same day within 3 hours.';
    END IF;
END$$

DELIMITER ;
