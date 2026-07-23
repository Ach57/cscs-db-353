-- =========================================================
-- CSCS (Country Soccer Club System) - Seed Data
-- Insert order respects FK dependencies:
-- Location -> LocationPhone
-- Personnel -> PersonnelAssignment
-- FamilyMember -> FamilyMemberAssignment
-- Location -> ClubMember -> ClubMemberFamilyRelation
-- Hobby -> ClubMemberHobby
-- ClubMember -> Payment
-- Location -> FIFAGame -> FIFAParticipation
-- =========================================================

USE cscs;

-- =========================================
-- Table: Location
-- =========================================
INSERT INTO Location (location_id, location_type, name, address, city, province, postal_code, web_address, capacity) VALUES
(1, 'Head',   'CSCS Head Office',   '100 Rue Sainte-Catherine', 'Montreal',   'QC', 'H2X1K4', 'https://cscs.ca',        500),
(2, 'Branch', 'CSCS West Branch',   '450 Boulevard Curé-Labelle', 'Laval',    'QC', 'H7P2P2', 'https://west.cscs.ca',   200),
(3, 'Branch', 'CSCS East Branch',   '25 Rue Saint-Charles',     'Longueuil',  'QC', 'J4H1E5', 'https://east.cscs.ca',   150);

-- =========================================
-- Table: LocationPhone
-- =========================================
INSERT INTO LocationPhone (location_id, phone_number) VALUES
(1, '514-555-0100'),
(1, '514-555-0101'),
(2, '450-555-0200'),
(3, '450-555-0300');

-- =========================================
-- Table: Personnel
-- =========================================
INSERT INTO Personnel (personnel_id, first_name, last_name, date_of_birth, ssn, medicare_number, phone_number, address, city, province, postal_code, email, role, mandate) VALUES
(1, 'Marc',    'Tremblay',  '1975-03-12', '111-111-111', 'TREM75031299', '514-555-1001', '12 Rue Principale', 'Montreal',  'QC', 'H1A1A1', 'marc.tremblay@cscs.ca',   'General Manager', 'Salaried'),
(2, 'Julie',   'Bouchard',  '1982-07-04', '222-222-222', 'BOUC82070499', '514-555-1002', '34 Avenue du Parc',  'Montreal',  'QC', 'H2B2B2', 'julie.bouchard@cscs.ca',  'Treasurer',        'Salaried'),
(3, 'Simon',   'Roy',       '1990-11-23', '333-333-333', 'ROYS90112399', '450-555-1003', '56 Rue des Érables', 'Laval',     'QC', 'H7C3C3', 'simon.roy@cscs.ca',       'Coach',            'Volunteer'),
(4, 'Nadia',   'Cormier',   '1988-01-30', '444-444-444', 'CORM88013099', '450-555-1004', '78 Rue de la Gare',  'Longueuil', 'QC', 'J4D4D4', 'nadia.cormier@cscs.ca',   'Secretary',        'Volunteer'),
(5, 'Eric',    'Fortin',    '1995-05-17', '555-555-555', 'FORT95051799', '514-555-1005', '90 Rue Saint-Denis', 'Montreal',  'QC', 'H2E5E5', 'eric.fortin@cscs.ca',     'Assistant Coach',  'Volunteer');

-- =========================================
-- Table: PersonnelAssignment
-- =========================================
INSERT INTO PersonnelAssignment (assignment_id, personnel_id, location_id, start_date, end_date) VALUES
(1, 1, 1, '2019-01-01', NULL),        -- current GM at Head office
(2, 2, 1, '2020-06-01', NULL),        -- current Treasurer at Head office
(3, 3, 2, '2021-03-15', NULL),        -- current Coach at West branch
(4, 4, 3, '2022-02-01', NULL),        -- current Secretary at East branch
(5, 5, 2, '2018-09-01', '2021-03-01'),-- past Assistant Coach assignment at West branch
(6, 5, 3, '2021-03-16', NULL);        -- same person, now current at East branch

-- =========================================
-- Table: FamilyMember
-- =========================================
INSERT INTO FamilyMember (family_member_id, first_name, last_name, date_of_birth, ssn, medicare_number, phone_number, address, city, province, postal_code, email) VALUES
(1, 'Denise',  'Lavoie',   '1970-04-08', '666-666-666', 'LAVO70040899', '514-555-2001', '15 Rue Sherbrooke', 'Montreal',  'QC', 'H2F6F6', 'denise.lavoie@email.com'),
(2, 'Patrick', 'Girard',   '1972-09-19', '777-777-777', 'GIRA72091999', '450-555-2002', '27 Rue Lévis',      'Laval',     'QC', 'H7G7G7', 'patrick.girard@email.com'),
(3, 'Chantal', 'Bergeron', '1980-12-01', '888-888-888', 'BERG80120199', '450-555-2003', '39 Rue Fournier',   'Longueuil', 'QC', 'J4H8H8', 'chantal.bergeron@email.com'),
(4, 'Alain',   'Morin',    '1978-06-25', '999-999-999', 'MORI78062599', '514-555-2004', '41 Rue Rachel',     'Montreal',  'QC', 'H2I9I9', 'alain.morin@email.com');

-- =========================================
-- Table: FamilyMemberAssignment
-- =========================================
INSERT INTO FamilyMemberAssignment (assignment_id, family_member_id, location_id, start_date, end_date) VALUES
(1, 1, 1, '2020-01-10', NULL),
(2, 2, 2, '2021-04-01', NULL),
(3, 3, 3, '2022-05-15', NULL),
(4, 4, 1, '2019-08-01', '2023-01-01');

-- =========================================
-- Table: ClubMember
-- =========================================
INSERT INTO ClubMember (membership_number, location_id, first_name, last_name, date_of_birth, registration_date, height_cm, weight_kg, ssn, medicare_number, phone_number, address, city, province, postal_code) VALUES
(1, 1, 'Thomas',  'Lavoie',   '2010-02-14', '2022-08-01', 155.00, 45.50, 'M100000001', 'LAVO10021499', '514-555-3001', '15 Rue Sherbrooke', 'Montreal',  'QC', 'H2F6F6'),
(2, 1, 'Sophie',  'Bélanger', '2008-06-30', '2021-09-05', 162.00, 52.00, 'M100000002', 'BELA08063099', '514-555-3002', '20 Rue Ontario',    'Montreal',  'QC', 'H2K1K1'),
(3, 2, 'Maxime',  'Girard',   '2011-11-02', '2023-01-15', 148.00, 40.00, 'M100000003', 'GIRA11110299', '450-555-3003', '27 Rue Lévis',      'Laval',     'QC', 'H7G7G7'),
(4, 2, 'Camille', 'Dubois',   '2005-03-19', '2020-02-20', 170.00, 60.00, 'M100000004', 'DUBO05031999', '450-555-3004', '10 Rue des Pins',   'Laval',     'QC', 'H7L2L2'),
(5, 3, 'Antoine', 'Bergeron', '2012-09-08', '2023-06-10', 140.00, 36.00, 'M100000005', 'BERG12090899', '450-555-3005', '39 Rue Fournier',   'Longueuil', 'QC', 'J4H8H8'),
(6, 3, 'Laurie',  'Pelletier','2007-12-25', '2021-11-01', 158.00, 48.00, 'M100000006', 'PELL07122599', '450-555-3006', '5 Rue Curé-Poirier','Longueuil', 'QC', 'J4J3J3'),
(7, 1, 'Gabriel', 'Morin',    '2006-04-17', '2020-09-01', 168.00, 58.00, 'M100000007', 'MORI06041799', '514-555-3007', '41 Rue Rachel',     'Montreal',  'QC', 'H2I9I9'),
(8, 2, 'Emma',    'Roy',      '2013-01-05', '2024-01-20', 135.00, 32.00, 'M100000008', 'ROYE13010599', '450-555-3008', '56 Rue des Érables','Laval',     'QC', 'H7C3C3');

-- =========================================
-- Table: ClubMemberFamilyRelation
-- =========================================
INSERT INTO ClubMemberFamilyRelation (relation_id, membership_number, family_member_id, relationship_type, start_date, end_date) VALUES
(1, 1, 1, 'Mother', '2022-08-01', NULL),
(2, 3, 2, 'Father',  '2023-01-15', NULL),
(3, 5, 3, 'Mother',  '2023-06-10', NULL),
(4, 7, 4, 'Father',  '2020-09-01', NULL);

-- =========================================
-- Table: Hobby
-- =========================================
INSERT INTO Hobby (hobby_id, hobby_name) VALUES
(1, 'Reading'),
(2, 'Swimming'),
(3, 'Video Games'),
(4, 'Music'),
(5, 'Chess');

-- =========================================
-- Table: ClubMemberHobby
-- =========================================
INSERT INTO ClubMemberHobby (membership_number, hobby_id) VALUES
(1, 2), (1, 5),                -- Thomas: Swimming, Chess
(2, 1), (2, 4),                -- Sophie: Reading, Music
(3, 3),                        -- Maxime: Video Games
(4, 1), (4, 2), (4, 4),        -- Camille: Reading, Swimming, Music
(5, 5),                        -- Antoine: Chess
(6, 3), (6, 1),                -- Laurie: Video Games, Reading
(7, 2),                        -- Gabriel: Swimming
(8, 4);                        -- Emma: Music

-- =========================================
-- Table: Payment
-- =========================================
INSERT INTO Payment (payment_id, membership_number, payment_date, amount, payment_method, membership_year, installment_number) VALUES
-- Thomas: paid in full
(1, 1, '2024-08-01', 300.00, 'Debit',  2024, 1),
-- Sophie: paid in 2 installments
(2, 2, '2024-09-01', 150.00, 'Credit', 2024, 1),
(3, 2, '2024-11-01', 150.00, 'Credit', 2024, 2),
-- Maxime: paid in full
(4, 3, '2024-01-15', 300.00, 'Cash',   2024, 1),
-- Camille: paid in 4 installments
(5, 4, '2024-02-20', 75.00,  'Debit',  2024, 1),
(6, 4, '2024-05-20', 75.00,  'Debit',  2024, 2),
(7, 4, '2024-08-20', 75.00,  'Debit',  2024, 3),
(8, 4, '2024-11-20', 75.00,  'Debit',  2024, 4),
-- Antoine: paid in full
(9, 5, '2024-06-10', 300.00, 'Cash',   2024, 1),
-- Laurie: paid in 2 installments
(10, 6, '2024-11-01', 150.00, 'Credit', 2024, 1),
(11, 6, '2025-01-01', 150.00, 'Credit', 2024, 2),
-- Gabriel: paid in full
(12, 7, '2024-09-01', 300.00, 'Debit',  2024, 1),
-- Emma: only first installment so far (still owes the rest)
(13, 8, '2024-01-20', 75.00,  'Cash',   2024, 1);

-- =========================================
-- Table: FIFAGame
-- =========================================
INSERT INTO FIFAGame (game_id, location_id, team_name, opponent_name, game_date, team_score, opponent_score) VALUES
(1, 1, 'CSCS Head Office', 'Montreal United',   '2024-03-10', 3, 1),
(2, 2, 'CSCS West Branch', 'Laval Rovers',       '2024-04-05', 2, 2),
(3, 3, 'CSCS East Branch', 'Longueuil FC',       '2024-05-12', 1, 4),
(4, 1, 'CSCS Head Office', 'South Shore Kickers','2024-06-20', 5, 0);

-- =========================================
-- Table: FIFAParticipation
-- =========================================
INSERT INTO FIFAParticipation (game_id, membership_number) VALUES
(1, 1), (1, 2), (1, 7),        -- Game 1: Thomas, Sophie, Gabriel
(2, 3), (2, 4), (2, 8),        -- Game 2: Maxime, Camille, Emma
(3, 5), (3, 6),                -- Game 3: Antoine, Laurie
(4, 1), (4, 2), (4, 7);        -- Game 4: Thomas, Sophie, Gabriel again (repeat participants)