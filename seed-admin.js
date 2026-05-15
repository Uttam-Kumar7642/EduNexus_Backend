require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) { console.error('❌ No MongoDB URI in .env'); process.exit(1); }

mongoose.connect(uri).then(async () => {
  console.log('✅ Connected to MongoDB');

  const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'student' },
    isVerified: { type: Boolean, default: true },
    enrolledCourses: [], wishlist: [], progress: []
  }, { timestamps: true }));

  const email = 'admin@edunexus.com';
  const password = 'Admin@123';
  const hashed = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email },
    { name: 'Admin', email, password: hashed, role: 'admin', isVerified: true },
    { upsert: true, new: true }
  );

  console.log('✅ Admin ready!');
  console.log('   Email   :', email);
  console.log('   Password:', password);
  await mongoose.disconnect();
  process.exit(0);
}).catch(err => { console.error('❌', err.message); process.exit(1); });
