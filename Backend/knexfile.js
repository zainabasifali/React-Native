module.exports = {
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hometalents',
  },
  migrations: {
    directory: './migrations', 
  },
};
