const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Görsellerin yükleneceği klasör
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Görseller buraya
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueName}${ext}`);
  }
});
const upload = multer({ storage });

const dataPath = path.join(__dirname, '../data/products.json');

// 🔹 GET → Tüm ürünleri getir
router.get('/', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Ürünler okunamadı' });
    res.json(JSON.parse(data));
  });
});

// 🔸 POST → Yeni ürün ekle (görselli)
router.post('/', upload.single('image'), (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Ürünler okunamadı' });

    const products = JSON.parse(data);
    const newId = Date.now();

    const imagePath = req.file ? `/images/${req.file.filename}` : '';

    const newProduct = {
      id: newId,
      title: req.body.title,
      description: req.body.description,
      oldPrice: Number(req.body.oldPrice),
      newPrice: Number(req.body.newPrice),
      images: imagePath ? [imagePath] : [],
      categoryId: req.body.categoryId,
      createdAt: new Date().toISOString()
    };

    products.push(newProduct);

    fs.writeFile(dataPath, JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Ürün kaydedilemedi' });
      res.status(201).json(newProduct);
    });
  });
});

module.exports = router;
