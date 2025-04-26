const express = require('express');
const app = express();
const port = 3000;
const knex = require('knex')(require('./knexfile.js'));
const userRoutes = require('./routes/user');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

knex.migrate.latest()
    .then(() => {
        console.log('Migrations are up to date');
    })
    .catch((err) => {
        console.error('Migration error:', err);
    });

app.use('/api/user', userRoutes);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
