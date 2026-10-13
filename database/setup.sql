-- Create database
CREATE DATABASE IF NOT EXISTS crm_db;
USE crm_db;

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  course_interest VARCHAR(255) NOT NULL,
  claimed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (claimed_by) REFERENCES employees(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_claimed_by ON enquiries(claimed_by);
CREATE INDEX idx_unclaimed ON enquiries(claimed_by) WHERE claimed_by IS NULL;
