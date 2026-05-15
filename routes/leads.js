const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

router.post('/', async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ message: 'Inquiry submitted. We will contact you soon!', lead });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
