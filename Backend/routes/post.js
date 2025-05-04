const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/allPosts', (req, res) => {
    const query = `
    SELECT 
      posts.*, 
      users.name As userName, 
      users.profilePicture 
    FROM posts 
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ message: 'Failed to fetch posts.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'posts not found.' });
        }
        res.json(results);
    });
});

router.get('/categoryPosts/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'category id is required.' });
  }

  const query = `
  SELECT 
    posts.*, 
    users.name As userName, 
    users.profilePicture 
  FROM posts 
  JOIN users ON posts.user_id = users.id WHERE category_id = ?  ORDER BY posts.created_at DESC
`;
  db.query(query,[id], (err, results) => {
      if (err) {
          console.error('Error fetching Category posts:', err);
          return res.status(500).json({ message: 'Failed to fetch Category posts.' });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Category Posts not found.' });
      }
      res.json(results);
  });
});

router.get('/userServices/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'user id is required.' });
  }
  const query = 'SELECT * FROM posts WHERE user_id = ? and type = "service"';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ message: 'Failed to fetch services.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'services not found.' });
    }
    res.json(results);
  });
});

router.get('/userPosts/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'user id is required.' });
  }
  const query = 'SELECT * FROM posts WHERE user_id = ? and type = "post"';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching pots:', err);
      return res.status(500).json({ message: 'Failed to fetch posts.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'posts not found.' });
    }
    res.json(results);
  });
});


module.exports = router;