const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.post('/createLike', (req, res) => {
    const userId = req.user.id;
    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ message: 'postId is required' });
    }
    const query = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
    db.query(query, [userId, postId], (err, results) => {
        if (err) {
            console.error('Error inserting like:', err);
            return res.status(500).json({ message: 'Failed to create like.' });
        }
        res.status(201).json({ message: 'like created successfully.' })
    })

})

router.delete('/deleteLike/:id', (req, res) => {

    const likeId = req.params.id;

    const query = 'DELETE FROM likes WHERE id = ?';
    db.query(query, [likeId], (err, results) => {
        if (err) {
            console.error('Error deleting like:', err);
            return res.status(500).json({ message: 'Failed to delete like.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Like not found.' });
        }
        res.status(200).json({ message: 'Like removed successfully.' });
    });
});

module.exports = router;
