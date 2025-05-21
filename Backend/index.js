// index.js
const express = require('express');
const app = require('./app');
const PORT = 3000;

app.use(express.json()); // to parse JSON request bodies

app.get('/', (req, res) => {
  res.send('Server is running!');
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});