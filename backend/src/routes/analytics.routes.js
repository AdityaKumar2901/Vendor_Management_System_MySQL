const express = require('express');
const { query } = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Helper function to get date range defaults
function getDateRange(start, end) {
  const endDate = end ? new Date(end) : new Date();
  const startDate = start ? new Date(start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0]
  };
}

// GET /api/analytics/spend-by-vendor
// Returns total spend grouped by vendor
router.get('/spend-by-vendor', async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const dateRange = getDateRange(start, end);

    const sql = `
      SELECT 
        v.id as vendorId,
        v.name as vendorName,
        COALESCE(SUM(poi.qty * poi.unit_price), 0) as totalSpend
      FROM vendors v
      LEFT JOIN purchase_orders po ON v.id = po.vendor_id
        AND po.order_date >= ?
        AND po.order_date <= ?
      LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      GROUP BY v.id, v.name
      HAVING totalSpend > 0
      ORDER BY totalSpend DESC
    `;

    const [results] = await query(sql, [dateRange.start, dateRange.end]);

    res.json({
      success: true,
      data: results,
      dateRange
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/spend-trend
// Returns spend over time (monthly aggregation)
router.get('/spend-trend', async (req, res, next) => {
  try {
    const { vendorId, start, end, interval = 'month' } = req.query;
    const dateRange = getDateRange(start, end);

    let sql = `
      SELECT 
        strftime('%Y-%m', po.order_date) as period,
        COALESCE(SUM(poi.qty * poi.unit_price), 0) as totalSpend
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      WHERE po.order_date >= ?
        AND po.order_date <= ?
    `;

    const params = [dateRange.start, dateRange.end];

    // Filter by vendor if specified
    if (vendorId && vendorId !== 'all') {
      sql += ' AND po.vendor_id = ?';
      params.push(vendorId);
    }

    sql += ' GROUP BY period ORDER BY period ASC';

    const [results] = await query(sql, params);

    res.json({
      success: true,
      data: results,
      dateRange,
      vendorId: vendorId || 'all'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/po-status
// Returns count of purchase orders by status
router.get('/po-status', async (req, res, next) => {
  try {
    const { vendorId, start, end } = req.query;
    const dateRange = getDateRange(start, end);

    let sql = `
      SELECT 
        status,
        COUNT(*) as count
      FROM purchase_orders
      WHERE order_date >= ?
        AND order_date <= ?
    `;

    const params = [dateRange.start, dateRange.end];

    if (vendorId && vendorId !== 'all') {
      sql += ' AND vendor_id = ?';
      params.push(vendorId);
    }

    sql += ' GROUP BY status ORDER BY status';

    const [results] = await query(sql, params);

    res.json({
      success: true,
      data: results,
      dateRange,
      vendorId: vendorId || 'all'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/summary
// Returns overall summary stats
router.get('/summary', async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const dateRange = getDateRange(start, end);

    const [totalSpendResult] = await query(`
      SELECT COALESCE(SUM(poi.qty * poi.unit_price), 0) as total
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      WHERE po.order_date >= ? AND po.order_date <= ?
    `, [dateRange.start, dateRange.end]);

    const [orderCountResult] = await query(`
      SELECT COUNT(*) as count
      FROM purchase_orders
      WHERE order_date >= ? AND order_date <= ?
    `, [dateRange.start, dateRange.end]);

    const [activeVendorsResult] = await query(`
      SELECT COUNT(DISTINCT vendor_id) as count
      FROM purchase_orders
      WHERE order_date >= ? AND order_date <= ?
    `, [dateRange.start, dateRange.end]);

    res.json({
      success: true,
      data: {
        totalSpend: totalSpendResult[0].total,
        orderCount: orderCountResult[0].count,
        activeVendors: activeVendorsResult[0].count
      },
      dateRange
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
