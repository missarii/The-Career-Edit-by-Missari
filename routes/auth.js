const express = require('express');
const { body, validationResult } = require('express-validator');
const { db } = require('../config/database');
const { generateToken, hashPassword, comparePassword } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          status: 'error', 
          message: 'Authentication failed' 
        });
      }

      if (!user) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Invalid credentials' 
        });
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        status: 'success',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Authentication failed' 
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public (admin only in production)
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error', 
      message: errors.array().map(e => e.msg).join(', ')
    });
  }

  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existing) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          status: 'error', 
          message: 'Registration failed' 
        });
      }

      if (existing) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'User already exists with this email' 
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Insert new user
      const sql = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `;

      db.run(sql, [name, email, hashedPassword, role || 'admin'], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ 
            status: 'error', 
            message: 'Registration failed' 
          });
        }

        // Generate token
        const token = generateToken({ id: this.lastID, email, role: role || 'admin' });

        res.status(201).json({
          status: 'success',
          message: 'User registered successfully',
          token,
          user: {
            id: this.lastID,
            email,
            name,
            role: role || 'admin'
          }
        });
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Registration failed' 
    });
  }
});

module.exports = router;