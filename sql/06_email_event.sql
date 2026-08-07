-- Country Soccer Club System - Automatic Sunday Email Log Generation
-- No real emails are sent. Each generated schedule email is represented by a row in EmailLog.

USE wqc353_1;

DROP EVENT IF EXISTS ev_sunday_schedule_emails;
DROP PROCEDURE IF EXISTS sp_generate_weekly_schedule_emails;

DELIMITER $$

CREATE PROCEDURE sp_generate_weekly_schedule_emails(IN p_from_date DATE)
BEGIN
    DECLARE v_start_date DATE;
    DECLARE v_end_date DATE;

    SET v_start_date = COALESCE(p_from_date, CURDATE());
    SET v_end_date = DATE_ADD(v_start_date, INTERVAL 7 DAY);

    
    -- Generate one log row per player/formation for sessions in the next 7 days.
    
    INSERT INTO EmailLog
        (email_date, membership_number, formation_id, subject, body_snippet)
    SELECT
        CURDATE(),
        cm.membership_number,
        tf.formation_id,
        LEFT(
            CONCAT(
                tf.team_name, ' ',
                DATE_FORMAT(s.session_datetime, '%Y-%m-%d %H:%i:%s'), ' ',
                LOWER(s.session_type), ' session'
            ),
            150
        ) AS subject,
        LEFT(
            CONCAT(
                'Hello ', cm.first_name, ' ', cm.last_name,
                ', you are assigned as ', tfa.role,
                '. Head coach: ', p.first_name, ' ', p.last_name,
                ' (', COALESCE(p.email, 'no email'), '). ',
                s.session_type, ' at ', s.address, '.'
            ),
            100
        ) AS body_snippet
    FROM TeamFormation tf
    JOIN Session s
      ON s.session_id = tf.session_id
    JOIN Location l
      ON l.location_id = tf.location_id
    JOIN Personnel p
      ON p.personnel_id = tf.head_coach_id
    JOIN TeamFormationAssignment tfa
      ON tfa.formation_id = tf.formation_id
    JOIN ClubMember cm
      ON cm.membership_number = tfa.membership_number
    WHERE s.session_datetime >= v_start_date
      AND s.session_datetime < v_end_date
      AND NOT EXISTS (
          SELECT 1
          FROM EmailLog el
          WHERE el.membership_number = cm.membership_number
            AND el.formation_id = tf.formation_id
      );

    -- Return the generated/logged rows for easy demo/testing in SQL clients.
    SELECT
        el.email_id,
        el.email_date,
        l.name AS sender_name,
        cm.email AS receiver_email,
        el.membership_number,
        el.formation_id,
        el.subject,
        el.body_snippet,
        s.session_datetime
    FROM EmailLog el
    JOIN ClubMember cm
      ON cm.membership_number = el.membership_number
    JOIN TeamFormation tf
      ON tf.formation_id = el.formation_id
    JOIN Location l
      ON l.location_id = tf.location_id
    JOIN Session s
      ON s.session_id = tf.session_id
    WHERE s.session_datetime >= v_start_date
      AND s.session_datetime < v_end_date
    ORDER BY s.session_datetime, tf.team_name, cm.last_name, cm.first_name;
END$$

/*
  Automatically runs every Sunday at 09:00 server time.
  MySQL's event scheduler must be enabled on the database server.
*/
CREATE EVENT ev_sunday_schedule_emails
ON SCHEDULE
    EVERY 1 WEEK
    STARTS (
        CURRENT_DATE
        + INTERVAL MOD(6 - WEEKDAY(CURRENT_DATE) + 7, 7) DAY
        + INTERVAL 9 HOUR
    )
DO
BEGIN
    CALL sp_generate_weekly_schedule_emails(CURDATE());
END$$

DELIMITER ;


-- to view the resulting logs with sender/receiver derived from related tables:
-- SELECT el.email_id, el.email_date,
--        l.name AS sender_name,
--        cm.email AS receiver_email,
--        el.subject, el.body_snippet
-- FROM EmailLog el
-- JOIN ClubMember cm ON cm.membership_number = el.membership_number
-- JOIN TeamFormation tf ON tf.formation_id = el.formation_id
-- JOIN Location l ON l.location_id = tf.location_id
-- ORDER BY el.email_id DESC;
