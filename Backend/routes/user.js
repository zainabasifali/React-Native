const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.post('/register', (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const query = 'INSERT INTO users (name, email, password, profilePicture) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, password, profilePicture], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Failed to create user.' });
    }
    res.status(201).json({ id: results.insertId, name, email, profilePicture});
  });
});

router.post('/login', (req, res) => {
  const { email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email, and password are required.' });
  }

  const query = 'select * from users where email = ? and password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error searching user:', err);
      return res.status(500).json({ message: 'Failed to find user.' });
    }
    res.status(201).json({ id: results.insertId, email});
  });
});
module.exports = router;
