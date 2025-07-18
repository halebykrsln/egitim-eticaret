const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/jsonUtils');  // EKLENDİ

console.log("✅ categoryRoutes dosyası yüklendi");

router.get('/test', (req, res) => {
  res.send("✅ /api/categories/test çalıştı!");
});

// Alt kategori ekleme route'u
router.post('/:id/subcategories', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, count } = req.body;

  const categories = readJSON('categories.json');
  const category = categories.find(c => c.id === id);
  if (!category) return res.status(404).json({ error: 'Ana kategori bulunamadı' });

  const newSub = {
    id: Date.now(),
    name,
    count: count || 0
  };

  if (!category.subcategories) category.subcategories = [];
  category.subcategories.push(newSub);

  writeJSON('categories.json', categories);

  res.json({ success: true, subcategory: newSub });
});

// Controller fonksiyonları
const { getCategories, addCategory } = require('../controllers/categoryController');

router.get('/', getCategories);
router.post('/', addCategory);

module.exports = router;
