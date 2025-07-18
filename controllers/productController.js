const { readJSON, writeJSON } = require('../utils/jsonUtils');

const getProducts = (req, res) => {
  const products = readJSON('products.json');
  res.json(products);
};

const addProduct = (req, res) => {
  const { title, description, oldPrice, newPrice, images, categoryId } = req.body;

  if (!title || !newPrice || !categoryId) {
    return res.status(400).json({ error: "Zorunlu alanlar eksik." });
  }

  const products = readJSON('products.json');

  const newProduct = {
    id: Date.now(),
    title,
    description,
    oldPrice: Number(oldPrice) || null,
    newPrice: Number(newPrice),
    images: images || [],
    categoryId,
    createdAt: new Date()
  };

  products.push(newProduct);
  writeJSON('products.json', products);

  res.json({ success: true, product: newProduct });
};

module.exports = { getProducts, addProduct };
