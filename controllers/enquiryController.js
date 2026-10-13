const { pool } = require('../config/database');
const { validateEnquiryForm } = require('../middleware/validation');

const submitEnquiry = async (req, res) => {
  try {
    const { name, phone, email, course_interest } = req.body;

    // Validate input
    const errors = validateEnquiryForm(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO enquiries (name, phone, email, course_interest, created_at) VALUES (?, ?, ?, ?, NOW())',
        [name, phone, email, course_interest]
      );

      res.status(201).json({
        message: 'Enquiry submitted successfully',
        enquiryId: result.insertId,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Submit enquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPublicEnquiries = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const [enquiries] = await connection.query(
        'SELECT id, name, phone, email, course_interest, created_at FROM enquiries WHERE claimed_by IS NULL ORDER BY created_at DESC'
      );

      res.json({
        message: 'Unclaimed enquiries retrieved',
        count: enquiries.length,
        enquiries,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get public enquiries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const claimEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.id;

    const connection = await pool.getConnection();
    try {
      // Start transaction
      await connection.beginTransaction();

      // Check if enquiry exists and is unclaimed (with lock)
      const [enquiries] = await connection.query(
        'SELECT id, claimed_by FROM enquiries WHERE id = ? FOR UPDATE',
        [id]
      );

      if (enquiries.length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Enquiry not found' });
      }

      if (enquiries[0].claimed_by !== null) {
        await connection.rollback();
        return res.status(409).json({ error: 'Enquiry already claimed' });
      }

      // Update enquiry
      const [updateResult] = await connection.query(
        'UPDATE enquiries SET claimed_by = ? WHERE id = ?',
        [employeeId, id]
      );

      await connection.commit();

      res.json({
        message: 'Enquiry claimed successfully',
        enquiryId: id,
        claimedBy: employeeId,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Claim enquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMyEnquiries = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const connection = await pool.getConnection();
    try {
      const [enquiries] = await connection.query(
        'SELECT id, name, phone, email, course_interest, created_at FROM enquiries WHERE claimed_by = ? ORDER BY created_at DESC',
        [employeeId]
      );

      res.json({
        message: 'Your enquiries retrieved',
        count: enquiries.length,
        enquiries,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get my enquiries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  submitEnquiry,
  getPublicEnquiries,
  claimEnquiry,
  getMyEnquiries,
};
