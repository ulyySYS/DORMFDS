
drop database dormitory_management_system;
CREATE DATABASE dormitory_management_system;
USE dormitory_management_system;

CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(255),
    Role ENUM('student', 'admin'),
    ContactNumber VARCHAR(255) UNIQUE,
    Email VARCHAR(255) UNIQUE,
    Password VARCHAR(255)

);
create table EmergencyContacts(
	ContactID int primary key auto_increment,
    UserID int not null,
    Name varchar(255) not null,
    Relationship varchar(255),
    ContactNumber varchar(255) not null,
    Email varchar(255),
    foreign key (UserID) references Users (UserID)
);
ALTER TABLE payments
MODIFY COLUMN Date DATE;
select * from payments;
CREATE TABLE Dorms (
    DormID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255),
    Address VARCHAR(255),
    TotalRooms INT
);

CREATE TABLE DormRooms (
    RoomID INT AUTO_INCREMENT PRIMARY KEY,
    DormBuildingID INT,
    Occupied BOOLEAN,
    FOREIGN KEY (DormBuildingID) REFERENCES Dorms(DormID) ON DELETE SET NULL
);
select * from registrations;
select * from Registration_Room_Update;
CREATE TABLE Registrations (
    RegisID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    RoomID INT,
    StartDate DATE,
    EndDate DATE,
    AdminID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (RoomID) REFERENCES DormRooms(RoomID) ON DELETE SET NULL
);
select * from registrations;
insert into maintenanceRequests (RoomID,UserID,RequestDetails,Date,Status)
values (3, 4, "broken tiles", '2025-06-01', "not_fixed");
CREATE TABLE Registration_Created_At (
    RegisCreationID INT AUTO_INCREMENT PRIMARY KEY,
    RegistrationID INT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RegistrationID) REFERENCES Registrations(RegisID) ON DELETE SET NULL
);

select * from users;
create table Registration_Room_Update(
	UpdateID int auto_increment primary key,
    RegistrationID int not null,
    Date Datetime not null,
    oldRoomID int not null,
    newRoomID int not null,
    foreign key (RegistrationID) references Registrations (RegisID),
    foreign key (oldRoomID) references DormRooms (RoomID),
    foreign key (newRoomID) references DormRooms (RoomID)

);

CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    RegisID INT,
    Date DATETIME,
    Amount DECIMAL(10,2),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL,
    FOREIGN KEY (RegisID) REFERENCES Registrations(RegisID) ON DELETE SET NULL
);

CREATE TABLE Payment_Created_At (
    PaymentCreationID int AUTO_INCREMENT PRIMARY KEY,
    RegistrationID INT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RegistrationID) REFERENCES Registrations(RegisID) ON DELETE SET NULL
);

CREATE TABLE UserLoginLogs (
    LoginID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);

CREATE TABLE MaintenanceRequests (
    RequestID INT AUTO_INCREMENT PRIMARY KEY,
    RoomID INT,
    UserID INT,
    RequestDetails VARCHAR(255),
    Date DATETime DEFAULT current_timestamp,
    Status ENUM('fixed', 'not_fixed'),
    DateFixed DATETIME,
    FOREIGN KEY (RoomID) REFERENCES DormRooms(RoomID) ON DELETE SET NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL
);



select * from DormRooms;
CREATE TABLE MaintenanceLogs (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    RequestID INT,
    FixDetails TEXT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RequestID) REFERENCES MaintenanceRequests(RequestID) ON DELETE SET NULL
);

DELIMITER $$

CREATE TRIGGER after_room_update
AFTER UPDATE ON Registrations
FOR EACH ROW
BEGIN
    -- Check if the RoomID actually changed
    IF OLD.RoomID IS NOT NULL AND NEW.RoomID IS NOT NULL AND OLD.RoomID != NEW.RoomID THEN

        -- Insert into the Registration_Room_Update log
        INSERT INTO Registration_Room_Update (
            RegistrationID, Date, oldRoomID, newRoomID
        ) VALUES (
            OLD.RegisID, NOW(), OLD.RoomID, NEW.RoomID
        );

        -- Set the old room's occupied status to 0 (unoccupied)
        UPDATE DormRooms
        SET Occupied = 0
        WHERE RoomID = OLD.RoomID;

        -- Optionally, mark the new room as occupied if you want
        UPDATE DormRooms
        SET Occupied = 1
        WHERE RoomID = NEW.RoomID;

    END IF;
END$$

DELIMITER ;

DELIMITER $$




DELIMITER $$

CREATE TRIGGER after_registration_insert
AFTER INSERT ON Registrations
FOR EACH ROW
BEGIN

    -- Insert registration creation timestamp
    INSERT INTO Registration_Created_At (RegistrationID, Date)
    VALUES (NEW.RegisID, NOW());
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_maintenance_log_insert
AFTER INSERT ON MaintenanceLogs
FOR EACH ROW
BEGIN
    UPDATE MaintenanceRequests
    SET Status = 'fixed'
    WHERE RequestID = NEW.RequestID;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER set_room_occupied_on_registration
AFTER INSERT ON Registrations
FOR EACH ROW
BEGIN
    UPDATE DormRooms
    SET Occupied = TRUE
    WHERE RoomID = NEW.RoomID;
END $$

DELIMITER ;

DELIMITER $$


CREATE TRIGGER log_payment_creation
AFTER INSERT ON Payments
FOR EACH ROW
BEGIN
    INSERT INTO Payment_Created_At (RegistrationID, Date)
    VALUES (NEW.RegisID, NOW());
END $$

DELIMITER ;




INSERT INTO Dorms (DormID, Name, Address, TotalRooms)
VALUES
    (1, 'Maple Hall', '123 University Ave', 100),
    (2, 'Oak Hall', '456 College Blvd', 80),
    (3, 'Pine Hall', '789 Campus Drive', 120);
    
-- Rooms for DormID 1 (Maple Hall)
INSERT INTO DormRooms (DormBuildingID, Occupied)
VALUES
(1, FALSE), (1, FALSE), (1, FALSE), (1, FALSE), (1, FALSE),
(1, FALSE), (1, FALSE), (1, FALSE), (1, FALSE), (1, FALSE);

-- Rooms for DormID 2 (Oak Hall)
INSERT INTO DormRooms (DormBuildingID, Occupied)
VALUES
(2, FALSE), (2, FALSE), (2, FALSE), (2, FALSE), (2, FALSE),
(2, FALSE), (2, FALSE), (2, FALSE), (2, FALSE), (2, FALSE);

-- Rooms for DormID 3 (Pine Hall)
INSERT INTO DormRooms (DormBuildingID, Occupied)
VALUES
(3, FALSE), (3, FALSE), (3, FALSE), (3, FALSE), (3, FALSE),
(3, FALSE), (3, FALSE), (3, FALSE), (3, FALSE), (3, FALSE);

INSERT INTO Users (UserName, Role, ContactNumber, Email, Password)
VALUES ('AdminUser1', 'admin', '1234567890', 'admin@example.com', 'password123');
INSERT INTO Registrations (UserID, RoomID, StartDate, EndDate, AdminID)
VALUES (1, 1, '2025-06-01', '2025-12-01', 1);


INSERT INTO Users (UserName, Role, ContactNumber, Email, Password) VALUES
-- Maple Hall
('Alice Johnson', 'student', '1111111111', 'alice.johnson@example.com', 'pass123'),
('Brian Smith', 'student', '1111111112', 'brian.smith@example.com', 'pass123'),
('Catherine Lee', 'student', '1111111113', 'catherine.lee@example.com', 'pass123'),
('David Kim', 'student', '1111111114', 'david.kim@example.com', 'pass123'),
('Emily Davis', 'student', '1111111115', 'emily.davis@example.com', 'pass123'),

-- Oak Hall
('Frank Moore', 'student', '2222222221', 'frank.moore@example.com', 'pass123'),
('Grace Allen', 'student', '2222222222', 'grace.allen@example.com', 'pass123'),
('Henry Wright', 'student', '2222222223', 'henry.wright@example.com', 'pass123'),
('Isabella Clark', 'student', '2222222224', 'isabella.clark@example.com', 'pass123'),
('Jack Miller', 'student', '2222222225', 'jack.miller@example.com', 'pass123'),

-- Pine Hall
('Karen Hall', 'student', '3333333331', 'karen.hall@example.com', 'pass123'),
('Leo Young', 'student', '3333333332', 'leo.young@example.com', 'pass123'),
('Mia Hernandez', 'student', '3333333333', 'mia.hernandez@example.com', 'pass123'),
('Nathan Scott', 'student', '3333333334', 'nathan.scott@example.com', 'pass123'),
('Olivia Adams', 'student', '3333333335', 'olivia.adams@example.com', 'pass123');




-- Maple Hall: UserID 2–6, RoomID 1–5
INSERT INTO Registrations (UserID, RoomID, StartDate, EndDate, AdminID) VALUES
(2, 1, '2025-06-01', '2025-12-01', 1),
(3, 2, '2025-06-01', '2025-12-01', 1),
(4, 3, '2025-06-01', '2025-12-01', 1),
(5, 4, '2025-06-01', '2025-12-01', 1),
(6, 5, '2025-06-01', '2025-12-01', 1);

-- Oak Hall: UserID 7–11, RoomID 11–15
INSERT INTO Registrations (UserID, RoomID, StartDate, EndDate, AdminID) VALUES
(7, 11, '2025-06-01', '2025-12-01', 1),
(8, 12, '2025-06-01', '2025-12-01', 1),
(9, 13, '2025-06-01', '2025-12-01', 1),
(10, 14, '2025-06-01', '2025-12-01', 1),
(11, 15, '2025-06-01', '2025-12-01', 1);

-- Pine Hall: UserID 12–16, RoomID 21–25
INSERT INTO Registrations (UserID, RoomID, StartDate, EndDate, AdminID) VALUES
(12, 21, '2025-06-01', '2025-12-01', 1),
(13, 22, '2025-06-01', '2025-12-01', 1),
(14, 23, '2025-06-01', '2025-12-01', 1),
(15, 24, '2025-06-01', '2025-12-01', 1),
(16, 25, '2025-06-01', '2025-12-01', 1);




select * from MaintenanceRequests;


INSERT INTO MaintenanceRequests (
    RoomID, 
    UserID, 
    RequestDetails, 
    Date, 
    Status, 
    DateFixed
) VALUES (
    2,                -- Room assigned to UserID 3
    3,                -- UserID making the request
    'Air conditioner not working', 
    NOW(),            -- Current date/time
    'not_fixed', 
    NULL              -- Not fixed yet
);


INSERT INTO MaintenanceLogs (
    RequestID, 
    FixDetails, 
    Date
) VALUES (
    1, 
    'Replaced faulty capacitor in AC unit', 
    NOW()
);


show  tables from dormitory;

select * from users;

select * from registrations;


