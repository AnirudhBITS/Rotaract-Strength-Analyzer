// Log environment variables FIRST before any imports
console.log('=== Server Starting ===');
console.log('=== Environment Check ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD set:', !!process.env.DB_PASSWORD);
console.log('=========================');

console.log('Loading app module...');
let app;
try {
  app = require('./app');
  console.log('App module loaded');
} catch (err) {
  console.error('Failed to load app module:', err.message);
  console.error(err.stack);
  process.exit(1);
}

console.log('Loading database module...');
const db = require('./config/database');
console.log('Database module loaded');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    console.log('Attempting database connection...');
    // Verify database connection
    await db.raw('SELECT 1');
    console.log('Database connected successfully');

    // Run migrations
    await db.migrate.latest({
      directory: './src/migrations',
    });
    console.log('Migrations completed');

    // Seed default admin if none exists
    const adminExists = await db('admins').first();
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await db('admins').insert({
        username: 'admin',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'super_admin',
      });
      console.log('Default admin created (username: admin, password: admin123)');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
