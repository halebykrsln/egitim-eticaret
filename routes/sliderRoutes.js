const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const sliderPath = path.join(__dirname, '../data/sliders.json');

router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(sliderPath, 'utf-8');
    const sliders = JSON.parse(data);
    res.json(sliders);
  } catch (err) {
    console.error('Slider verisi alınamadı:', err);
    res.status(500).json({ error: 'Slider verisi alınamadı' });
  }
});

module.exports = router;
