const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/multer');

router.post('/createPost', upload.single('postPicture'), (req, res) => {
  const { id } = req.user;
  const { title, description, prize, categoryId } = req.body;

  const postPicture = req.file ? req.file.filename : null;

  if (!title || !description || !categoryId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const type = prize === 'null' ? 'Post' : 'Service';

  const query = 'INSERT INTO posts (type,title,description,postPicture,prize,user_id,category_id) VALUES (?, ?, ?, ?,?, ? , ?)';
  db.query(query, [type, title, description, postPicture, prize, id, categoryId], (err, results) => {
    if (err) {
      console.error('Error inserting post:', err);
      return res.status(500).json({ message: 'Failed to create post.' });
    }
    res.status(201).json({ message: 'Post created successfully.' })
  });
});


router.put('/update/:id', (req, res) => {
  const { id: userId } = req.user;
  const { title, description, prize, categoryId } = req.body;
  const postId = req.params.id;
  let type;
  console.log(req.body)
  if (!title || !description || !categoryId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  let query, params;

  query = `
      UPDATE posts 
      SET title = ?, description = ?, prize = ?,type= ?, category_id = ?
      WHERE id = ? AND user_id = ?`;
  if (!prize || prize === 'null' || prize === 0 || prize === '0') {
    type = 'Post';
  } else {
    type = 'Service';
  }
  params = [title, description, prize, type, categoryId, postId, userId];

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error updating post:', err);
      return res.status(500).json({ message: 'Failed to update post.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found or not authorized.' });
    }
    console.log(results)
    res.status(200).json({ success: true, message: 'Post updated successfully.' });
  });
});

router.get('/allPosts', (req, res) => {
  const userId = req.user.id;

  const query = `SELECT 
      posts.*, 
      users.name AS userName, 
      users.profilePicture,
      likes.id AS likeId
    FROM posts 
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON likes.post_id = posts.id AND likes.user_id = ? Where posts.user_id != ?
    ORDER BY posts.created_at DESC`;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).json({ message: 'Failed to fetch posts.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'posts not found.' });
    }
    res.status(200).json(results);
  });
});

router.get('/categoryPosts/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.id

  if (!id) {
    return res.status(400).json({ message: 'category id is required.' });
  }

  const query = `
  SELECT 
    posts.*, 
    users.name AS userName, 
    users.profilePicture,
    likes.id AS likeId
  FROM posts 
  JOIN users ON posts.user_id = users.id
  LEFT JOIN likes ON likes.post_id = posts.id AND likes.user_id = ?
  WHERE category_id = ? AND posts.user_id != ?
  ORDER BY posts.created_at DESC
`;

  db.query(query, [userId, id, userId], (err, results) => {
    if (err) {
      console.error('Error fetching Category posts:', err);
      return res.status(500).json({ message: 'Failed to fetch Category posts.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Category Posts not found.' });
    }
    res.status(200).json(results);
  });
});

router.get('/userServices/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    return res.status(400).json({ message: 'user id is required.' });
  }
  const query = `
  SELECT 
    posts.*, 
    users.name AS userName, 
    users.profilePicture,
    likes.id AS likeId
  FROM posts 
  JOIN users ON posts.user_id = users.id
  LEFT JOIN likes ON likes.post_id = posts.id AND likes.user_id = ?
  WHERE posts.user_id = ? AND posts.type = 'service'
`;

  db.query(query, [userId, id], (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ message: 'Failed to fetch services.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'services not found.' });
    }
    console.log(results)
    res.status(200).json(results);
  });
});

router.get('/userPosts/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.user.id
  if (!id) {
    return res.status(400).json({ message: 'user id is required.' });
  }
  const query = `
  SELECT 
    posts.*, 
    users.name AS userName, 
    users.profilePicture,
    likes.id AS likeId
  FROM posts 
  JOIN users ON posts.user_id = users.id
  LEFT JOIN likes ON likes.post_id = posts.id AND likes.user_id = ?
  WHERE posts.user_id = ? AND posts.type = 'post'
`;

  db.query(query, [userId, id], (err, results) => {
    if (err) {
      console.error('Error fetching pots:', err);
      return res.status(500).json({ message: 'Failed to fetch posts.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'posts not found.' });
    }
    res.status(200).json(results);
  });
});

router.get('/aPost/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      posts.*,
      users.name AS userName, 
      users.profilePicture 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    WHERE posts.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching post:', err);
      return res.status(500).json({ message: 'Failed to fetch post.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(results[0]);
  });
});

router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'id is required.' });
  }
  const query = 'DELETE FROM posts WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting post:', err);
      return res.status(500).json({ message: 'Failed to delete post.' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'post not found.' });
    }
    res.status(200).json({ success: true });
  });
});

module.exports = router;