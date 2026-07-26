const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { db } = require('../config/database');

const router = express.Router();

// All admin routes require authentication
router.use(authenticateToken);

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM bookings) as total_bookings,
      (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
      (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active') as total_subscribers,
      (SELECT COUNT(*) FROM contact_messages WHERE status = 'unread') as unread_messages,
      (SELECT COUNT(*) FROM services WHERE is_active = 1) as active_services
  `;

  db.get(sql, (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch dashboard data' 
      });
    }

    res.json({
      status: 'success',
      data: row
    });
  });
});

// @route   GET /api/admin/services
// @desc    Get all services
// @access  Private/Admin
router.get('/services', (req, res) => {
  const sql = `
    SELECT * FROM services
    ORDER BY category, sort_order, created_at DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch services' 
      });
    }

    res.json({
      status: 'success',
      data: rows
    });
  });
});

// @route   POST /api/admin/services
// @desc    Create new service
// @access  Private/Admin
router.post('/services', (req, res) => {
  const { name, category, description, price, features, target_audience, is_featured } = req.body;

  const sql = `
    INSERT INTO services (name, category, description, price, features, target_audience, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, category, description, price, features, target_audience, is_featured || 0], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to create service' 
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Service created successfully',
      data: { id: this.lastID }
    });
  });
});

// @route   PUT /api/admin/services/:id
// @desc    Update service
// @access  Private/Admin
router.put('/services/:id', (req, res) => {
  const { name, category, description, price, features, target_audience, is_featured, is_active } = req.body;

  const sql = `
    UPDATE services 
    SET name = ?, category = ?, description = ?, price = ?, features = ?, 
        target_audience = ?, is_featured = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [name, category, description, price, features, target_audience, is_featured || 0, is_active || 1, req.params.id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to update service' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Service not found' 
      });
    }

    res.json({
      status: 'success',
      message: 'Service updated successfully'
    });
  });
});

// @route   DELETE /api/admin/services/:id
// @desc    Delete service
// @access  Private/Admin
router.delete('/services/:id', (req, res) => {
  const sql = `DELETE FROM services WHERE id = ?`;

  db.run(sql, [req.params.id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to delete service' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Service not found' 
      });
    }

    res.json({
      status: 'success',
      message: 'Service deleted successfully'
    });
  });
});

// @route   GET /api/admin/testimonials
// @desc    Get all testimonials
// @access  Private/Admin
router.get('/testimonials', (req, res) => {
  const sql = `
    SELECT * FROM testimonials
    ORDER BY is_featured DESC, created_at DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch testimonials' 
      });
    }

    res.json({
      status: 'success',
      data: rows
    });
  });
});

// @route   POST /api/admin/testimonials
// @desc    Create new testimonial
// @access  Private/Admin
router.post('/testimonials', (req, res) => {
  const { name, role, content, rating, is_featured } = req.body;

  const sql = `
    INSERT INTO testimonials (name, role, content, rating, is_featured)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, role, content, rating || 5, is_featured || 0], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to create testimonial' 
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Testimonial created successfully',
      data: { id: this.lastID }
    });
  });
});

// @route   GET /api/admin/faqs
// @desc    Get all FAQs
// @access  Private/Admin
router.get('/faqs', (req, res) => {
  const sql = `
    SELECT * FROM faqs
    ORDER BY sort_order ASC, created_at DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch FAQs' 
      });
    }

    res.json({
      status: 'success',
      data: rows
    });
  });
});

// @route   POST /api/admin/faqs
// @desc    Create new FAQ
// @access  Private/Admin
router.post('/faqs', (req, res) => {
  const { question, answer, category, sort_order } = req.body;

  const sql = `
    INSERT INTO faqs (question, answer, category, sort_order)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [question, answer, category || 'general', sort_order || 0], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to create FAQ' 
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'FAQ created successfully',
      data: { id: this.lastID }
    });
  });
});

// @route   PUT /api/admin/faqs/:id
// @desc    Update FAQ
// @access  Private/Admin
router.put('/faqs/:id', (req, res) => {
  const { question, answer, category, sort_order, is_active } = req.body;

  const sql = `
    UPDATE faqs 
    SET question = ?, answer = ?, category = ?, sort_order = ?, is_active = ?
    WHERE id = ?
  `;

  db.run(sql, [question, answer, category, sort_order, is_active || 1, req.params.id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to update FAQ' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'FAQ not found' 
      });
    }

    res.json({
      status: 'success',
      message: 'FAQ updated successfully'
    });
  });
});

// @route   GET /api/admin/statistics
// @desc    Get statistics
// @access  Private/Admin
router.get('/statistics', (req, res) => {
  const sql = `SELECT * FROM statistics LIMIT 1`;

  db.get(sql, (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch statistics' 
      });
    }

    res.json({
      status: 'success',
      data: row
    });
  });
});

// @route   PUT /api/admin/statistics
// @desc    Update statistics
// @access  Private/Admin
router.put('/statistics', (req, res) => {
  const { clients_count, cvs_written, success_rate, countries_count } = req.body;

  const sql = `
    UPDATE statistics 
    SET clients_count = ?, cvs_written = ?, success_rate = ?, countries_count = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `;

  db.run(sql, [clients_count, cvs_written, success_rate, countries_count], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to update statistics' 
      });
    }

    res.json({
      status: 'success',
      message: 'Statistics updated successfully'
    });
  });
});

module.exports = router;