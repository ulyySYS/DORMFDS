const express = require('express');
const database = require('../config/database');

const getUserID = async (registrationID) => {
    try {
        const [rows] = await database.query(
            `SELECT UserID 
             FROM Registrations 
             WHERE RegisID = ?`,
            [registrationID]
        );
        if (rows.length > 0) {
            return rows[0].UserID;
        } else {
            console.log("No user found with the given registration ID.");
            return null;
        }
    } catch (error) {
        console.error("Database error: ", error.message);
        return null;
    }
}

module.exports = getUserID;
