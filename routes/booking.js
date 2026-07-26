const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { db } = require('../config/database');

const router = express('router');

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true );
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX allowed.'));
    }
  }
});

// @route   POST /api/booking
// @desc    Submit a booking request
// @access  Public
router.post('/', upload.single('cv'), (req, res, next) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error', 
      message: errors.array().map(e => e.msg).join(', ') 
    });
  }

  const { name, designation, contact, email, course, source } = req.body;
  const cvFilename = req.file ? req.file.filename : null;

  // Insert booking into database
  const sql = `
    INSERT INTO bookings (name, designation, contact, email, course, source, cv_filename)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, designation, contact, email, course, source, cvFilename], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to save booking. Please try again.' 
      });
    }

    // TODO: Send email notification here using nodemailer

    res.status(201).json({
      status: 'success',
      message: 'Booking request received successfully',
      data: {
        id: this.lastID,
        name,
        email,
        course,
        cvUploaded: !!cvFilename
      }
    });
  });
}, (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'File size too large. Maximum 10MB allowed.' 
      });
    }
    return res.status(400).json({ 
      status: 'error', 
      message: err.message 
    });
  }
  next(err);
});

// @route   GET /api/booking
// @desc    Get all bookings (admin only)
// @access  Private/Admin
router.get('/', authenticateToken, (req, res) => {
  const sql = `
    SELECT * FROM bookings 
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
        message: 'Failed to fetch bookings' 
      });
    }

    // Get total count
    db.get('SELECT COUNT(*) as total FROM bookings', (err, countRow) => {
      if (err) {
        return res.status(500).json({ 
          status: 'error', 
          message: 'Failed to fetch bookings count' 
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

// @route   PUT /api/booking/:id
// @desc    Update booking status (admin only)
// @access  Private/Admin
router.put('/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Invalid status value' 
    });
  }

  const sql = `
    UPDATE bookings 
    SET status = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `;

  db.run(sql, [status, req.params.id], function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to update booking status' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Booking not found' 
      });
    }

    res.json({
      status: 'success',
      message: 'Booking status updated'
    });
  });
});

// @route   GET /api/booking/stats
// @desc    Get booking statistics (admin only)
// @access  Private/Admin
router.get('/stats/summary', authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as total_bookings,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
      COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled
    FROM bookings
  `;

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

module.exports = router;