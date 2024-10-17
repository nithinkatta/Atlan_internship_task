const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully');
    connection.release();
  }
});

// Helper function to run SQL files
const runSqlFile = async (filePath) => {
  const fs = require('fs').promises;
  const sql = await fs.readFile(filePath, 'utf8');
  return pool.promise().query(sql);
};

// // Run the SQL file to update the schema
// runSqlFile('./db/schema.sql')
//   .then(() => console.log('Database schema updated successfully'))
//   .catch((error) => console.error('Error updating database schema:', error));

module.exports = pool.promise();