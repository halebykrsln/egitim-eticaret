const express = require('express');
const router = express.Router();
const { readJSON, writeJSON } = require('../utils/jsonUtils');

console.log("✅ categoryRoutes dosyası yüklendi");

router.get('/test', (req, res) => {
  res.send("✅ /api/categories/test çalıştı!");
});

// ALT KATEGORİ EKLEME
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

// ✅ ANA KATEGORİ SİLME
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  let categories = readJSON('categories.json');
  const index = categories.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Kategori bulunamadı' });
  }

  categories.splice(index, 1); // Silme işlemi
  writeJSON('categories.json', categories);

  res.json({ success: true, message: 'Kategori silindi' });
});

// CONTROLLER'LAR
const { getCategories, addCategory } = require('../controllers/categoryController');
router.get('/', getCategories);
router.post('/', addCategory);

module.exports = router;
