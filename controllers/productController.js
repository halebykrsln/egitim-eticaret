const { readJSON, writeJSON } = require('../utils/jsonUtils');

// TÜM ÜRÜNLERİ GETİR
const getProducts = (req, res) => {
  const products = readJSON('products.json');
  res.json(products);
};

// YENİ ÜRÜN EKLE
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

// ÜRÜN SİL
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  let products = readJSON('products.json');
  const exists = products.find(p => p.id === id);

  if (!exists) return res.status(404).json({ error: 'Ürün bulunamadı.' });

  products = products.filter(p => p.id !== id);
  writeJSON('products.json', products);

  res.json({ success: true });
};
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  let products = readJSON('products.json');
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Ürün bulunamadı.' });
  }

  const existing = products[index];
  const { title, description, oldPrice, newPrice, images, categoryId } = req.body;

  const updated = {
    ...existing,
    title: title || existing.title,
    description: description || existing.description,
    oldPrice: Number(oldPrice) || existing.oldPrice,
    newPrice: Number(newPrice) || existing.newPrice,
    images: images || existing.images,
    categoryId: categoryId || existing.categoryId,
    updatedAt: new Date()
  };

  products[index] = updated;
  writeJSON('products.json', products);

  res.json({ success: true, product: updated });
};

// TÜM FONKSİYONLARI EXPORT ET
module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct
};
