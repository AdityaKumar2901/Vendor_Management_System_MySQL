const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./db');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth.routes');
const vendorsRoutes = require('./routes/vendors.routes');
const contactsRoutes = require('./routes/contacts.routes');
const productsRoutes = require('./routes/products.routes');
const purchaseOrdersRoutes = require('./routes/purchaseOrders.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Auth routes (no auth middleware)
app.use('/api/auth', authRoutes);

// Dashboard endpoint (protected)
app.get('/api/dashboard', authMiddleware, async (req, res, next) => {
  try {
    const pool = require('./db');

    // Get counts
    const [vendorCount] = await pool.query('SELECT COUNT(*) as count FROM vendors');
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM vendor_products');
    const [openPOCount] = await pool.query(
      "SELECT COUNT(*) as count FROM purchase_orders WHERE status IN ('draft', 'submitted')"
    );
    const [totalPOCount] = await pool.query('SELECT COUNT(*) as count FROM purchase_orders');

    res.json({
      success: true,
      data: {
        vendors: vendorCount[0].count,
        products: productCount[0].count,
        openPurchaseOrders: openPOCount[0].count,
        totalPurchaseOrders: totalPOCount[0].count
      }
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes
app.use('/api/vendors', vendorsRoutes);
app.use('/api', contactsRoutes);
app.use('/api', productsRoutes);
app.use('/api/purchase-orders', purchaseOrdersRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
