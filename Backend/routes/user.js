const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/multer');

router.post('/register', upload.single('profilePicture'), (req, res) => {
  const { name, email, password, profession } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  if (!name || !email || !password || !profession) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'INSERT INTO users (name, email, password, profilePicture, profession) VALUES (?, ?, ?, ?,?)';
  db.query(query, [name, email, password, profilePicture, profession], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ message: 'Failed to create user.' });
    }
    res.status(201).json({ message: 'User created successfully.'})
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'email, and password are required.' });
  }

  const query = 'select * from users where email = ? and password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error searching user:', err);
      return res.status(500).json({ message: 'Failed to find user.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = results[0];
    res.status(200).json({ user: { id: user.id, name: user.name } });
  });
});

router.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'id is required.' });
  }

  const query = `
    SELECT 
      users.*, 
      COUNT(posts.id) AS postCount 
    FROM users 
    LEFT JOIN posts ON users.id = posts.user_id 
    WHERE users.id = ? 
    GROUP BY users.id
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Failed to fetch user.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(results[0]);
  });
});


router.put('/updateProfile/:id', upload.single('profilePicture'), (req, res) => {
  const { id } = req.params;
  const { name, email, password, profession } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  if (!name || !email || !password || !profession) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  let query, params;
  if (profilePicture) {
    query = 'UPDATE users SET name = ?, email = ?, password = ?, profession = ?, profilePicture = ? WHERE id = ?';
    params = [name, email, password, profession, profilePicture, id];
  } else {
    query = 'UPDATE users SET name = ?, email = ?, password = ?, profession = ? WHERE id = ?';
    params = [name, email, password, profession, id];
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Failed to update user.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ success: true });
  });
});



router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'id is required.' });
  }
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Failed to delete user.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'user not found.' });
    }
    res.json({ success: true });
  });
});
module.exports = router;
