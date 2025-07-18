const express = require('express');
const router = express.Router();

console.log("✅ categoryRoutes dosyası yüklendi");

router.get('/test', (req, res) => {
  res.send("✅ /api/categories/test çalıştı!");
});

const { getCategories, addCategory } = require('../controllers/categoryController');

router.get('/', getCategories);
router.post('/', addCategory);

module.exports = router;
