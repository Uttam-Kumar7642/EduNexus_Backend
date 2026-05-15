const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    message: { type: String },
    source: { type: String, default: 'website' },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'lost'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
