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

INSERT INTO units (name, contact, status) VALUES ('Unit1', 'Unassigned', '1234567890');
INSERT INTO units (name, contact, status) VALUES ('Unit2', 'Busy', '123456789');

INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES ('Call1', '123456789', 'BIB123', 'loc1', 'comp1', '5/15/2024, 1:54:37 PM', '', '', 'Unassigned', 'note');
INSERT INTO calls (name, phone, bib, location, complaint, open_time, close_time, unit, status, notes) VALUES ('Call2', '123456789', 'BIB456', 'loc2', 'comp2', '5/15/2024, 1:54:38 PM', '', 1, 'In-Progress', 'note');

SELECT calls.name, phone, bib, location, complaint, open_time, close_time, COALESCE(units.name, 'None') AS unit, calls.status, notes FROM calls LEFT JOIN units ON calls.unit = units.unitID;