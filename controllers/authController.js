const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validateEmail } = require('../middleware/validation');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Name, email, and password are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const connection = await pool.getConnection();
    try {
      const [existingUser] = await connection.query(
        'SELECT id FROM employees WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert employee
      const [result] = await connection.query(
        'INSERT INTO employees (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
        [name, email, hashedPassword]
      );

      res.status(201).json({
        message: 'Employee registered successfully',
        employeeId: result.insertId,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required' });
    }

    const connection = await pool.getConnection();
    try {
      // Find employee
      const [employees] = await connection.query(
        'SELECT id, name, email, password FROM employees WHERE email = ?',
        [email]
      );

      if (employees.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const employee = employees[0];

      // Verify password
      const passwordMatch = await bcrypt.compare(password, employee.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: employee.id, email: employee.email, name: employee.name },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };
