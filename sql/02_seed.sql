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

USE wqc353_1;

-- =========================================
-- Table: Location
-- =========================================
INSERT INTO Location (location_id, location_type, name, address, city, province, postal_code, web_address, capacity) VALUES
(1, 'Head',   'CSCS Head Office',   '100 Rue Sainte-Catherine', 'Montreal',   'QC', 'H2X1K4', 'https://cscs.ca',        500),
(2, 'Branch', 'CSCS West Branch',   '450 Boulevard Curé-Labelle', 'Laval',    'QC', 'H7P2P2', 'https://west.cscs.ca',   200),
(3, 'Branch', 'CSCS East Branch',   '25 Rue Saint-Charles',     'Longueuil',  'QC', 'J4H1E5', 'https://east.cscs.ca',   150),
(4,  'Branch', 'CSCS North Branch',    '200 Boulevard Laurentien',        'Saint-Laurent', 'QC', 'H4M2M2', 'https://north.cscs.ca',    175),
(5,  'Branch', 'CSCS South Branch',    '300 Rue Taschereau',              'Brossard',      'QC', 'J4Y1A1', 'https://south.cscs.ca',    180),
(6,  'Branch', 'CSCS Central Branch',  '500 Rue Sainte-Anne',             'Varennes',      'QC', 'J3X1P7', 'https://central.cscs.ca',  160),
(7,  'Branch', 'CSCS Plateau Branch',  '80 Avenue du Mont-Royal E',       'Montreal',      'QC', 'H2T1P1', 'https://plateau.cscs.ca',  120),
(8,  'Branch', 'CSCS Verdun Branch',   '5 Rue de Verdun',                 'Montreal',      'QC', 'H4G2M5', 'https://verdun.cscs.ca',   130),
(9,  'Branch', 'CSCS Rive-Nord Branch','750 Chemin du Bas-de-la-Riviere', 'Terrebonne',    'QC', 'J6W1A3', 'https://rivenord.cscs.ca', 140),
(10, 'Branch', 'CSCS Anjou Branch',    '7000 Rue Sherbrooke E',           'Montreal',      'QC', 'H1K1C5', 'https://anjou.cscs.ca',    110);

-- =========================================
-- Table: LocationPhone
-- =========================================
INSERT INTO LocationPhone (location_id, phone_number) VALUES
(1, '514-555-0100'),
(1, '514-555-0101'),
(2, '450-555-0200'),
(3, '450-555-0300'),
(4, '450-555-0400'),
(5, '450-555-0500'),
(6, '450-555-0600'),
(7, '514-555-0700'),
(8, '514-555-0800'),
(9, '450-555-0900'),
(10, '514-566-0120');

-- =========================================
-- Table: Personnel
-- =========================================
INSERT INTO Personnel (personnel_id, first_name, last_name, date_of_birth, ssn, medicare_number, phone_number, address, city, province, postal_code, email, role, mandate) VALUES
(1, 'Marc',    'Tremblay',  '1975-03-12', '111-111-111', 'TREM75031299', '514-555-1001', '12 Rue Principale', 'Montreal',  'QC', 'H1A1A1', 'marc.tremblay@cscs.ca',   'General Manager', 'Salaried'),
(2, 'Julie',   'Bouchard',  '1982-07-04', '222-222-222', 'BOUC82070499', '514-555-1002', '34 Avenue du Parc',  'Montreal',  'QC', 'H2B2B2', 'julie.bouchard@cscs.ca',  'Treasurer',        'Salaried'),
(3, 'Simon',   'Roy',       '1990-11-23', '333-333-333', 'ROYS90112399', '450-555-1003', '56 Rue des Érables', 'Laval',     'QC', 'H7C3C3', 'simon.roy@cscs.ca',       'Coach',            'Volunteer'),
(4, 'Nadia',   'Cormier',   '1988-01-30', '444-444-444', 'CORM88013099', '450-555-1004', '78 Rue de la Gare',  'Longueuil', 'QC', 'J4D4D4', 'nadia.cormier@cscs.ca',   'Secretary',        'Volunteer'),
(5, 'Eric',    'Fortin',    '1995-05-17', '555-555-555', 'FORT95051799', '514-555-1005', '90 Rue Saint-Denis', 'Montreal',  'QC', 'H2E5E5', 'eric.fortin@cscs.ca',     'Assistant Coach',  'Volunteer'),
(6,  'Luc',       'Gauthier',  '1985-06-14', '601-111-111', 'GAUT85061499', '514-555-1006', '22 Rue Masson',       'Montreal',   'QC', 'H2S2S2', 'luc.gauthier@cscs.ca',     'Deputy Manager', 'Salaried'),
(7,  'Isabeau',   'Pelletier', '1992-08-20', '602-111-111', 'PELL92082099', '514-555-1007', '63 Rue Beaubien',     'Montreal',   'QC', 'H2G3G3', 'isabeau.pelletier@cscs.ca','Captain',         'Volunteer'),
(8,  'Francois',  'Lapointe',  '1987-04-05', '603-111-111', 'LAPO87040599', '450-555-1008', '15 Rue Joliette',     'Brossard',   'QC', 'J4X4X4', 'francois.lapointe@cscs.ca','Administrator',  'Salaried'),
(9,  'Marie-Eve', 'Ouellet',   '1993-12-11', '604-111-111', 'OUEL93121199', '450-555-1009', '88 Rue des Saules',   'Terrebonne', 'QC', 'J6W2W2', 'marieeve.ouellet@cscs.ca', 'Coach',           'Salaried'),
(10, 'David',     'Cloutier',  '1980-09-03', '605-111-111', 'CLOU80090399', '514-555-1010', '44 Rue Notre-Dame O', 'Montreal',   'QC', 'H3C3C3', 'david.cloutier@cscs.ca',   'Secretary',       'Volunteer');

-- =========================================
-- Table: PersonnelAssignment
-- =========================================
INSERT INTO PersonnelAssignment (assignment_id, personnel_id, location_id, start_date, end_date) VALUES
(1, 1, 1, '2019-01-01', NULL),        -- current GM at Head office
(2, 2, 1, '2020-06-01', NULL),        -- current Treasurer at Head office
(3, 3, 2, '2021-03-15', NULL),        -- current Coach at West branch
(4, 4, 3, '2022-02-01', NULL),        -- current Secretary at East branch
(5, 5, 2, '2018-09-01', '2021-03-01'),-- past Assistant Coach assignment at West branch
(6, 5, 3, '2021-03-16', NULL),        -- same person, now current at East branch
(7,  6,  1, '2022-01-10', NULL),   -- Luc: Deputy Manager at Head office
(8,  7,  4, '2023-03-01', NULL),   -- Isabeau: Captain at North branch
(9,  8,  5, '2023-07-15', NULL),   -- Francois: Administrator at South branch
(10, 9,  6, '2024-01-01', NULL);   -- Marie-Eve: Coach at Central branch

-- =========================================
-- Table: FamilyMember
-- =========================================
INSERT INTO FamilyMember (family_member_id, first_name, last_name, date_of_birth, ssn, medicare_number, phone_number, address, city, province, postal_code, email) VALUES
(1, 'Denise',  'Lavoie',   '1970-04-08', '666-666-666', 'LAVO70040899', '514-555-2001', '15 Rue Sherbrooke', 'Montreal',  'QC', 'H2F6F6', 'denise.lavoie@email.com'),
(2, 'Patrick', 'Girard',   '1972-09-19', '777-777-777', 'GIRA72091999', '450-555-2002', '27 Rue Lévis',      'Laval',     'QC', 'H7G7G7', 'patrick.girard@email.com'),
(3, 'Chantal', 'Bergeron', '1980-12-01', '888-888-888', 'BERG80120199', '450-555-2003', '39 Rue Fournier',   'Longueuil', 'QC', 'J4H8H8', 'chantal.bergeron@email.com'),
(4, 'Alain',   'Morin',    '1978-06-25', '999-999-999', 'MORI78062599', '514-555-2004', '41 Rue Rachel',     'Montreal',  'QC', 'H2I9I9', 'alain.morin@email.com'),
(5,  'Robert',  'Tremblay', '1965-07-14', '101-010-101', 'TREM65071499', '514-555-2005', '72 Rue Beaubien',       'Montreal',   'QC', 'H2G3G3', 'robert.tremblay@email.com'),
(6,  'Martine', 'Gagnon',   '1973-02-28', '202-020-202', 'GAGN73022899', '450-555-2006', '100 Rue du Boise',      'Laval',      'QC', 'H7R5R5', 'martine.gagnon@email.com'),
(7,  'Louis',   'Bedard',   '1968-11-09', '303-030-303', 'BEDA68110999', '450-555-2007', '55 Rue des Tilleuls',   'Longueuil',  'QC', 'J4L7L7', 'louis.bedard@email.com'),
(8,  'Sylvie',  'Charron',  '1975-05-03', '404-040-404', 'CHAR75050399', '514-555-2008', '18 Cote-des-Neiges',    'Montreal',   'QC', 'H3H1A1', 'sylvie.charron@email.com'),
(9,  'Pierre',  'Beaumont', '1969-08-16', '505-050-505', 'BEAU69081699', '450-555-2009', '33 Rue Edouard',        'Brossard',   'QC', 'J4Y2Y2', 'pierre.beaumont@email.com'),
(10, 'Helene',  'Leblanc',  '1977-03-22', '606-060-606', 'LEBL77032299', '514-555-2010', '90 Boulevard Decarie',  'Montreal',   'QC', 'H4L3L3', 'helene.leblanc@email.com'),
-- Rows 11-12 deliberately reuse the SSNs of existing MAJOR ClubMembers
-- (Alexandre Gagnon, Isabelle Caron) to represent the same real person
-- appearing both as a paying major club member AND as a guardian of a
-- minor member. This is the overlap Query (vi) requires.
(11, 'Alexandre', 'Gagnon', '1998-08-14', 'M100000009', 'GAGN98081499', '514-555-3009', '72 Rue Saint-Laurent', 'Montreal',  'QC', 'H2Y2Y2', 'alexandre.gagnon@email.com'),
(12, 'Isabelle',  'Caron',  '2001-10-22', 'M100000010', 'CARO01102299', '450-555-3010', '88 Rue Victoria',      'Longueuil', 'QC', 'J4K4K4', 'isabelle.caron@email.com');

-- =========================================
-- Table: FamilyMemberAssignment
-- =========================================
INSERT INTO FamilyMemberAssignment (assignment_id, family_member_id, location_id, start_date, end_date) VALUES
(1, 1, 1, '2020-01-10', NULL),
(2, 2, 2, '2021-04-01', NULL),
(3, 3, 3, '2022-05-15', NULL),
(4, 4, 1, '2019-08-01', '2023-01-01'),
(5,  5,  4, '2023-03-01', NULL),
(6,  6,  2, '2021-09-15', NULL),
(7,  7,  3, '2022-11-01', NULL),
(8,  8,  5, '2023-08-20', NULL),
(9,  9,  1, '2024-01-05', NULL),
(10, 10, 6, '2024-03-10', NULL),
(11, 11, 1, '2023-05-10', NULL),  -- Alexandre Gagnon, at Head office
(12, 12, 3, '2024-02-15', NULL);  -- Isabelle Caron, at East branch

-- =========================================
-- Table: ClubMember
-- =========================================
INSERT INTO ClubMember (membership_number, location_id, first_name, last_name, date_of_birth, gender, registration_date, height_cm, weight_kg, ssn, medicare_number, phone_number, address, city, province, postal_code, email) VALUES
(1, 1, 'Thomas',  'Lavoie',   '2010-02-14', 'Male'  ,'2022-08-01', 155.00, 45.50, 'M100000001', 'LAVO10021499', '514-555-3001', '15 Rue Sherbrooke', 'Montreal',  'QC', 'H2F6F6', 'thomas.lavoie@email.com'),
(2, 1, 'Sophie',  'Belanger', '2008-06-30', 'Female','2021-09-05', 162.00, 52.00, 'M100000002', 'BELA08063099', '514-555-3002', '20 Rue Ontario',    'Montreal',  'QC', 'H2K1K1', 'sophie.belanger@email.com'),
(3, 2, 'Maxime',  'Girard',   '2011-11-02', 'Male'  ,'2023-01-15', 148.00, 40.00, 'M100000003', 'GIRA11110299', '450-555-3003', '27 Rue Lévis',      'Laval',     'QC', 'H7G7G7', 'maxime.girard@email.com'),
(4, 2, 'Camille', 'Dubois',   '2005-03-19', 'Female','2020-02-20', 170.00, 60.00, 'M100000004', 'DUBO05031999', '450-555-3004', '10 Rue des Pins',   'Laval',     'QC', 'H7L2L2', 'camille.dubois@email.com'),
(5, 3, 'Antoine', 'Bergeron', '2012-09-08', 'Male'  ,'2023-06-10', 140.00, 36.00, 'M100000005', 'BERG12090899', '450-555-3005', '39 Rue Fournier',   'Longueuil', 'QC', 'J4H8H8', 'antoine.bergeron@email.com'),
(6, 3, 'Laurie',  'Pelletier','2007-12-25', 'Female','2021-11-01', 158.00, 48.00, 'M100000006', 'PELL07122599', '450-555-3006', '5 Rue Curé-Poirier','Longueuil', 'QC', 'J4J3J3', 'laurie.pelletier@email.com'),
(7, 1, 'Gabriel',   'Morin',    '2006-04-17', 'Male'  ,'2020-09-01', 168.00, 58.00, 'M100000007', 'MORI06041799', '514-555-3007', '41 Rue Rachel',        'Montreal',  'QC', 'H2I9I9', 'gabriel.morin@email.com'),
(8, 2, 'Emma',      'Roy',      '2013-01-05', 'Female','2024-01-20', 135.00, 32.00, 'M100000008', 'ROYE13010599', '450-555-3008', '56 Rue des Érables',   'Laval',     'QC', 'H7C3C3', 'emma.roy@email.com'),
(9, 1, 'Alexandre', 'Gagnon',   '1998-08-14', 'Male'  ,'2023-05-10', 181.00, 76.00, 'M100000009', 'GAGN98081499', '514-555-3009', '72 Rue Saint-Laurent',  'Montreal',  'QC', 'H2Y2Y2', 'alexandre.gagnon@email.com'),
(10,3, 'Isabelle',  'Caron',    '2001-10-22', 'Female','2024-02-15', 168.00, 59.00, 'M100000010', 'CARO01102299', '450-555-3010', '88 Rue Victoria',       'Longueuil', 'QC', 'J4K4K4', 'isabelle.caron@email.com');

-- Alexandre (9) / Isabelle (10) reuse the same address as their matching
-- FamilyMember rows (11/12) since they represent the same real person.

-- =========================================
-- Table: ClubMemberFamilyRelation
-- =========================================
INSERT INTO ClubMemberFamilyRelation (relation_id, membership_number, family_member_id, relationship_type, family_member_type, start_date, end_date) VALUES
(1, 1, 1, 'Mother', 'Primary',   '2022-08-01', NULL),
(2, 3, 2, 'Father',  'Primary',  '2023-01-15', NULL),
(3, 5, 3, 'Mother',  'Primary',  '2023-06-10', NULL),
(4, 7, 4, 'Father',  'Primary',  '2020-09-01', NULL),
(5,  2,  5,  'Father', 'Primary',  '2021-09-05', NULL),
(6,  4,  6,  'Mother', 'Primary',  '2020-02-20', NULL),
(7,  6,  7,  'Father', 'Primary',  '2021-11-01', NULL),
(8,  8,  8,  'Mother', 'Primary',  '2024-01-20', NULL),
(9,  9,  9,  'Father', 'Primary',  '2023-05-10', NULL),
(10, 10, 10, 'Mother', 'Primary',  '2024-02-15', NULL),
(11, 1,  11, 'Father', 'Secondary','2023-05-10', NULL),  -- Alexandre Gagnon is Thomas's father, added on later
(12, 3,  12, 'Mother', 'Secondary','2024-02-15', NULL);  -- Isabelle Caron is Maxime's mother, added on later
-- family_member_type is required (NOT NULL) in the updated schema.
-- Each child's first/only guardian on file = Primary; a second guardian
-- added later (rows 11-12) = Secondary.


-- =========================================
-- Table: Hobby
-- =========================================
INSERT INTO Hobby (hobby_id, hobby_name) VALUES
(1, 'Reading'),
(2, 'Swimming'),
(3, 'Video Games'),
(4, 'Music'),
(5, 'Chess'),
(6,  'Painting'),
(7,  'Cycling'),
(8,  'Cooking'),
(9,  'Photography'),
(10, 'Dancing');

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
(4, 1, 'CSCS Head Office', 'South Shore Kickers','2024-06-20', 5, 0),
(5,  4, 'CSCS North Branch',   'Pointe-Claire FC',   '2024-07-14', 2, 1),
(6,  5, 'CSCS South Branch',   'Brossard United',    '2024-08-03', 0, 3),
(7,  2, 'CSCS West Branch',    'Laval Stars',        '2024-09-21', 4, 2),
(8,  1, 'CSCS Head Office',    'Outremont Athletic', '2024-10-05', 1, 1),
(9,  3, 'CSCS East Branch',    'Greenfield Park SC', '2024-11-02', 3, 0),
(10, 6, 'CSCS Central Branch', 'Varennes City FC',   '2024-12-07', 2, 2);

-- =========================================
-- Table: FIFAParticipation
-- =========================================
INSERT INTO FIFAParticipation (game_id, membership_number) VALUES
(1, 1), (1, 2), (1, 7),        -- Game 1: Thomas, Sophie, Gabriel
(2, 3), (2, 4), (2, 8),        -- Game 2: Maxime, Camille, Emma
(3, 5), (3, 6),                -- Game 3: Antoine, Laurie
(4, 1), (4, 2), (4, 7),        -- Game 4: Thomas, Sophie, Gabriel again (repeat participants)
(5, 3),  (5, 4),  (5, 8),          -- Game 5: Maxime, Camille, Emma
(6, 5),  (6, 6),                   -- Game 6: Antoine, Laurie
(7, 1),  (7, 3),  (7, 4),          -- Game 7: Thomas, Maxime, Camille
(8, 2),  (8, 6),                   -- Game 8: Sophie, Laurie
(9, 7),  (9, 8),                   -- Game 9: Gabriel, Emma
(10, 1), (10, 5),                  -- Game 10: Thomas, Antoine
(2, 2);                            -- Sophie also played Game 2 -> 4 games total
-- Alexandre (9) and Isabelle (10) are deliberately NOT in any game: they
-- are the two major club members Query (iv) needs (major, never played
-- FIFA). Sophie now has 4 games (1,2,4,8), joining Thomas (4 games) so
-- Query (viii) has the required minimum of two qualifying rows.

-- =========================================================
-- Additional seed data for testing Queries 3 and 4
-- =========================================================

-- =========================================
-- Query 3 test data:
-- Club Members with at least 4 hobbies
-- =========================================

-- Camille currently has hobbies 1, 2, and 4.
-- Add hobbies 3 and 5, giving her 5 hobbies.
INSERT INTO ClubMemberHobby (membership_number, hobby_id) VALUES
(4, 3),
(4, 5);

-- Laurie currently has hobbies 1 and 3.
-- Add hobbies 2, 4, and 5, giving her 5 hobbies.
INSERT INTO ClubMemberHobby (membership_number, hobby_id) VALUES
(6, 2),
(6, 4),
(6, 5);

-- =========================================
-- Query 4 test data:
-- =========================================
INSERT INTO Payment (
    payment_id,
    membership_number,
    payment_date,
    amount,
    payment_method,
    membership_year,
    installment_number
) VALUES

-- Camille: major member, owes $200, fully paid => Active
(14, 4, '2025-02-20', 100.00, 'Debit', 2025, 1),
(15, 4, '2025-06-20', 100.00, 'Debit', 2025, 2),

-- Laurie: major by the end of 2025, owes $200,
-- but paid only $100 => Inactive
(16, 6, '2025-03-01', 100.00, 'Credit', 2025, 1),

-- Alexandre: major member, fully paid $200 => Active
(17, 9, '2025-05-10', 200.00, 'Debit', 2025, 1),

-- Isabelle: major member, paid only $100 => Inactive
(18, 10, '2025-04-15', 100.00, 'Cash', 2025, 1);

-- ====================================
-- Session 
-- ====================================
INSERT INTO Session (session_datetime, address, session_type) VALUES
('2026-08-05 18:00:00', '123 Main Street', 'Training'),
('2026-08-06 19:00:00', '456 Park Avenue', 'Training'),
('2026-08-08 15:00:00', '789 Sports Road', 'Game'),
('2026-08-10 18:30:00', '123 Main Street', 'Training'),
('2026-08-12 19:00:00', '456 Park Avenue', 'Training'),
('2026-08-15 14:00:00', '789 Sports Road', 'Game'),
('2026-08-17 18:00:00', '123 Main Street', 'Training'),
('2026-08-20 19:30:00', '456 Park Avenue', 'Training'),
('2026-08-22 16:00:00', '789 Sports Road', 'Game'),
('2026-08-24 18:00:00', '123 Main Street', 'Training');

INSERT INTO TeamFormation
(session_id, location_id, head_coach_id, team_name, score, team_category)
VALUES
(1, 1, 3, 'Red Lions', NULL, 'Boys'),        -- 1: loc1 boys {1,7,9}
(1, 2, 9, 'Green Wolves', NULL, 'Boys'),     -- 2: loc2 boys {3}
(2, 2, 3, 'Golden Eagles', NULL, 'Girls'),   -- 3: loc2 girls {4,8}
(2, 3, 9, 'Silver Wolves', NULL, 'Girls'),   -- 4: loc3 girls {6,10}
(3, 1, 3, 'Red Lions', 2, 'Boys'),           -- 5: loc1 boys {1,9}
(3, 3, 9, 'Blue Hawks', 1, 'Boys'),          -- 6: loc3 boys {5}
(4, 2, 3, 'Golden Eagles', NULL, 'Girls'),   -- 7: loc2 girls {8,4}
(4, 1, 9, 'Silver Foxes', NULL, 'Girls'),    -- 8: loc1 girls {2}
(5, 1, 3, 'Red Lions', NULL, 'Boys'),        -- 9: loc1 boys {7,1}
(5, 2, 9, 'Green Wolves', NULL, 'Boys'),     -- 10: loc2 boys {3}
(6, 3, 3, 'Silver Wolves', 3, 'Girls'),      -- 11: loc3 girls {6,10}
(6, 2, 9, 'Golden Eagles', 2, 'Girls'),      -- 12: loc2 girls {4}
(7, 1, 3, 'Red Lions', NULL, 'Boys'),        -- 13: loc1 boys {9,7}
(7, 3, 9, 'Blue Hawks', NULL, 'Boys'),       -- 14: loc3 boys {5}
(8, 2, 3, 'Golden Eagles', NULL, 'Girls'),   -- 15: loc2 girls {4,8}
(8, 3, 9, 'Silver Wolves', NULL, 'Girls'),   -- 16: loc3 girls {10}
(9, 1, 3, 'Red Lions', 1, 'Boys'),           -- 17: loc1 boys {1,7}
(9, 2, 9, 'Green Wolves', 4, 'Boys'),        -- 18: loc2 boys {3}
(10, 1, 3, 'Silver Foxes', NULL, 'Girls'),   -- 19: loc1 girls {2}
(10, 3, 9, 'Silver Wolves', NULL, 'Girls');  -- 20: loc3 girls {6}

INSERT INTO TeamFormationAssignment
(formation_id, membership_number, role)
VALUES
(1, 1, 'Goalkeeper'), (1, 7, 'Center Back'), (1, 9, 'Striker'),
(2, 3, 'Goalkeeper'),
(3, 4, 'Goalkeeper'), (3, 8, 'Striker'),
(4, 6, 'Goalkeeper'), (4, 10, 'Striker'),
(5, 1, 'Goalkeeper'), (5, 9, 'Striker'),
(6, 5, 'Goalkeeper'),
(7, 8, 'Goalkeeper'), (7, 4, 'Striker'),
(8, 2, 'Goalkeeper'),
(9, 7, 'Goalkeeper'), (9, 1, 'Striker'),
(10, 3, 'Goalkeeper'),
(11, 6, 'Goalkeeper'), (11, 10, 'Striker'),
(12, 4, 'Goalkeeper'),
(13, 9, 'Goalkeeper'), (13, 7, 'Striker'),
(14, 5, 'Goalkeeper'),
(15, 4, 'Goalkeeper'), (15, 8, 'Central Midfielder'),
(16, 10, 'Goalkeeper'),
(17, 1, 'Goalkeeper'), (17, 7, 'Central Midfielder'),
(18, 3, 'Goalkeeper'),
(19, 2, 'Goalkeeper'),
(20, 6, 'Goalkeeper');

INSERT INTO EmailLog
(email_date, membership_number, formation_id, subject, body_snippet)
VALUES
('2026-08-01', 1, 1, 'Upcoming Training Session',
 'Reminder: training session on August 5 at 6 PM.'),
('2026-08-01', 7, 1, 'Upcoming Training Session',
 'Reminder: training session on August 5 at 6 PM.'),
('2026-08-02', 4, 3, 'Upcoming Training Session',
 'Reminder: training session on August 6 at 7 PM.'),
('2026-08-02', 8, 3, 'Upcoming Training Session',
 'Reminder: training session on August 6 at 7 PM.'),
('2026-08-03', 1, 5, 'Game Reminder',
 'Your game is scheduled for August 8 at 3 PM.'),
('2026-08-03', 9, 5, 'Game Reminder',
 'Your game is scheduled for August 8 at 3 PM.'),
('2026-08-05', 8, 7, 'Upcoming Training',
 'Training session scheduled for August 10 at 6:30 PM.'),
('2026-08-05', 4, 7, 'Upcoming Training',
 'Training session scheduled for August 10 at 6:30 PM.'),
('2026-08-08', 6, 11, 'Game Reminder',
 'Your team plays on August 15 at 2 PM.'),
('2026-08-08', 10, 11, 'Game Reminder',
 'Your team plays on August 15 at 2 PM.');

-- Additional relations to create qualifying cases for QUERY-9
-- (family members with >=2 children who each played at least one FIFA game)
INSERT INTO ClubMemberFamilyRelation (relation_id, membership_number, family_member_id, relationship_type, family_member_type, start_date, end_date) VALUES
(13, 2, 1, 'Mother', 'Secondary', '2021-09-05', NULL),
(14, 4, 2, 'Father', 'Secondary', '2020-02-20', NULL),
(15, 6, 3, 'Mother', 'Secondary', '2021-11-01', NULL);  

-- Additional FIFA games + participations to create qualifying cases for QUERY-11
INSERT INTO FIFAGame (game_id, location_id, team_name, opponent_name, game_date, team_score, opponent_score) VALUES
(11, 1, 'CSCS Head Office',  'Rosemont Rangers',   '2025-01-18', 3, 2),
(12, 2, 'CSCS West Branch',  'Laval City FC',      '2025-02-10', 1, 1),
(13, 1, 'CSCS Head Office',  'Villeray United',    '2025-03-05', 4, 0);

INSERT INTO FIFAParticipation (game_id, membership_number) VALUES
(11, 1), (11, 2), (11, 7),      -- Thomas, Sophie, Gabriel each +1
(12, 3), (12, 4), (12, 8),      -- Maxime, Camille, Emma each +1
(13, 1), (13, 7);               -- Thomas, Gabriel each +1 again

-- ADDITION for QUERY-8: ensure locations 4 and 5 each have >=2 FIFA participants
INSERT INTO ClubMember (membership_number, location_id, first_name, last_name, date_of_birth, gender, registration_date, height_cm, weight_kg, ssn, medicare_number, phone_number, address, city, province, postal_code, email) VALUES
(11, 4, 'Julien', 'Beauchamp', '2005-02-11', 'Male', '2023-09-01', 172.00, 63.00, 'M100000011', 'BEAU05021199', '514-555-3011', '10 Rue Prince-Arthur', 'Saint-Laurent', 'QC', 'H4M2M3', 'julien.beauchamp@email.com'),
(12, 4, 'Amelie', 'Rousseau', '2009-07-19', 'Female', '2023-09-01', 150.00, 44.00, 'M100000012', 'ROUS09071999', '514-555-3012', '20 Rue Grenet', 'Saint-Laurent', 'QC', 'H4M2M4', 'amelie.rousseau@email.com'),
(13, 5, 'Olivier', 'Fournier', '2004-12-03', 'Male', '2023-10-01', 175.00, 68.00, 'M100000013', 'FOUR04120399', '450-555-3013', '5 Rue Taschereau', 'Brossard', 'QC', 'J4Y1A2', 'olivier.fournier@email.com'),
(14, 5, 'Chloe', 'Marceau', '2010-04-27', 'Female', '2023-10-01', 148.00, 42.00, 'M100000014', 'MARC10042799', '450-555-3014', '15 Rue Taschereau', 'Brossard', 'QC', 'J4Y1A3', 'chloe.marceau@email.com');

INSERT INTO FIFAParticipation (game_id, membership_number) VALUES
(5, 11), (5, 12),
(6, 13), (6, 14);

-- ADDITION for QUERY-11: give Maxime and Camille a 5th FIFA game each
INSERT INTO FIFAParticipation (game_id, membership_number) VALUES
(3, 3),
(3, 4);

-- ADDITION for QUERY-12: seed Game-type sessions in Jan-May 2025 for 5 locations
INSERT INTO Session (session_datetime, address, session_type) VALUES
('2025-01-10 15:00:00', '789 Sports Road', 'Game'),
('2025-01-25 15:00:00', '789 Sports Road', 'Game'),
('2025-02-08 15:00:00', '789 Sports Road', 'Game'),
('2025-02-22 15:00:00', '789 Sports Road', 'Game'),
('2025-01-12 15:00:00', '456 Park Avenue', 'Game'),
('2025-01-27 15:00:00', '456 Park Avenue', 'Game'),
('2025-02-10 15:00:00', '456 Park Avenue', 'Game'),
('2025-02-24 15:00:00', '456 Park Avenue', 'Game'),
('2025-03-01 15:00:00', '123 Main Street', 'Game'),
('2025-03-15 15:00:00', '123 Main Street', 'Game'),
('2025-03-29 15:00:00', '123 Main Street', 'Game'),
('2025-04-05 15:00:00', '123 Main Street', 'Game'),
('2025-03-03 15:00:00', '200 Boulevard Laurentien', 'Game'),
('2025-03-17 15:00:00', '200 Boulevard Laurentien', 'Game'),
('2025-04-01 15:00:00', '200 Boulevard Laurentien', 'Game'),
('2025-04-15 15:00:00', '200 Boulevard Laurentien', 'Game'),
('2025-04-08 15:00:00', '300 Rue Taschereau', 'Game'),
('2025-04-22 15:00:00', '300 Rue Taschereau', 'Game'),
('2025-05-06 15:00:00', '300 Rue Taschereau', 'Game'),
('2025-05-20 15:00:00', '300 Rue Taschereau', 'Game');

-- New TeamFormation rows tied to those sessions (session_id 11-30, following on from existing 1-10)
INSERT INTO TeamFormation (session_id, location_id, head_coach_id, team_name, score, team_category) VALUES
(11, 1, 3, 'Red Lions', 2, 'Boys'), (12, 1, 3, 'Red Lions', 1, 'Boys'), (13, 1, 3, 'Red Lions', 3, 'Boys'), (14, 1, 3, 'Red Lions', 0, 'Boys'),
(15, 2, 9, 'Green Wolves', 1, 'Boys'), (16, 2, 9, 'Green Wolves', 2, 'Boys'), (17, 2, 9, 'Green Wolves', 0, 'Boys'), (18, 2, 9, 'Green Wolves', 3, 'Boys'),
(19, 3, 9, 'Blue Hawks', 2, 'Boys'), (20, 3, 9, 'Blue Hawks', 1, 'Boys'), (21, 3, 9, 'Blue Hawks', 4, 'Boys'), (22, 3, 9, 'Blue Hawks', 0, 'Boys'),
(23, 4, 7, 'North Falcons', 1, 'Boys'), (24, 4, 7, 'North Falcons', 2, 'Boys'), (25, 4, 7, 'North Falcons', 3, 'Boys'), (26, 4, 7, 'North Falcons', 1, 'Boys'),
(27, 5, 8, 'South Panthers', 2, 'Boys'), (28, 5, 8, 'South Panthers', 0, 'Boys'), (29, 5, 8, 'South Panthers', 1, 'Boys'), (30, 5, 8, 'South Panthers', 3, 'Boys');


-- ADDITION for QUERY-13: active members who played FIFA but were never assigned to a team formation
INSERT INTO ClubMember (membership_number, location_id, first_name, last_name, date_of_birth, gender, registration_date, height_cm, weight_kg, ssn, medicare_number, phone_number, address, city, province, postal_code, email) VALUES
(15, 1, 'Nathan', 'Cote', '2011-03-15', 'Male', '2023-01-10', 145.00, 38.00, 'M100000015', 'COTE11031599', '514-555-3015', '30 Rue Ontario', 'Montreal', 'QC', 'H2K1K2', 'nathan.cote@email.com'),
(16, 2, 'Zoe', 'Perreault', '2010-06-22', 'Female', '2023-01-10', 152.00, 43.00, 'M100000016', 'PERR10062299', '450-555-3016', '35 Rue Lévis', 'Laval', 'QC', 'H7G7G8', 'zoe.perreault@email.com'),
(17, 3, 'Eliot', 'Simard', '2009-09-05', 'Male', '2023-01-10', 160.00, 50.00, 'M100000017', 'SIMA09090599', '450-555-3017', '40 Rue Fournier', 'Longueuil', 'QC', 'J4H8H9', 'eliot.simard@email.com'),
(18, 4, 'Ines', 'Boucher', '2012-01-18', 'Female', '2023-01-10', 140.00, 35.00, 'M100000018', 'BOUC12011899', '450-555-3018', '25 Boulevard Laurentien', 'Saint-Laurent', 'QC', 'H4M2M5', 'ines.boucher@email.com'),
(19, 5, 'Felix', 'Cormier', '2008-11-30', 'Male', '2023-01-10', 165.00, 55.00, 'M100000019', 'CORM08113099', '450-555-3019', '35 Rue Taschereau', 'Brossard', 'QC', 'J4Y1A4', 'felix.cormier@email.com');

INSERT INTO Payment (payment_id, membership_number, payment_date, amount, payment_method, membership_year, installment_number) VALUES
(19, 15, '2025-03-01', 100.00, 'Debit', 2025, 1),
(20, 16, '2025-03-01', 100.00, 'Debit', 2025, 1),
(21, 17, '2025-03-01', 100.00, 'Debit', 2025, 1),
(22, 18, '2025-03-01', 100.00, 'Debit', 2025, 1),
(23, 19, '2025-03-01', 100.00, 'Debit', 2025, 1);

INSERT INTO FIFAParticipation (game_id, membership_number) VALUES
(1, 15),
(2, 16),
(3, 17),
(5, 18),
(6, 19);


-- ADDITION for QUERY-14: one more member who registered as a minor and is now an adult
INSERT INTO ClubMember (membership_number, location_id, first_name, last_name, date_of_birth, gender, registration_date, height_cm, weight_kg, ssn, medicare_number, phone_number, address, city, province, postal_code, email) VALUES
(20, 3, 'Xavier', 'Beaulieu', '2006-05-10', 'Male', '2021-03-15', 178.00, 70.00, 'M100000020', 'BEAU06051099', '450-555-3020', '60 Rue Fournier', 'Longueuil', 'QC', 'J4H8H0', 'xavier.beaulieu@email.com');
