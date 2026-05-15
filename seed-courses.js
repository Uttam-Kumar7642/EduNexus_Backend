require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
console.log('Connecting to:', uri);

mongoose.connect(uri).then(async () => {
  console.log('✅ Connected to MongoDB');

  // Define schema inline to avoid any import issues
  const courseSchema = new mongoose.Schema({
    title: String, slug: { type: String, unique: true, sparse: true },
    description: String, shortDescription: String,
    instructorName: String, category: String, level: String,
    price: Number, originalPrice: Number, isFree: Boolean,
    thumbnail: String, tags: [String], rating: Number,
    totalRatings: Number, totalStudents: Number,
    isPublished: Boolean, isFeatured: Boolean, certificate: Boolean,
    whatYouLearn: [String], requirements: [String],
  }, { timestamps: true });

  const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

  await Course.deleteMany({});
  console.log('🗑️  Cleared existing courses');

  const courses = [
    { title: 'Complete React & Next.js Bootcamp', category: 'Technology', level: 'Beginner', price: 1999, originalPrice: 4999, instructorName: 'John Smith', description: 'Master React and Next.js from scratch.', rating: 4.8, totalRatings: 2341, totalStudents: 12500, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Python for Data Science & ML', category: 'Technology', level: 'Intermediate', price: 2499, originalPrice: 5999, instructorName: 'Sarah Johnson', description: 'Learn Python, Pandas, NumPy and build ML models.', rating: 4.9, totalRatings: 3102, totalStudents: 18200, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Full Stack MERN Development', category: 'Technology', level: 'Intermediate', price: 2999, originalPrice: 6999, instructorName: 'Mike Chen', description: 'Build full stack apps with MongoDB, Express, React, Node.js.', rating: 4.7, totalRatings: 1876, totalStudents: 9800, isPublished: true, certificate: true },
    { title: 'AWS Cloud Practitioner Certification', category: 'Technology', level: 'Beginner', price: 1799, originalPrice: 3999, instructorName: 'David Lee', description: 'Pass the AWS Cloud Practitioner exam.', rating: 4.6, totalRatings: 987, totalStudents: 5400, isPublished: true, certificate: true },
    { title: 'DevOps with Docker & Kubernetes', category: 'Technology', level: 'Advanced', price: 3499, originalPrice: 7999, instructorName: 'Alex Kumar', description: 'Master containerization and CI/CD pipelines.', rating: 4.8, totalRatings: 1234, totalStudents: 7600, isPublished: true, certificate: true },
    { title: 'JavaScript - The Complete Guide', category: 'Technology', level: 'Beginner', price: 1499, originalPrice: 3499, instructorName: 'Emma Wilson', description: 'Master JavaScript from basics to advanced ES6+.', rating: 4.7, totalRatings: 4521, totalStudents: 22000, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Flutter & Dart Mobile Development', category: 'Technology', level: 'Intermediate', price: 2199, originalPrice: 4999, instructorName: 'Raj Patel', description: 'Build iOS and Android apps with Flutter.', rating: 4.6, totalRatings: 876, totalStudents: 4300, isPublished: true, certificate: true },
    { title: 'Machine Learning A-Z', category: 'Technology', level: 'Advanced', price: 2999, originalPrice: 6999, instructorName: 'Dr. Priya Sharma', description: 'Complete ML covering supervised and unsupervised learning.', rating: 4.9, totalRatings: 5432, totalStudents: 28000, isPublished: true, isFeatured: true, certificate: true },
    { title: 'MBA Essentials: Business Strategy', category: 'Business', level: 'Intermediate', price: 2499, originalPrice: 5999, instructorName: 'Prof. Rahul Gupta', description: 'Core MBA concepts including strategy and finance.', rating: 4.7, totalRatings: 1543, totalStudents: 8900, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Entrepreneurship: Start Your Business', category: 'Business', level: 'Beginner', price: 1299, originalPrice: 2999, instructorName: 'Vikram Singh', description: 'From idea to launch — start your business.', rating: 4.6, totalRatings: 987, totalStudents: 5600, isPublished: true, certificate: true },
    { title: 'Financial Accounting & Reporting', category: 'Business', level: 'Beginner', price: 1499, originalPrice: 3499, instructorName: 'CA Ananya Patel', description: 'Master financial statements and accounting.', rating: 4.5, totalRatings: 765, totalStudents: 4200, isPublished: true, certificate: true },
    { title: 'Project Management Professional PMP', category: 'Business', level: 'Intermediate', price: 2999, originalPrice: 6999, instructorName: 'Sneha Gupta', description: 'Prepare for PMP certification.', rating: 4.8, totalRatings: 1234, totalStudents: 7800, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Leadership & Management Skills', category: 'Business', level: 'All Levels', price: 999, originalPrice: 2499, instructorName: 'Dr. Arun Mehta', description: 'Develop essential leadership skills.', rating: 4.6, totalRatings: 2109, totalStudents: 11000, isPublished: true, certificate: true },
    { title: 'Business Analytics with Power BI', category: 'Business', level: 'Intermediate', price: 1799, originalPrice: 3999, instructorName: 'Riya Shah', description: 'Analyze business data and create dashboards.', rating: 4.7, totalRatings: 876, totalStudents: 5100, isPublished: true, certificate: true },
    { title: 'UI/UX Design Masterclass with Figma', category: 'Design', level: 'Beginner', price: 1799, originalPrice: 3999, instructorName: 'Lisa Chen', description: 'Design beautiful interfaces using Figma.', rating: 4.8, totalRatings: 2876, totalStudents: 14500, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Graphic Design Bootcamp', category: 'Design', level: 'Beginner', price: 1499, originalPrice: 3499, instructorName: 'Tom Wilson', description: 'Master Photoshop and Illustrator.', rating: 4.7, totalRatings: 1654, totalStudents: 9200, isPublished: true, certificate: true },
    { title: 'Motion Graphics with After Effects', category: 'Design', level: 'Intermediate', price: 2199, originalPrice: 4999, instructorName: 'Kavya Nair', description: 'Create stunning animations with After Effects.', rating: 4.6, totalRatings: 876, totalStudents: 4800, isPublished: true, certificate: true },
    { title: '3D Design with Blender', category: 'Design', level: 'Intermediate', price: 1999, originalPrice: 4499, instructorName: 'Arjun Das', description: 'Create 3D models and renders using Blender.', rating: 4.7, totalRatings: 1123, totalStudents: 6300, isPublished: true, certificate: true },
    { title: 'Brand Identity Design', category: 'Design', level: 'All Levels', price: 1299, originalPrice: 2999, instructorName: 'Priya Menon', description: 'Design logos and brand identities.', rating: 4.5, totalRatings: 654, totalStudents: 3800, isPublished: true, certificate: true },
    { title: 'Complete Digital Marketing Course', category: 'Marketing', level: 'Beginner', price: 1499, originalPrice: 3499, instructorName: 'Rohit Verma', description: 'SEO, SEM, Social Media and Email Marketing.', rating: 4.7, totalRatings: 3241, totalStudents: 16800, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Social Media Marketing Mastery', category: 'Marketing', level: 'Beginner', price: 999, originalPrice: 2499, instructorName: 'Neha Kapoor', description: 'Grow brands on Instagram, Facebook and YouTube.', rating: 4.6, totalRatings: 1876, totalStudents: 10200, isPublished: true, certificate: true },
    { title: 'SEO & Content Marketing Strategy', category: 'Marketing', level: 'Intermediate', price: 1799, originalPrice: 3999, instructorName: 'Amit Sharma', description: 'Rank on Google with content marketing.', rating: 4.8, totalRatings: 1432, totalStudents: 8700, isPublished: true, certificate: true },
    { title: 'Google Ads & Meta Ads Mastery', category: 'Marketing', level: 'Intermediate', price: 2199, originalPrice: 4999, instructorName: 'Sonia Mehta', description: 'Run profitable ad campaigns on Google and Facebook.', rating: 4.7, totalRatings: 987, totalStudents: 5600, isPublished: true, certificate: true },
    { title: 'Stock Market & Trading Fundamentals', category: 'Finance', level: 'Beginner', price: 1299, originalPrice: 2999, instructorName: 'CA Suresh Kumar', description: 'Learn stock market basics and trading strategies.', rating: 4.7, totalRatings: 4321, totalStudents: 21000, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Personal Finance & Wealth Management', category: 'Finance', level: 'Beginner', price: 799, originalPrice: 1999, instructorName: 'Deepa Rao', description: 'Master budgeting, investing and wealth building.', rating: 4.8, totalRatings: 5432, totalStudents: 27000, isPublished: true, certificate: true },
    { title: 'Cryptocurrency & Blockchain', category: 'Finance', level: 'Beginner', price: 1499, originalPrice: 3499, instructorName: 'Kiran Joshi', description: 'Understand blockchain, Bitcoin and DeFi.', rating: 4.5, totalRatings: 2109, totalStudents: 11800, isPublished: true, certificate: true },
    { title: 'Financial Modeling & Valuation', category: 'Finance', level: 'Advanced', price: 2999, originalPrice: 6999, instructorName: 'MBA Anil Kapoor', description: 'Build financial models and DCF valuations.', rating: 4.9, totalRatings: 876, totalStudents: 4900, isPublished: true, certificate: true },
    { title: 'English Communication Mastery', category: 'Language', level: 'All Levels', price: 999, originalPrice: 2499, instructorName: 'Prof. Mary Johnson', description: 'Speak fluent English with confidence.', rating: 4.8, totalRatings: 6543, totalStudents: 32000, isPublished: true, isFeatured: true, certificate: true },
    { title: 'Spanish for Beginners', category: 'Language', level: 'Beginner', price: 1299, originalPrice: 2999, instructorName: 'Carlos Rodriguez', description: 'Learn Spanish from scratch.', rating: 4.7, totalRatings: 1234, totalStudents: 7200, isPublished: true, certificate: true },
    { title: 'Business English & Professional Writing', category: 'Language', level: 'Intermediate', price: 1499, originalPrice: 3499, instructorName: 'Dr. Anita Roy', description: 'Master business emails and presentations.', rating: 4.6, totalRatings: 987, totalStudents: 5800, isPublished: true, certificate: true },
    { title: 'Japanese Language N5 to N3', category: 'Language', level: 'Beginner', price: 1799, originalPrice: 3999, instructorName: 'Yuki Tanaka', description: 'Learn Japanese from beginner to intermediate.', rating: 4.7, totalRatings: 654, totalStudents: 3900, isPublished: true, certificate: true },
    { title: 'French Language Complete Course', category: 'Language', level: 'Beginner', price: 1299, originalPrice: 2999, instructorName: 'Sophie Martin', description: 'Master French from beginner to conversational.', rating: 4.6, totalRatings: 543, totalStudents: 3200, isPublished: true, certificate: true },
  ];

  const withSlugs = courses.map((c, i) => ({
    ...c,
    slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now() + i,
    whatYouLearn: ['Master core concepts', 'Build real projects', 'Industry best practices', 'Get certified'],
    requirements: ['Basic computer knowledge', 'Willingness to learn'],
    shortDescription: c.description,
  }));

  const result = await Course.insertMany(withSlugs);
  console.log(`✅ ${result.length} courses seeded successfully!`);

  // Verify
  const count = await Course.countDocuments();
  console.log(`📊 Total courses in DB: ${count}`);

  await mongoose.disconnect();
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
