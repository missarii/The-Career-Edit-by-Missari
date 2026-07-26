const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Bookings table
      const createBookingsTable = `
        CREATE TABLE IF NOT EXISTS bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          designation TEXT NOT NULL,
          contact TEXT NOT NULL,
          email TEXT NOT NULL,
          course TEXT NOT NULL,
          source TEXT NOT NULL,
          cv_filename TEXT,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Newsletter subscribers table
      const createNewsletterTable = `
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Contact messages table
      const createContactTable = `
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'unread',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Services table (for managing career menu items)
      const createServicesTable = `
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          features TEXT,
          target_audience TEXT,
          is_featured BOOLEAN DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Statistics table
      const createStatsTable = `
        CREATE TABLE IF NOT EXISTS statistics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clients_count INTEGER DEFAULT 500,
          cvs_written INTEGER DEFAULT 1200,
          success_rate INTEGER DEFAULT 95,
          countries_count INTEGER DEFAULT 50,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Testimonials table
      const createTestimonialsTable = `
        CREATE TABLE IF NOT EXISTS testimonials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          rating INTEGER DEFAULT 5,
          is_featured BOOLEAN DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // FAQ table
      const createFaqTable = `
        CREATE TABLE IF NOT EXISTS faqs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          category TEXT DEFAULT 'general',
          sort_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Execute all table creation queries
      db.run(createUsersTable, (err) => {
        if (err) return reject(err);
        
        db.run(createBookingsTable, (err) => {
          if (err) return reject(err);
          
          db.run(createNewsletterTable, (err) => {
            if (err) return reject(err);
            
            db.run(createContactTable, (err) => {
              if (err) return reject(err);
              
              db.run(createServicesTable, (err) => {
                if (err) return reject(err);
                
                db.run(createStatsTable, (err) => {
                  if (err) return reject(err);
                    
                  db.run(createTestimonialsTable, (err) => {
                    if (err) return reject(err);
                    
                    db.run(createFaqTable, (err) => {
                      if (err) return reject(err);
                      
                      // Insert default statistics if not exists
                      db.run(`INSERT OR IGNORE INTO statistics (id) VALUES (1)`);
                      
                      console.log('✅ Database tables initialized');
                      resolve();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

module.exports = { db, initDatabase };