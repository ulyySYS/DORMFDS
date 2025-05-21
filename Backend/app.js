const express = require('express');
const APIRoutes = require('./APIRoutes');


const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); 

app.use('/login', APIRoutes);
app.use('/user', APIRoutes);
app.use('/admin', APIRoutes);





module.exports = app;