-- OPS-1: Location CRUD
USE wqc353_1;

-- CREATE: Add a new Location
INSERT INTO Location (location_type, name, address, city, province, postal_code, web_address, capacity)
VALUES ('Branch', 'CSCS Lachine Branch', '10 Rue Notre-Dame', 'Montreal', 'QC', 'H8S1A1', 'https://lachine.cscs.ca', 140);

SET @new_location_id = LAST_INSERT_ID();

INSERT INTO LocationPhone (location_id, phone_number)
VALUES (@new_location_id, '514-555-0500');

-- DISPLAY: Show all locations with phone numbers
SELECT
    l.location_id,
    l.location_type,
    l.name,
    l.address,
    l.city,
    l.province,
    l.postal_code,
    l.web_address,
    l.capacity,
    GROUP_CONCAT(lp.phone_number SEPARATOR ', ') AS phone_numbers
FROM Location l
LEFT JOIN LocationPhone lp ON l.location_id = lp.location_id
GROUP BY l.location_id
ORDER BY l.location_id;

-- EDIT: Update an existing Location (Verdun Branch, id = 8)
UPDATE Location
SET capacity = 145,
    web_address = 'https://verdun.cscs.ca/new'
WHERE location_id = 8;

-- DELETE: Remove a Location (only works if unreferenced elsewhere)
DELETE FROM Location WHERE location_id = 10;


-- OPS-2: Personnel CRUD

-- CREATE: Add a new Personnel + assign them to a location
INSERT INTO Personnel (first_name, last_name, date_of_birth, ssn, medicare_number,
                        phone_number, address, city, province, postal_code, email, role, mandate)
VALUES ('Karine', 'Beaulieu', '1991-06-18', '111-222-333', 'BEAU91061899',
        '514-555-1011', '5 Rue Ontario', 'Montreal', 'QC', 'H2X3X3',
        'karine.beaulieu@cscs.ca', 'Coach', 'Volunteer');

SET @new_personnel_id = LAST_INSERT_ID();

INSERT INTO PersonnelAssignment (personnel_id, location_id, start_date, end_date)
VALUES (@new_personnel_id, 7, CURDATE(), NULL);  -- location_id 7 = Plateau Branch

-- DISPLAY: Show all personnel with current location and role
SELECT
    p.personnel_id,
    p.first_name,
    p.last_name,
    p.role,
    p.mandate,
    p.email,
    p.phone_number,
    l.name AS current_location,
    pa.start_date
FROM Personnel p
LEFT JOIN PersonnelAssignment pa ON pa.personnel_id = p.personnel_id AND pa.end_date IS NULL
LEFT JOIN Location l ON l.location_id = pa.location_id
ORDER BY p.personnel_id;

-- EDIT: Update a Personnel record (Eric Fortin, personnel_id = 5)
UPDATE Personnel
SET phone_number = '514-555-9999',
    email = 'eric.fortin.updated@cscs.ca'
WHERE personnel_id = 5;

-- DELETE: Remove a Personnel record (David Cloutier, id = 10 — has no active assignment)
DELETE FROM Personnel WHERE personnel_id = 10;

-- Demonstrate SSN uniqueness enforcement (reuses Marc Tremblay's SSN — must fail)
INSERT INTO Personnel (first_name, last_name, date_of_birth, ssn, medicare_number,
                        phone_number, address, city, province, postal_code, email, role, mandate)
VALUES ('Fake', 'Duplicate', '1985-01-01', '111-111-111', 'DIFFERENT99',
        '514-555-0000', '1 Fake St', 'Montreal', 'QC', 'H1H1H1',
        'fake@cscs.ca', 'Coach', 'Volunteer');
-- Expected: ERROR 1062 (23000): Duplicate entry '111-111-111' for key 'personnel.ssn'

-- Demonstrate Medicare# uniqueness enforcement (reuses Marc Tremblay's number — must fail)
INSERT INTO Personnel (first_name, last_name, date_of_birth, ssn, medicare_number,
                        phone_number, address, city, province, postal_code, email, role, mandate)
VALUES ('Fake2', 'Duplicate2', '1985-01-01', '900-900-900', 'TREM75031299',
        '514-555-0001', '2 Fake St', 'Montreal', 'QC', 'H1H1H2',
        'fake2@cscs.ca', 'Coach', 'Volunteer');
-- Expected: ERROR 1062 (23000): Duplicate entry 'TREM75031299' for key 'personnel.medicare_number'
