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
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Parsing & compression
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

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
