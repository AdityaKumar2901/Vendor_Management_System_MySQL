const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all purchase orders with filters and pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      vendorId = '',
      status = '',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build query
    let sql = `
      SELECT po.*, v.name as vendor_name 
      FROM purchase_orders po
      LEFT JOIN vendors v ON po.vendor_id = v.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by vendor
    if (vendorId) {
      sql += ' AND po.vendor_id = ?';
      params.push(vendorId);
    }

    // Filter by status
    if (status && ['draft', 'submitted', 'received'].includes(status)) {
      sql += ' AND po.status = ?';
      params.push(status);
    }

    // Get total count
    const countSql = sql.replace(
      'SELECT po.*, v.name as vendor_name',
      'SELECT COUNT(*) as total'
    );
    const [countResult] = await pool.query(countSql, params);
    const total = countResult[0].total;

    // Add sorting and pagination
    sql += ' ORDER BY po.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    // Execute query
    const [purchaseOrders] = await pool.query(sql, params);

    res.json({
      success: true,
      data: {
        purchaseOrders,
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

// Get single purchase order by ID (with items)
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get purchase order
    const [purchaseOrders] = await pool.query(
      `SELECT po.*, v.name as vendor_name 
       FROM purchase_orders po
       LEFT JOIN vendors v ON po.vendor_id = v.id
       WHERE po.id = ?`,
      [id]
    );

    if (purchaseOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    // Get items
    const [items] = await pool.query(
      `SELECT poi.*, vp.name as product_name, vp.sku
       FROM purchase_order_items poi
       LEFT JOIN vendor_products vp ON poi.product_id = vp.id
       WHERE poi.purchase_order_id = ?`,
      [id]
    );

    const purchaseOrder = {
      ...purchaseOrders[0],
      items
    };

    res.json({
      success: true,
      data: purchaseOrder
    });
  } catch (error) {
    next(error);
  }
});

// Create new purchase order with items
router.post('/', async (req, res, next) => {
  try {
    const { vendor_id, po_number, status, order_date, notes, items } = req.body;

    // Validation
    if (!vendor_id) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required'
      });
    }

    if (!po_number) {
      return res.status(400).json({
        success: false,
        message: 'PO number is required'
      });
    }

    if (!order_date) {
      return res.status(400).json({
        success: false,
        message: 'Order date is required'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Check if vendor exists
    const [vendors] = await pool.query(
      'SELECT id FROM vendors WHERE id = ?',
      [vendor_id]
    );

    if (vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    // Check if PO number already exists
    const [existingPO] = await pool.query(
      'SELECT id FROM purchase_orders WHERE po_number = ?',
      [po_number]
    );

    if (existingPO.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Purchase order number '${po_number}' already exists. Please use a different PO number.`
      });
    }

    // Insert purchase order
    const [poResult] = await pool.query(
      `INSERT INTO purchase_orders (vendor_id, po_number, status, order_date, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [vendor_id, po_number, status || 'draft', order_date, notes || null]
    );

    console.log('PO insert result:', poResult);
    const purchaseOrderId = poResult.insertId;
    console.log('Purchase Order ID:', purchaseOrderId);

    if (!purchaseOrderId) {
      throw new Error('Failed to get purchase order ID');
    }

    // Insert items
    for (const item of items) {
      if (!item.product_id || !item.qty || !item.unit_price) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have product_id, qty, and unit_price'
        });
      }

      // Verify product exists and belongs to the vendor
      const [products] = await pool.query(
        'SELECT id FROM vendor_products WHERE id = ? AND vendor_id = ?',
        [item.product_id, vendor_id]
      );

      if (products.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product_id} not found or does not belong to this vendor`
        });
      }

      console.log('Inserting item:', { purchaseOrderId, product_id: item.product_id, qty: item.qty, unit_price: item.unit_price });
      await pool.query(
        `INSERT INTO purchase_order_items (purchase_order_id, product_id, qty, unit_price)
         VALUES (?, ?, ?, ?)`,
        [purchaseOrderId, item.product_id, item.qty, item.unit_price]
      );
    }

    // Fetch created purchase order with items
    const [newPO] = await pool.query(
      `SELECT po.*, v.name as vendor_name 
       FROM purchase_orders po
       LEFT JOIN vendors v ON po.vendor_id = v.id
       WHERE po.id = ?`,
      [purchaseOrderId]
    );

    const [newItems] = await pool.query(
      `SELECT poi.*, vp.name as product_name, vp.sku
       FROM purchase_order_items poi
       LEFT JOIN vendor_products vp ON poi.product_id = vp.id
       WHERE poi.purchase_order_id = ?`,
      [purchaseOrderId]
    );

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully',
      data: {
        ...newPO[0],
        items: newItems
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update purchase order (header only)
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, order_date, notes } = req.body;

    // Check if purchase order exists
    const [existing] = await pool.query(
      'SELECT id FROM purchase_orders WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    // Validation
    if (!order_date) {
      return res.status(400).json({
        success: false,
        message: 'Order date is required'
      });
    }

    // Update purchase order
    await pool.query(
      `UPDATE purchase_orders 
       SET status = ?, order_date = ?, notes = ?
       WHERE id = ?`,
      [status || 'draft', order_date, notes, id]
    );

    // Fetch updated purchase order
    const [purchaseOrders] = await pool.query(
      `SELECT po.*, v.name as vendor_name 
       FROM purchase_orders po
       LEFT JOIN vendors v ON po.vendor_id = v.id
       WHERE po.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Purchase order updated successfully',
      data: purchaseOrders[0]
    });
  } catch (error) {
    next(error);
  }
});

// Update purchase order items (replace all items)
router.put('/:id/items', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Check if purchase order exists
    const [purchaseOrders] = await pool.query(
      'SELECT vendor_id FROM purchase_orders WHERE id = ?',
      [id]
    );

    if (purchaseOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    const vendorId = purchaseOrders[0].vendor_id;

    // Delete existing items
    await pool.query(
      'DELETE FROM purchase_order_items WHERE purchase_order_id = ?',
      [id]
    );

    // Insert new items
    for (const item of items) {
      if (!item.product_id || !item.qty || !item.unit_price) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have product_id, qty, and unit_price'
        });
      }

      // Verify product exists and belongs to the vendor
      const [products] = await pool.query(
        'SELECT id FROM vendor_products WHERE id = ? AND vendor_id = ?',
        [item.product_id, vendorId]
      );

      if (products.length === 0) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product_id} not found or does not belong to this vendor`
        });
      }

      await pool.query(
        `INSERT INTO purchase_order_items (purchase_order_id, product_id, qty, unit_price)
         VALUES (?, ?, ?, ?)`,
        [id, item.product_id, item.qty, item.unit_price]
      );
    }

    // Fetch updated items
    const [updatedItems] = await pool.query(
      `SELECT poi.*, vp.name as product_name, vp.sku
       FROM purchase_order_items poi
       LEFT JOIN vendor_products vp ON poi.product_id = vp.id
       WHERE poi.purchase_order_id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Purchase order items updated successfully',
      data: updatedItems
    });
  } catch (error) {
    next(error);
  }
});

// Delete purchase order
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if purchase order exists
    const [existing] = await pool.query(
      'SELECT id FROM purchase_orders WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }

    // Delete purchase order (cascade will delete items)
    await pool.query('DELETE FROM purchase_orders WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Purchase order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
