const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all contacts for a vendor
router.get('/vendors/:vendorId/contacts', async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    // Check if vendor exists
    const [vendors] = await pool.query(
      'SELECT id FROM vendors WHERE id = ?',
      [vendorId]
    );

    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Get contacts
    const [contacts] = await pool.query(
      'SELECT * FROM vendor_contacts WHERE vendor_id = ? ORDER BY created_at DESC',
      [vendorId]
    );

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
});

// Create new contact for a vendor
router.post('/vendors/:vendorId/contacts', async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { name, email, phone, role } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Contact name is required'
      });
    }

    // Check if vendor exists
    const [vendors] = await pool.query(
      'SELECT id FROM vendors WHERE id = ?',
      [vendorId]
    );

    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Insert contact
    const [result] = await pool.query(
      `INSERT INTO vendor_contacts (vendor_id, name, email, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [vendorId, name, email || null, phone || null, role || null]
    );

    // Fetch created contact
    const [contacts] = await pool.query(
      'SELECT * FROM vendor_contacts WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: contacts[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update contact
router.put('/contacts/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone, role } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Contact name is required'
      });
    }

    // Check if contact exists
    const [existing] = await pool.query(
      'SELECT id FROM vendor_contacts WHERE id = ?',
      [contactId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Update contact
    await pool.query(
      `UPDATE vendor_contacts 
       SET name = ?, email = ?, phone = ?, role = ?
       WHERE id = ?`,
      [name, email, phone, role, contactId]
    );

    // Fetch updated contact
    const [contacts] = await pool.query(
      'SELECT * FROM vendor_contacts WHERE id = ?',
      [contactId]
    );

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: contacts[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete contact
router.delete('/contacts/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    // Check if contact exists
    const [existing] = await pool.query(
      'SELECT id FROM vendor_contacts WHERE id = ?',
      [contactId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Delete contact
    await pool.query('DELETE FROM vendor_contacts WHERE id = ?', [contactId]);

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
