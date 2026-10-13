const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS crm_db');
    console.log('✓ Database created or already exists');

    // Create employees table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS crm_db.employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Employees table created or already exists');

    // Create enquiries table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS crm_db.enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        course_interest VARCHAR(255) NOT NULL,
        claimed_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (claimed_by) REFERENCES crm_db.employees(id) ON DELETE SET NULL
      )
    `);
    console.log('✓ Enquiries table created or already exists');

    // Create indexes (ignore error if already exists)
    try {
      await connection.query('CREATE INDEX idx_claimed_by ON crm_db.enquiries(claimed_by)');
    } catch (err) {
      if (err.code !== 'ER_DUP_KEYNAME') throw err;
    }
    console.log('✓ Indexes created or already exist');

    await connection.end();
    console.log('✓ Database initialization complete\n');
  } catch (error) {
    console.error('✗ Database initialization failed:', error.message);
    throw error;
  }
}

module.exports = { pool, initializeDatabase };
