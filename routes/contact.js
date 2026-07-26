const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('message').notEmpty().withMessage('Message is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error', 
      message: errors.array().map(e => e.msg).join(', ')
    });
  }

  const { name, email, subject, message } = req.body;

  const sql = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [name, email, subject || null, message], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to send message. Please try again.' 
      });
    }

    // TODO: Send email notification here using nodemailer

    res.status(201).json({
      status: 'success',
      message: 'Message sent successfully! We\'ll get back to you soon.'
    });
  });
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin only)
// @access  Private/Admin
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, (req, res) => {
  const sql = `
    SELECT * FROM contact_messages 
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  db.all(sql, [limit, offset], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to fetch messages' 
      });
    }

    db.get('SELECT COUNT(*) as total FROM contact_messages', (err, countRow) => {
      if (err) {
        return res.status(500).json({ 
          status: 'error', 
          message: 'Failed to fetch messages count' 
        });
      }

      res.json({
        status: 'success',
        data: rows,
        pagination: {
          page,
          limit,
          total: countRow.total,
          pages: Math.ceil(countRow.total / limit)
        }
      });
    });
  });
});

// @route   PUT /api/contact/:id
// @desc    Update contact message status (admin only)
// @access  Private/Admin
router.put('/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  
  const validStatuses = ['unread', 'read', 'replied', 'archived'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Invalid status value' 
    });
  }

  const sql = `
    UPDATE contact_messages 
    SET status = ?
    WHERE id = ?
  `;

  db.run(sql, [status, req.params.id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to update message status' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Message not found' 
      });
    }

    res.json({
      status: 'success',
      message: 'Message status updated'
    });
  });
});

module.exports = router;