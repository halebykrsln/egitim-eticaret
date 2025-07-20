const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '../data/sepet.json');

// Sepeti getir (GET /api/sepet)
router.get('/', (req, res) => {
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Sepet verisi okunamadı' });
    res.json(JSON.parse(data || '[]'));
  });
});

// Sepeti güncelle (PUT /api/sepet)
router.put('/', (req, res) => {
  const yeniSepet = req.body;
  fs.writeFile(filePath, JSON.stringify(yeniSepet, null, 2), (err) => {
    if (err) return res.status(500).json({ error: 'Sepet verisi yazılamadı' });
    res.json({ success: true });
  });
});

module.exports = router;
