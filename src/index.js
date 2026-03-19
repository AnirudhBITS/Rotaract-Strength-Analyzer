const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
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
