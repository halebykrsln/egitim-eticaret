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

module.exports = {
  upload,
  addProduct
};
