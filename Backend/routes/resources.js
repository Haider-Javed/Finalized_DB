const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const itemSchema = new mongoose.Schema({
  name: String,
  desc: String,
  url: String,
});

const resourceCategorySchema = new mongoose.Schema({
  id:     String,
  title:  String,
  icon:   String,
  accent: String,
  items:  [itemSchema],
});

const ResourceCategory = mongoose.model('ResourceCategory', resourceCategorySchema);

router.get('/', async (req, res) => {
  try {
    const categories = await ResourceCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;