const fs = require('fs');
const path = require('path');
const multer = require('multer');

const dataPath = path.join(__dirname, '../data/products.json');

// 🔧 Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Görsellerin kaydedileceği yer
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// 🔥 Ürün Ekleme - Görselle birlikte
const addProduct = (req, res) => {
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

    fs.writeFile(dataPath, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Ürün kaydedilemedi' });
      res.status(201).json(newProduct);
    });
  });
};

// TÜM ÜRÜNLERİ GETİR
const getProducts = (req, res) => {
  const products = readJSON('products.json');
  res.json(products);
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

// ÜRÜN GÜNCELLE
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

// EXPORT
module.exports = {
  upload,
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct
};
