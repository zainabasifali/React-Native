const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/allCategories', (req, res) => {
    const query = 'SELECT * FROM categories';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ message: 'Failed to fetch categories.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'categories not found.' });
      }
      res.json(results);
    });
  });

  module.exports = router;