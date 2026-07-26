const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', [
  body('email').isEmail().withMessage('Please provide a valid email')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error', 
      message: errors.array()[0].msg 
    });
  }

  const { email } = req.body;

  const sql = `
    INSERT INTO newsletter_subscribers (email)
    VALUES (?)
  `;

  db.run(sql, [email], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint')) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'You are already subscribed to our newsletter!' 
        });
      }
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to subscribe. Please try again.' 
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Thank you for subscribing to our newsletter!'
    });
  });
});

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', [
  body('email').isEmail().withMessage('Please provide a valid email')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error', 
      message: errors.array()[0].msg 
    });
  }

  const { email } = req.body;

  const sql = `
    UPDATE newsletter_subscribers 
    SET status = 'unsubscribed'
    WHERE email = ? AND status = 'active'
  `;

  db.run(sql, [email], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to unsubscribe. Please try again.' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Email not found in our subscribers list' 
      });
    }

    res.json({
      status: 'success',
      message: 'You have been unsubscribed successfully'
    });
  });
});

// @route   GET /api/newsletter/subscribers
// @desc    Get all subscribers (admin only)
// @access  Private/Admin
const { authenticateToken } = require('../middleware/auth');

router.get('/subscribers', authenticateToken, (req, res) => {
  const sql = `
    SELECT id, email, status, created_at
    FROM newsletter_subscribers
    WHERE status = 'active'
    ORDER BY created_at DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch subscribers' 
      });
    }

    res.json({
      status: 'success',
      data: rows
    });
  });
});

module.exports = router;