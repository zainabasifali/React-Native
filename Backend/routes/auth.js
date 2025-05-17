const express = require('express');
const router = express.Router();
const db = require('../config/db');
const upload = require('../middleware/multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

router.post('/register', upload.single('profilePicture'), async (req, res) => {
    const { name, email, password, profession } = req.body;
    const profilePicture = req.file ? req.file.filename : null;

    if (!name || !email || !password || !profession) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password, role, profilePicture, profession) VALUES (?, ?, ?, ?,?,?)';
    db.query(query, [name, email, hashedPassword, 'user', profilePicture, profession], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Failed to create user.' });
        }
        res.status(201).json({ message: 'User created successfully.' })
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error searching user:', err);
            return res.status(500).json({ message: 'Failed to find user.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                image: user.profilePicture,
                role: user.role,
            },
        });
    });
});


module.exports = router;