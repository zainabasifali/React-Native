const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const knex = require('knex')(require('./knexfile.js'));
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const postRoutes = require('./routes/post');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

knex.migrate.latest()
    .then(() => {
        console.log('Migrations are up to date');
    })
    .catch((err) => {
        console.error('Migration error:', err);
    });

app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
