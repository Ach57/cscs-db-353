-- Country Soccer Club System

USE wqc353_1;

CREATE TABLE Location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_type ENUM('Head', 'Branch') NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(150) NOT NULL,
    city VARCHAR(60) NOT NULL,
    province CHAR(2) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    web_address VARCHAR(200),
    capacity INT NOT NULL
);

CREATE TABLE LocationPhone (
    location_id INT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    PRIMARY KEY (location_id, phone_number),
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
        ON DELETE CASCADE
);

CREATE TABLE Personnel (
    personnel_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn VARCHAR(15) NOT NULL UNIQUE,
    medicare_number VARCHAR(20) UNIQUE,
    phone_number VARCHAR(20),
    address VARCHAR(150),
    city VARCHAR(60),
    province CHAR(2),
    postal_code VARCHAR(10),
    email VARCHAR(100),
    role ENUM(
        'General Manager',
        'Deputy Manager',
        'Treasurer',
        'Secretary',
        'Administrator',
        'Captain',
        'Coach',
        'Assistant Coach',
        'Other'
    ) NOT NULL,
    mandate ENUM('Volunteer', 'Salaried') NOT NULL
);

CREATE TABLE PersonnelAssignment (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    personnel_id INT NOT NULL,
    location_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    UNIQUE (personnel_id, location_id, start_date),
    FOREIGN KEY (personnel_id) REFERENCES Personnel(personnel_id),
    FOREIGN KEY (location_id) REFERENCES Location(location_id),
    CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE FamilyMember (
    family_member_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    ssn VARCHAR(15) NOT NULL UNIQUE,
    medicare_number VARCHAR(20) UNIQUE,
    phone_number VARCHAR(20),
    address VARCHAR(150),
    city VARCHAR(60),
    province CHAR(2),
    postal_code VARCHAR(10),
    email VARCHAR(100)
);

CREATE TABLE FamilyMemberAssignment (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY,
    family_member_id INT NOT NULL,
    location_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    UNIQUE (family_member_id, location_id, start_date),
    FOREIGN KEY (family_member_id) REFERENCES FamilyMember(family_member_id),
    FOREIGN KEY (location_id) REFERENCES Location(location_id),
    CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE ClubMember (
    membership_number INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    registration_date DATE NOT NULL,
    height_cm DECIMAL(5,2),
    weight_kg DECIMAL(5,2),
    ssn VARCHAR(15) UNIQUE,
    medicare_number VARCHAR(20) UNIQUE,
    phone_number VARCHAR(20),
    address VARCHAR(150),
    city VARCHAR(60),
    province CHAR(2),
    postal_code VARCHAR(10),
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
);

CREATE TABLE ClubMemberFamilyRelation (
    relation_id INT AUTO_INCREMENT PRIMARY KEY,
    membership_number INT NOT NULL,
    family_member_id INT NOT NULL,
    relationship_type ENUM(
        'Father', 'Mother', 'Grandfather', 'Grandmother',
        'Tutor', 'Partner', 'Friend', 'Other'
    ) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    UNIQUE (membership_number, family_member_id, start_date),
    FOREIGN KEY (membership_number)
        REFERENCES ClubMember(membership_number),
    FOREIGN KEY (family_member_id)
        REFERENCES FamilyMember(family_member_id),
    CHECK (end_date IS NULL OR end_date >= start_date)
);

CREATE TABLE Hobby (
    hobby_id INT AUTO_INCREMENT PRIMARY KEY,
    hobby_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE ClubMemberHobby (
    membership_number INT NOT NULL,
    hobby_id INT NOT NULL,
    PRIMARY KEY (membership_number, hobby_id),
    FOREIGN KEY (membership_number)
        REFERENCES ClubMember(membership_number)
        ON DELETE CASCADE,
    FOREIGN KEY (hobby_id)
        REFERENCES Hobby(hobby_id)
);

CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    membership_number INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('Cash', 'Debit', 'Credit') NOT NULL,
    membership_year YEAR NOT NULL,
    installment_number INT NOT NULL DEFAULT 1,
    UNIQUE (membership_number, membership_year, installment_number),
    FOREIGN KEY (membership_number)
        REFERENCES ClubMember(membership_number),
    CHECK (amount > 0),
    CHECK (installment_number BETWEEN 1 AND 4)
);

CREATE TABLE FIFAGame (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    opponent_name VARCHAR(100) NOT NULL,
    game_date DATE NOT NULL,
    team_score INT NOT NULL,
    opponent_score INT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES Location(location_id)
);

CREATE TABLE FIFAParticipation (
    game_id INT NOT NULL,
    membership_number INT NOT NULL,
    PRIMARY KEY (game_id, membership_number),
    FOREIGN KEY (game_id)
        REFERENCES FIFAGame(game_id)
        ON DELETE CASCADE,
    FOREIGN KEY (membership_number)
        REFERENCES ClubMember(membership_number)
);
