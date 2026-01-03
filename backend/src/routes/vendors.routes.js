const express = require('express');
const { query } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all vendors with search, filter, and pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      search = '',
      status = '',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let sql = 'SELECT * FROM vendors WHERE 1=1';
    const params = [];

    // Search by name
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    // Filter by status
    if (status && (status === 'active' || status === 'inactive')) {
      sql += ' AND status = ?';
      params.push(status);
    }

    // Get total count
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await query(countSql, params);
    const total = countResult[0].total;

    // Add sorting and pagination
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    // Execute query
    const [vendors] = await query(sql, params);

    res.json({
      success: true,
      data: {
        vendors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single vendor by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const [vendors] = await query(
      'SELECT * FROM vendors WHERE id = ?',
      [id]
    );

    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    res.json({
      success: true,
      data: vendors[0]
    });
  } catch (error) {
    next(error);
  }
});

// Create new vendor
router.post('/', async (req, res, next) => {
  try {
    const { name, status, address, city, state, zip, notes } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Vendor name is required'
      });
    }

    const [result] = await query(
      `INSERT INTO vendors (name, status, address, city, state, zip, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        status || 'active',
        address || null,
        city || null,
        state || null,
        zip || null,
        notes || null
      ]
    );

    // Fetch created vendor
    const [vendors] = await query(
      'SELECT * FROM vendors WHERE id = ?',
      [result[0].insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendors[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update vendor
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, status, address, city, state, zip, notes } = req.body;

    // Check if vendor exists
    const [existing] = await query(
      'SELECT id FROM vendors WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Vendor name is required'
      });
    }

    await query(
      `UPDATE vendors 
       SET name = ?, status = ?, address = ?, city = ?, state = ?, zip = ?, notes = ?
       WHERE id = ?`,
      [name, status, address, city, state, zip, notes, id]
    );

    // Fetch updated vendor
    const [vendors] = await query(
      'SELECT * FROM vendors WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Vendor updated successfully',
      data: vendors[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete vendor
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if vendor exists
    const [existing] = await query(
      'SELECT id FROM vendors WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Delete vendor (cascade will delete contacts, products, etc.)
    await query('DELETE FROM vendors WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Vendor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
