require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    // Delete existing admin if any
    await User.deleteOne({ email: 'admin@edunexus.com' });

    const password = await bcrypt.hash('Admin@123', 12);
    await User.create({
      name: 'Super Admin',
      email: 'admin@edunexus.com',
      password,
      role: 'admin',
      isVerified: true,
      phone: '9999999999',
    });

    console.log('');
    console.log('✅ Admin account created successfully!');
    console.log('─────────────────────────────────────');
    console.log('  Email    : admin@edunexus.com');
    console.log('  Password : Admin@123');
    console.log('  Role     : admin');
    console.log('─────────────────────────────────────');
    console.log('');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
