const connector = require('mysql');

const connection = connector.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ticket_management'
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database');
    }
  });

module.exports = connection;
