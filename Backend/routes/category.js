const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/multer');

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
    res.status(200).json(results);
  });
});

router.get('/aCategory/:id', (req, res) => {
  const { id } = req.params;
  console.log(id)
  const query = `
    SELECT * 
    FROM categories
    WHERE id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching category:', err);
      return res.status(500).json({ message: 'Failed to fetch category.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json(results[0]);
  });
});

router.post('/addCategory', upload.single('categoryPicture'), (req, res) => {
  const { name } = req.body;
  const categoryPicture = req.file ? req.file.filename : null;
  if (!name || !categoryPicture) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  console.log(req.body)
  const query = 'INSERT INTO categories (name,picture) VALUES (?, ?)';
  db.query(query, [name, categoryPicture], (err, results) => {
    if (err) {
      console.error('Error inserting category:', err);
      return res.status(500).json({ message: 'Failed to create category.' });
    }
    res.status(201).json({ message: 'Category created successfully.' })
  });
});

router.put('/update/:categoryId', upload.single('categoryPicture'), (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  const categoryPicture = req.file ? req.file.filename : null;


  if (!name) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  let query, params;
  if (categoryPicture) {
    query = 'UPDATE categories SET name = ?, picture = ? WHERE id = ?';
    params = [name, categoryPicture, categoryId];
  } else {
    query = 'UPDATE categories SET name = ? WHERE id = ?';
    params = [name, categoryId];
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error updating category:', err);
      return res.status(500).json({ message: 'Failed to update category.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json({ success: true });
  });
});


router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'id is required.' });
  }
  const query = 'DELETE FROM categories WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting category:', err);
      return res.status(500).json({ message: 'Failed to delete category.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'category not found.' });
    }
    res.status(200).json({ success: true });
  });
});

module.exports = router;