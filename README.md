# The Career Edit by Missari

A premium career services website offering CV writing, LinkedIn profile optimization, and cover letter services. Built with vanilla HTML, CSS, and JavaScript — no frameworks required.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Features
- **Animated Preloader** — Branded loading animation with smooth reveal
- **Sticky Header** — Navigation that transforms on scroll with backdrop blur
- **Mobile Navigation** — Hamburger menu with smooth animations
- **Interactive Hero** — Eye-catching hero section with animated ticket visual
- **Career Menu** — Accordion-style service cards with pricing
- **Before/After Sliders** — Interactive drag-to-compare examples
- **Testimonials Marquee** — Auto-scrolling client testimonials
- **Booking Form** — Full-featured form with file upload and Netlify Forms integration
- **Confetti Celebration** — Delightful confetti animation on form submission

### New Features Added
- **FAQ Section** — Accordion-style frequently asked questions
- **Statistics Counter** — Animated counters showing key metrics
- **Newsletter Signup** — Email subscription form
- **Back-to-Top Button** — Floating button with scroll progress
- **Dark Mode Toggle** — Manual dark/light mode switch
- **Scroll Progress Bar** — Visual indicator of page scroll position
- **Smooth Scroll Reveals** — Elements animate in as they enter viewport

### Design Features
- **Custom Cursor** — Branded cursor that follows mouse movement (desktop only)
- **Responsive Design** — Fully responsive from 400px to 4K displays
- **Accessibility** — ARIA labels, keyboard navigation, reduced motion support
- **Performance** — GPU-accelerated animations, optimized rendering
- **Print Styles** — Optimized for printing

## 🛠 Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — No dependencies, pure DOM manipulation
- **Netlify Forms** — Backend form handling
- **Google Fonts** — DM Sans + Caveat typography

## 📁 Project Structure

```
the-career-edit/
├── index.html                          # Single-file application
├── The Career Edit — Your story, written to win_files/
│   └── css2.css                        # Additional styles
└── README.md                           # Documentation
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Merlot | `#570301` | Primary brand color |
| Sky | `#BAD6FD` | Accent highlights |
| Butter | `#F7E594` | Secondary accent |
| Cream | `#FBF6EA` | Background |
| Paper | `#FFFFFF` | Card backgrounds |
| Ink | `#2A1810` | Text color |

## 🚀 Getting Started

### Prerequisites

**For Static Version:**
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code recommended)

**For Full-Stack Version (Recommended):**
- Node.js 18+ installed
- npm or yarn package manager
- SQLite3 (automatically installed via npm)

### Installation

#### Option 1: Static Version (Assar Only)

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd "The Career Edit by Missari"
   ```

2. **Open in browser**
   - Simply open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js
     npx serve .
     
     # PHP
     php -S localhost:8000
     ```

#### Option 2: Full-Stack Version (With Backend)

1. **Clone the project**
   ```bash
   git clone <repository-url>
   cd "The Career Edit by Missari"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Edit .env with your settings
   nano .env
   ```

4. **Initialize database**
   ```bash
   npm run init-db
   ```
   
   This will create:
   - SQLite database with default data
   - Admin user (email: `admin@thecareeredit.com`, password: `admin123`)
   - Sample services, testimonials, and FAQs

5. **Start the server**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-reload)
   npm run dev
   ```

6. **Access the application**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin (requires login)
   - API Health Check: http://localhost:3000/api/health

## ⚙️ Configuration

### Update Branding
Search and replace the following in `index.html`:

| Item | Current | Replace With |
|------|---------|--------------|
| Brand Name | `Missari` | Your name/brand |
| Email | `missari.wtct@gmail.com` | Your email |
| Instagram | `@thecareereditbymissari` | Your handle |
| Phone | `+94 7X XXX XXXX` | Your phone number |
| Prices (LKR) | Various | Your pricing |

### Update Services
Edit the Career Menu section (lines 883-999) to modify:
- Service names
- Descriptions
- Pricing
- Feature lists

### Form Integration
The booking form uses Netlify Forms. To use a different backend:

1. Locate the form submission code (lines 1618-1647)
2. Replace the `fetch()` call with your API endpoint
3. Update form field names to match your backend

## 📱 Frontend Features Breakdown

### 1. Preloader
- Animated brand reveal
- Auto-hides after 1.8s or on page load
- Respects `prefers-reduced-motion`

### 2. Custom Cursor
- Logo mark follows cursor on desktop
- Scales on hover over interactive elements
- Disabled on touch devices

### 3. Career Menu
- Click-to-expand accordion
- Smooth height animation
- SVG string connections (desktop only)

### 4. Before/After Sliders
- Touch-friendly drag interaction
- Keyboard accessible (arrow keys, spacebar)
- Smooth transitions

### 5. Booking Form
- Drag-and-drop file upload
- Form validation
- Success animation with confetti
- Netlify Forms / Backend API integration

### 6. Testimonials
- Auto-scrolling marquee
- Pauses on hover
- Seamless infinite loop

## 🔧 Backend Features

### API Endpoints

**Public Endpoints:**
- `POST /api/booking` - Submit booking request with CV upload
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/health` - Health check

**Admin Endpoints (Requires Authentication):**
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/services` - List all services
- `POST /api/admin/services` - Create new service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service
- `GET /api/admin/testimonials` - List testimonials
- `POST /api/admin/testimonials` - Create testimonial
- `GET /api/admin/faqs` - List FAQs
- `POST /api/admin/faqs` - Create FAQ
- `PUT /api/admin/faqs/:id` - Update FAQ
- `GET /api/admin/statistics` - Get statistics
- `PUT /api/admin/statistics` - Update statistics
- `GET /api/booking` - List all bookings
- `PUT /api/booking/:id` - Update booking status
- `GET /api/booking/stats/summary` - Booking statistics
- `GET /api/contact` - List contact messages
- `PUT /api/contact/:id` - Update message status

### Database Schema

**Tables:**
- `users` - Admin users for authentication
- `bookings` - Course booking requests with CV uploads
- `newsletter_subscribers` - Email newsletter subscriptions
- `contact_messages` - Contact form submissions
- `services` - Career services/pricing management
- `testimonials` - Client testimonials
- `faqs` - Frequently asked questions
- `statistics` - Site statistics (clients, CVs written, etc.)

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- XSS protection
- Helmet security headers
- File upload validation (type and size)
- SQL injection prevention (parameterized queries)

## 🎯 Customization Guide

### Changing Colors
Edit CSS custom properties in the `:root` selector (lines 13-27):

```css
:root{
  --merlot:#570301;        /* Primary */
  --sky:#BAD6FD;           /* Accent */
  --butter:#F7E594;        /* Secondary */
  --cream:#FBF6EA;         /* Background */
  --paper:#FFFFFF;         /* Cards */
  --ink:#2A1810;           /* Text */
}
```

### Adding New Services
1. Copy a `.course` div (lines 895-922)
2. Update the content
3. Add a new `<option>` in the booking form (line 1267-1272)

### Modifying Animations
Animation timings are controlled by CSS transitions and JavaScript timeouts. Key locations:
- Preloader: `setTimeout(revealPage, 1800)` (line 1325)
- Scroll reveal: `threshold: 0.12` (line 1377)
- Confetti: `fireConfetti()` function (lines 1480-1515)

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Bundle Size**: ~250KB (unminified, includes all CSS/JS)

### Optimization Tips
1. Minify CSS/JS for production
2. Optimize images (use WebP format)
3. Enable gzip compression on server
4. Use CDN for fonts (already implemented)

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

**Note**: Custom cursor and some animations are disabled on:
- Touch devices
- `prefers-reduced-motion: reduce`
- Browsers without pointer support

## 🛡️ Security & Production Deployment

### Security Checklist

Before deploying to production:

1. **Change default credentials**
   - Update admin password in database
   - Change JWT_SECRET in `.env`
   - Use strong, unique passwords

2. **Configure environment**
   - Set `NODE_ENV=production`
   - Update `ALLOWED_ORIGINS` with your domain
   - Configure email settings (SMTP)

3. **Enable HTTPS**
   - Use reverse proxy (Nginx/Apache) or deployment platform SSL
   - Never expose `.env` file

4. **Database backups**
   - Schedule regular SQLite database backups
   - Consider migrating to PostgreSQL for high traffic

### Deployment Options

**Option 1: VPS/Cloud Server**
```bash
# Using PM2 for process management
npm install -g pm2
pm2 start server.js --name "career-edit"
pm2 save
pm2 startup
```

**Option 2: Railway/Render/Heroku**
```bash
# These platforms auto-detect Node.js apps
# Just push your code and set environment variables
```

**Option 3: Netlify Functions + External Database**
- Deploy frontend on Netlify
- Use Netlify Functions for API
- Replace SQLite with external database (PostgreSQL/MySQL)

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `DATABASE_PATH` | SQLite file path | No | ./database.sqlite |
| `JWT_SECRET` | Secret key for JWT | Yes | - |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | * |
| `EMAIL_HOST` | SMTP host | No | - |
| `EMAIL_USER` | SMTP username | No | - |
| `EMAIL_PASS` | SMTP password | No | - |

## 📄 License

MIT License — feel free to use this project for personal or commercial purposes.

## 👤 Author

**Missari** — Career Edit Specialist
- Instagram: [@thecareereditbymissari](https://www.instagram.com/thecareereditbymissari)
- Email: missari.wtct@gmail.com
- Location: Colombo, Sri Lanka

## 🙏 Credits

- Fonts: [Google Fonts](https://fonts.google.com/) (DM Sans, Caveat)
- Icons: Inline SVGs
- Inspiration: Modern web design trends

## 📝 Changelog

### v1.0.0 (2026)
- Initial release
- Complete brand refresh from Epoch to Missari
- Added FAQ, Statistics, Newsletter sections
- Implemented dark mode toggle
- Added scroll progress indicator
- Enhanced mobile experience

### v2.0.0 (2026) - Backend Integration
- Added Express.js backend server
- SQLite database with complete schema
- JWT-based admin authentication
- File upload for CVs (PDF, DOC, DOCX)
- Newsletter subscription management
- Contact form with database storage
- Admin panel API for content management
- Services, testimonials, and FAQs management
- Dashboard statistics
- Security middleware (Helmet, rate limiting, XSS protection)
- Email notification system (ready for SMTP configuration)

### v2.1.0 (2026) - UI/UX Overhaul
- Expanded full dark mode support across all sections (Ticket, FAQ, Stats, Newsletter)
- Improved semantic CSS variables for dark mode mapping
- Added new hover interactions and subtle micro-animations for cards
- Improved mobile responsiveness and grid behavior on smaller screens
- Re-wired the booking form to submit to the local Node.js API with FormData for CV uploads

---

**Built with ❤️ in Colombo, Sri Lanka**
