const express = require('express');
const router = express.Router();
const database = require('./config/database');


function convertToMySQLDateTime(input, time = '00:00:00') {
  const [day, month, year] = input.split('-');
  return `${year}-${month}-${day} ${time}`;
}

//  /admin/account/add
router.post('/account/add', async (req, res) => {
    const { username, role, ContactNumber, Email, Password } = req.body;

    try {

        const [addUserResult] = await database.query(
            'INSERT INTO Users (UserName, Role, ContactNumber, Email, Password) VALUES (?, ?, ?, ?, ?)',
            [username, role, ContactNumber, Email, Password]
        );
        

        const [userRows] = await database.query(
            'SELECT * FROM Users WHERE Email = ?',
            [Email]
        );
        
        const userInfo = userRows[0]; 
        
        return res.status(200).json({
            message: 'User added successfully', 
            userInfo: userInfo
        });
    }
    catch(err) {
        console.log("Error adding user:", err);
        
        // Check for duplicate entry 
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                error: 'User already exists',
                code: err.code,
                sqlMessage: err.sqlMessage
            });
        }
        
        // Return error for other cases wher user coud not be added
        return res.status(500).json({ 
            error: 'Failed to add user',
            message: err.message
        });
    }
});


// /admin/account
router.post('/account', async (req, res) => {
    const { email , password } = req.body;
    try {
        const [exists] = await database.query(
            'SELECT count(*) from Users WHERE Email = ? and Password = ?',
            [email, password]
        )

        if (exists[0]['count(*)'] == 1){
            const [userInfo] = await database.query(
                'SELECT * from Users WHERE email = ? AND password = ?',
                [email, password]
            );

            res.status(200).json({message: 'Login Successful', userInfo});
        } else {
            res.status(200).json({message: 'Login Unsuccessful, wrong credentials'});
        }


    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
})

// -> /admin/accounts/all
router.get('/accounts/all', async (req, res) => {
    try {
        const [users] = await database.query(
            `SELECT * FROM Users`
        )
        res.status(200).json({message: 'users fetched', users});

    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
});


// /admin/billing/all
router.get('/billing/all', async (req, res) => {
    let allPayments = []
    try {

        const [payments] = await database.query(
            `SELECT * FROM Payments`
        )

      

        for(let i = 0; i < payments.length; i++) {
           
        
        const [UserID] = await database.query(
            `SELECT UserID FROM Users where UserID = ?`,
            [payments[i].RegisID]
        )

         const userID = UserID[0].UserID;

            const [contactNumber] = await database.query(
                `SELECT ContactNumber FROM Users WHERE UserID = ?`,
                [userID]
            );

            const [email] = await database.query(
                `SELECT Email FROM Users WHERE UserID = ?`,
                [userID]
            );

            const [username] = await database.query(
                `SELECT UserName FROM Users WHERE UserID = ?`,
                [userID]
            );


            let items = {
                PaymentID: payments[i].PaymentID,
                RegistrationID: payments[i].RegisID,
                AdminID: payments[i].AdminID,
                PaymentDate: payments[i].PaymentDate,
                Amount: payments[i].Amount,
                UserName: username[0].UserName,
                ContactNumber: contactNumber[0].ContactNumber,
                Email: email[0].Email
            }
            allPayments.push(items);
        }

        res.status(200).json({message: 'payments fetched', allPayments});

    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
 })

// /admin/billing/create
router.post('/billing/create', async (req, res) => {
    const { UserID, RegisID, Amount, Date } = req.body;

    try {
        const [insert] = await database.query(
            `INSERT INTO Payments (UserID, RegisID, Date, Amount) VALUES (?, ?, ?, ?)`,
            [UserID, RegisID, Date, Amount]
        );  


        res.status(200).json({ message: 'Payment Created', paymentID: insert.insertId });


    } catch (err) {
        console.log("Error creating payment:");
        console.log(err);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});




// /admin/billing/all-account-billings/:userId
router.get('/billing/all-account-billings/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const [payments] = await database.query(
            `
            SELECT 
                Payments.PaymentID,
                Payments.Date AS PaymentDate,
                Payments.Amount,
                Payments.RegisID AS RegistrationID,
                Admins.UserName AS AdminName
            FROM Payments
            INNER JOIN Registrations ON Payments.RegisID = Registrations.RegisID
            LEFT JOIN Users AS Admins ON Payments.UserID = Admins.UserID
            WHERE Registrations.UserID = ?
            ORDER BY Payments.Date DESC
            `,
            [userId]
        );

        res.status(200).json({ payments });

    } catch (err) {
        console.log("Error fetching user payments:");
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch user payments' });
    }
});




//  /admin/all-buildings
router.get('/all-buildings', async (req, res) => {
    try {
        const [buildings] = await database.query(
            `SELECT * FROM Dorms`
        )
        res.status(200).json({message: 'rooms fetched', buildings});

    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
});


// /admin/add-maintenance-log
router.post('/add-maintenance-log', async (req, res) => {
    const {  requestId, FixDetails } = req.body;

    
    try {
        const [insert] = await database.query(
            `INSERT INTO MaintenanceLogs (RequestID, FixDetails) VALUES (?, ?)`,
            [requestId, FixDetails]
        )
        res.status(200).json({message: 'Repair log sent'});

    } catch(err) {

        res.status(500).json({ error: 'Something went wrong with the server', err });

    }
})


// /admin/view-maintenance-logs
router.get('/view-maintenance-logs', async (req, res) => {

    try {
        const [logs] = await database.query(
            `SELECT * FROM MaintenanceLogs`
        )
        res.status(200).json({message: 'logs fetched', logs});

    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
})

// /users/request
router.post('/request', async (req, res) => {
    const {  RequestDetails, UserID } = req.body;

    const [RoomID] = await database.query(

        `SELECT RoomID FROM Registrations WHERE UserID = ?`,
        [UserID]
    )

    
    try {
        const [insert] = await database.query(
            `INSERT INTO MaintenanceRequests (RoomID, UserID, RequestDetails, Status) VALUES (?, ?, ?, ?)`,
            [RoomID[0].RoomID,UserID, RequestDetails, "not_fixed"]
        )
        res.status(200).json({message: 'Request Sent and logged'});

    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
})



// /user/all-account-requests/:userID
router.get('/all-account-requests/:UserID', async (req, res) => {
    const { UserID } = req.params;

    
    try {
        const [requests] = await database.query(
            `SELECT RequestDetails, Date, Status
             FROM MaintenanceRequests
             WHERE UserID = ?
             ORDER BY Date DESC`,
            [UserID]
        )
        res.status(200).json({message: 'requests fetched', requests});

    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
})



// /admin/view-maintenance-requests
router.get('/view-maintenance-requests',async(req,res) =>{
    let requests = []
    try {
        const [logs] = await database.query(
            `
            
            SELECT * FROM MaintenanceRequests
            ORDER BY Date DESC;
            `
        )

        for (let i = 0; i < logs.length; i++) {

            const [rows] = await database.query(
                `SELECT UserName FROM Users WHERE UserID = ?`,
                [logs[i].UserID]
            );

            const [DormNameResult] = await database.query(
                `SELECT d.Name AS DormName
                 FROM DormRooms r
                 JOIN Dorms d ON r.DormBuildingID = d.DormID
                 WHERE r.RoomID = ?`,
                [logs[i].RoomID]
                );
            
            let items = {
                RequestID: logs[i].RequestID,
                RoomID: logs[i].RoomID,
                UserID: logs[i].UserID,
                RequestDetails: logs[i].RequestDetails,
                Status: logs[i].Status,
                Date: logs[i].Date,
                Username: rows[0].UserName,
                DormBuildingName: DormNameResult[0].DormName

            };
            requests.push(items);
            console.log("reqs: asfdf",requests)
        }

        res.status(200).json({message: 'requests fetched', requests});

    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
})

// /user/emergency-contact/:UserID
router.get('/emergency-contact/:UserID', async (req, res) => {
    const { UserID } = req.params;

    try {
        const [contacts] = await database.query(
            `SELECT ContactID, Name, Relationship, ContactNumber, Email
             FROM EmergencyContacts
             WHERE UserID = ?`,
            [UserID]
        );

        if (contacts.length === 0) {
            return res.status(404).json({ message: 'No emergency contacts found for this user.' });
        }

        res.status(200).json({ message: 'Emergency contact(s) fetched', contacts });

    } catch (err) {
        console.error("Error fetching emergency contacts:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// /admin/emergency-contact/:UserID
router.post('/emergency-contact/:UserID', async (req, res) => {
    const { UserID } = req.params;
    const { Name, Relationship, ContactNumber, Email } = req.body;

    if (!Name || !ContactNumber) {
        return res.status(400).json({ message: 'Name and ContactNumber are required.' });
    }

    try {
        const [result] = await database.query(
            `INSERT INTO EmergencyContacts (UserID, Name, Relationship, ContactNumber, Email)
             VALUES (?, ?, ?, ?, ?)`,
            [UserID, Name, Relationship || null, ContactNumber, Email || null]
        );

        res.status(201).json({
            message: 'Emergency contact added successfully',
            contactID: result.insertId
        });

    } catch (err) {
        console.error("Error inserting emergency contact:", err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// /admin/rooms/all
router.get('/rooms/all', async (req, res) => {
    const { DormBuildingID } = req.params; 
    try {
        const [rooms] = await database.query(
            `SELECT 
                r.RoomID,
                r.DormBuildingID,
                r.Occupied,
                d.Name
            FROM DormRooms r
            JOIN Dorms d ON r.DormBuildingID = d.DormID`,
            [DormBuildingID]
        )
        res.status(200).json({message: 'rooms fetched', rooms});

    } catch(err) {
        console.log("error: ")
        console.log(err)
        res.status(500).json({message: 'Error fetching rooms'});
    }
});


// /admin/room-change
router.put('/room-change', async (req, res) => {
    const { RegisID, newRoomID } = req.body;

    if (!RegisID || !newRoomID) {
        return res.status(400).json({ message: 'Missing RegisID or newRoomID' });
    }

    try {
        const [roomCheck] = await database.query(
            `SELECT * FROM DormRooms WHERE RoomID = ? AND Occupied = 0`,
            [newRoomID]
        );

        if (roomCheck.length === 0) {
            return res.status(400).json({ message: 'Selected room does not exist or is already occupied' });
        }

        
        const [update] = await database.query(
            `UPDATE Registrations SET RoomID = ? WHERE RegisID = ?`,
            [newRoomID, RegisID]
        );

        
        await database.query(
            `UPDATE DormRooms SET Occupied = 1 WHERE RoomID = ?`,
            [newRoomID]
        );

        res.status(200).json({ message: 'Room updated successfully' });

    } catch (err) {
        console.log("Error updating room:");
        console.log(err);
        res.status(500).json({ message: 'Failed to update room' });
    }
});


// /admin/housing/all
router.get('/housing/all', async (req, res) => {
    let allRegistrations = []
    try {
        const [registrations] = await database.query(
            `SELECT * FROM Registrations`
        )
        for(let i = 0; i < registrations.length; i++) {


            const [username] = await database.query(
            `SELECT UserName FROM Users WHERE UserID = ?`,
            [registrations[i].UserID]
            );

            const [contactNumber] = await database.query(
            `SELECT ContactNumber FROM Users WHERE UserID = ?`,
            [registrations[i].UserID]
            );

            const [email] = await database.query(
            `SELECT Email FROM Users WHERE UserID = ?`,
            [registrations[i].UserID]
            );

            let items = {
                RegistrationID: registrations[i].RegisID,
                UserID: registrations[i].UserID,
                RoomID: registrations[i].RoomID,
                StartDate: registrations[i].StartDate,
                EndDate: registrations[i].EndDate,
                AdminID: registrations[i].AdminID,
                UserName: username[0].UserName,
                ContactNumber: contactNumber[0].ContactNumber,

                Email: email[0].Email,
            }
            allRegistrations.push(items);
        }
        res.status(200).json({message: 'registrations fetched', allRegistrations});

    } catch(err) {
        console.log("error: ")
        console.log(err)
    }
 })

 // /registration/:userID
router.get('/registration/:userID', async (req, res) => {
    const userID = req.params.userID;

    try {
        const [registrations] = await database.query(
            `SELECT * FROM Registrations WHERE UserID = ?`,
            [userID]
        );

        if (registrations.length === 0) {
            return res.status(404).json({ message: 'No registration found for this user.' });
        }

        const [userInfo] = await database.query(
            `SELECT UserName, ContactNumber, Email FROM Users WHERE UserID = ?`,
            [userID]
        );

        if (userInfo.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const enrichedRegistrations = registrations.map(reg => ({
            RegistrationID: reg.RegisID,
            UserID: reg.UserID,
            RoomID: reg.RoomID,
            StartDate: reg.StartDate,
            EndDate: reg.EndDate,
            AdminID: reg.AdminID,
            UserName: userInfo[0].UserName,
            ContactNumber: userInfo[0].ContactNumber,
            Email: userInfo[0].Email
        }));

        res.status(200).json({ message: 'User registration info fetched.', data: enrichedRegistrations });

    } catch (err) {
        console.error("Error fetching user registration info:", err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// /admin/housing/add
router.post('/housing/add', async (req, res) => {
    const { UserID, RoomID, StartDate, EndDate } = req.body;
  if (!UserID || !RoomID || !StartDate || !EndDate) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const [result] = await database.query(
      `INSERT INTO Registrations (UserID, RoomID, StartDate, EndDate)
       VALUES (?, ?, ?, ?)`,
      [UserID, RoomID, StartDate, EndDate]
    );

    res.status(201).json({ message: 'Registration added.'});
  } catch (err) {
    console.error('Error inserting registration:', err);
    res.status(500).json({ message: 'Database error.', error: err });
  }
});



module.exports = router; 