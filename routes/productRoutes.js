const express = require('express');
const router = express.Router();

const { upload, getProducts, addProduct, deleteProduct, updateProduct } = require('../controllers/productController');

// 🔹 GET → Tüm ürünleri getir
router.get('/', getProducts);

// 🔸 POST → Yeni ürün ekle (görselli)
router.post('/', upload.single('image'), addProduct);

// 🔻 DELETE → Ürün sil
router.delete('/:id', deleteProduct);

// 🔁 PUT → Ürün güncelle
router.put('/:id', updateProduct);

module.exports = router;
