const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/multer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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


router.put('/updateProfile', upload.single('profilePicture'), (req, res) => {
  const { id } = req.user;
  const { name, email, profession } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  if (!name || !email ||  !profession) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  let query, params;
  if (profilePicture) {
    query = 'UPDATE users SET name = ?, email = ?, profession = ?, profilePicture = ? WHERE id = ?';
    params = [name, email, profession, profilePicture, id];
  } else {
    query = 'UPDATE users SET name = ?, email = ?, profession = ? WHERE id = ?';
    params = [name, email,  profession, id];
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Failed to update user.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    db.query(
      'SELECT id, name, email, profession, profilePicture, role FROM users WHERE id = ?',
      [id],
      (err, rows) => {
        if (err) {
          console.error('Error fetching updated user:', err);
          return res.status(500).json({ message: 'Failed to fetch updated user.' });
        }

        if (rows.length === 0) {
          return res.status(404).json({ message: 'User not found after update.' });
        }

        const user = rows[0];

        res.json({ user: { id: user.id, name: user.name, image: user.profilePicture, role: user.role } });
      });
  }
  )
})

router.delete('/delete/:id', (req, res) => {
  const { id } = req.user;
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

router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query (q) is required.' });
  }

  const query = `
    SELECT * from users
    WHERE name LIKE ? OR profession LIKE ?
  `;

  const searchPattern = `%${q}%`;

  db.query(query, [searchPattern, searchPattern], (err, results) => {
    if (err) {
      console.error('Error searching users:', err);
      return res.status(500).json({ message: 'Failed to search users.' });
    }

    res.json(results);
  });
});

router.post('/logout', (req, res) => {
  console.log("here logout")
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token, logged out successfully' });
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
