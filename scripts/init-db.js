const { db } = require('../config/database');

async function initDB() {
  console.log('Initializing database with default data...');

  // Create default admin user
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  db.run(
    'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    ['Admin User', 'admin@thecareeredit.com', hashedPassword, 'admin'],
    (err) => {
      if (err) console.error('Error creating admin user:', err);
      else console.log('✓ Admin user created (email: admin@thecareeredit.com, password: admin123)');
    }
  );

  // Insert default services
  const services = [
    ['Starters', 'starter', 'CV redesign for students and fresh graduates', 3000, 'CV redesign|Grammar correction|Professional formatting|Better layout', 'Students & Fresh Graduates', 0],
    ['Main Course', 'main', 'Full CV rewrite for working professionals', 5000, 'Full CV rewrite|Achievement-focused writing|ATS-friendly formatting|LinkedIn headline improvement', 'Working Professionals', 1],
    ['Dessert', 'premium', 'Premium CV + LinkedIn for managers and executives', 15000, 'Premium CV|Cover letter|LinkedIn optimization|Two rounds of revisions', 'Managers & Executives', 0]
  ];

  services.forEach(service => {
    db.run(
      'INSERT OR IGNORE INTO services (name, category, description, price, features, target_audience, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
      service,
      (err) => {
        if (err) console.error('Error creating service:', err);
      }
    );
  });

  // Insert default testimonials
  const testimonials = [
    ['Kavindi P.', 'Fresh Graduate, Colombo', 'Before Missari, I thought I had no achievements because I was only a fresh graduate. After our conversation, they helped me see my university projects differently. I finally felt confident applying.', 5, 1],
    ['Nimal F.', 'Marketing Executive', 'I applied for months with no response. After updating my CV with Missari, I started getting interview calls within weeks.', 5, 1],
    ['Tharindu J.', 'Operations Manager', 'My experience was valuable, but my CV wasn\'t showing it. Missari helped me present my career properly.', 5, 0]
  ];

  testimonials.forEach(t => {
    db.run(
      'INSERT OR IGNORE INTO testimonials (name, role, content, rating, is_featured) VALUES (?, ?, ?, ?, ?)',
      t,
      (err) => {
        if (err) console.error('Error creating testimonial:', err);
      }
    );
  });

  // Insert default FAQs
  const faqs = [
    ['How long does the process take?', 'Most projects are completed within 5-7 business days. Rush delivery is available for an additional fee if you need it sooner.', 'general', 1],
    ['What information do you need from me?', 'Just your existing CV (if you have one) and a willingness to chat. We\'ll pull out the stories and achievements during our conversation.', 'general', 2],
    ['Do you offer revisions?', 'Absolutely. All packages include at least one round of revisions. The Dessert package includes two rounds to make sure everything is perfect.', 'general', 3],
    ['What payment methods do you accept?', 'We accept bank transfers, PayPal, and all major credit/debit cards. Payment is typically 50% upfront to secure your slot, with the balance on delivery.', 'general', 4],
    ['Can I see samples of your work?', 'Yes! Check out the Before & After section above to see real examples. We also share anonymized samples during our initial call.', 'general', 5]
  ];

  faqs.forEach(faq => {
    db.run(
      'INSERT OR IGNORE INTO faqs (question, answer, category, sort_order) VALUES (?, ?, ?, ?)',
      faq,
      (err) => {
        if (err) console.error('Error creating FAQ:', err);
      }
    );
  });

  setTimeout(() => {
    console.log('✓ Database initialized with default data');
    console.log('\n📋 Default Admin Credentials:');
    console.log('   Email: admin@thecareeredit.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change these credentials in production!\n');
    process.exit(0);
  }, 1000);
}

initDB();