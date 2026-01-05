const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all products for a vendor
router.get('/vendors/:vendorId/products', async (req, res, next) => {
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

    // Get products
    const [products] = await pool.query(
      'SELECT * FROM vendor_products WHERE vendor_id = ? ORDER BY created_at DESC',
      [vendorId]
    );

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

// Create new product for a vendor
router.post('/vendors/:vendorId/products', async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { name, sku, unit_price, active } = req.body;

    console.log('Creating product:', { vendorId, name, sku, unit_price, active });

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    if (unit_price === undefined || unit_price === null) {
      return res.status(400).json({
        success: false,
        message: 'Unit price is required'
      });
    }

    if (isNaN(unit_price) || parseFloat(unit_price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Unit price must be a valid positive number'
      });
    }

    // Check if vendor exists
    console.log('Checking if vendor exists:', vendorId);
    const [vendors] = await pool.query(
      'SELECT id FROM vendors WHERE id = ?',
      [vendorId]
    );

    console.log('Vendor query result:', vendors);

    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Insert product
    console.log('Inserting product...');
    const [result] = await pool.query(
      `INSERT INTO vendor_products (vendor_id, name, sku, unit_price, active)
       VALUES (?, ?, ?, ?, ?)`,
      [
        vendorId,
        name,
        sku || null,
        parseFloat(unit_price),
        active !== undefined ? active : true
      ]
    );

    console.log('Insert result:', result);

    // Fetch created product
    const [products] = await pool.query(
      'SELECT * FROM vendor_products WHERE id = ?',
      [result.insertId]
    );

    console.log('Created product:', products);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: products[0]
    });
  } catch (error) {
    console.error('Error creating product:', error);
    next(error);
  }
});

// Update product
router.put('/products/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, sku, unit_price, active } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    if (unit_price === undefined || unit_price === null) {
      return res.status(400).json({
        success: false,
        message: 'Unit price is required'
      });
    }

    if (isNaN(unit_price) || parseFloat(unit_price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Unit price must be a valid positive number'
      });
    }

    // Check if product exists
    const [existing] = await pool.query(
      'SELECT id FROM vendor_products WHERE id = ?',
      [productId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product
    await pool.query(
      `UPDATE vendor_products 
       SET name = ?, sku = ?, unit_price = ?, active = ?
       WHERE id = ?`,
      [name, sku, parseFloat(unit_price), active !== undefined ? active : true, productId]
    );

    // Fetch updated product
    const [products] = await pool.query(
      'SELECT * FROM vendor_products WHERE id = ?',
      [productId]
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: products[0]
    });
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/products/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const [existing] = await pool.query(
      'SELECT id FROM vendor_products WHERE id = ?',
      [productId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product
    await pool.query('DELETE FROM vendor_products WHERE id = ?', [productId]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
