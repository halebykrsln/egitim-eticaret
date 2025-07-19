const express = require('express');
const router = express.Router();

const { upload, getProducts, addProduct, deleteProduct, updateProduct } = require('../controllers/productController');

// 🔹 GET → Tüm ürünleri getir
router.get('/', getProducts);

// Çoklu dosya yükleme ve ürün ekleme
// 'images' alanı Multer ayarındaki `upload.array('images', 5)` ile eşleşmeli.
router.post('/', upload.array('images', 5), addProduct);

// 🔻 DELETE → Ürün sil
router.delete('/:id', deleteProduct);

// 🔁 PUT → Ürün güncelle
router.put('/:id', updateProduct);

module.exports = router;