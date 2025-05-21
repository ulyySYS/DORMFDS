const express = require('express');
const database = require('../config/database');

const getRoomID = async (UserID)  => {

    const [RoomID] = await database.query(

        `SELECT RoomID FROM Registrations WHERE UserID = ?`,
        [UserID]
    )

    return RoomID[0].RoomID;
}

module.exports = getRoomID;