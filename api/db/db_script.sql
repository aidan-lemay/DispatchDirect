CREATE TABLE IF NOT EXISTS units (
    unitID INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    contact VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS calls (
    callID INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    bib INTEGER NOT NULL,
    location VARCHAR(100) NOT NULL,
    complaint VARCHAR(100) NOT NULL,
    open_time TIMESTAMP NOT NULL,
    close_time TIMESTAMP,
    unit INTEGER,
    status VARCHAR(100) NOT NULL,
    notes VARCHAR(100),
    FOREIGN KEY(unit) REFERENCES units(id)
);

SELECT calls.name, phone, bib, location, complaint, open_time, close_time, COALESCE(units.name, 'None') AS unit, calls.status, notes FROM calls LEFT JOIN units ON calls.unit = units.unitID;

INSERT INTO units (name, contact, status) VALUES ('Unit1', 'Free', '4567894152');
INSERT INTO units (name, contact, status) VALUES ('Unit2', 'Free', '7891859915');
INSERT INTO units (name, contact, status) VALUES ('Unit2', 'Free', '4819189489');
INSERT INTO units (name, contact, status) VALUES ('Unit2', 'Free', '4891981891');
INSERT INTO units (name, contact, status) VALUES ('Unit2', 'Free', '7489189489');
INSERT INTO units (name, contact, status) VALUES ('Unit2', 'Free', '7891859289');

INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES ('Joe Rider', '1234567898', '1234', '123 North 12th Street, Cross Street Wilson', 'Flat Tire', '5/15/2024, 5:57:36 PM', '', '', 'Unassigned', 'Very Angry.');
INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES ('Jim Passerby', '7895415975', '4891', 'North Main Street and East Ave at the Walmart', 'Rider Down, Unconscious', '5/15/2024, 5:58:23 PM', '', '', 'Unassigned', 'Leaving the scene.');
INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES ('Frank Volley', '1891789458', '0000', 'Rest Stop 1', 'Need More Water', '5/15/2024, 6:00:01 PM', '', '', 'Unassigned', 'Last Rider Should Pass Soon.');

