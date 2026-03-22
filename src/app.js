const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const applicationRoutes = require('./routes/application');
const adminRoutes = require('./routes/admin');
const allocationRoutes = require('./routes/allocation');
const uploadRoutes = require('./routes/upload');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ].filter(Boolean);

    if (allowed.some((url) => origin === url || origin === url.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    // Also allow same base domain
    if (origin.includes('blackitechs.org')) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Parsing & compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/application', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/allocation', allocationRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production - DISABLED FOR TESTING
// if (process.env.NODE_ENV === 'production') {
//   const clientDistPath = path.join(__dirname, '../client/dist');
//   app.use(express.static(clientDistPath));
//
//   // Handle React Router - serve index.html for all non-API routes
//   // Express 5 requires named parameter for wildcards
//   app.get('/{*splat}', (req, res) => {
//     res.sendFile(path.join(clientDistPath, 'index.html'));
//   });
// }

// Error handling
app.use(errorHandler);

module.exports = app;
