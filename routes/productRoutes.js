const express = require('express');
const router = express.Router();
const { getProducts, addProduct, deleteProduct,updateProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct); 

module.exports = router;
