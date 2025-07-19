const fs = require('fs');
const path = require('path');
const multer = require('multer');

// JSON dosyalarının bulunduğu dizin yolu
const dataPath = path.join(__dirname, '../data');

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/images'); // Görsellerin kaydedileceği klasör
    // Klasör yoksa oluştur
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB dosya boyutu sınırı (isteğe bağlı)
  fileFilter: (req, file, cb) => {
    // Sadece resim dosyalarına izin ver
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları (jpeg, jpg, png, gif) yüklenebilir!'));
    }
  }
});

// JSON dosyası okuma fonksiyonu
function readJSON(filename) {
  const fullPath = path.join(dataPath, filename);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Uyarı: ${filename} dosyası bulunamadı. Boş bir dizi oluşturuluyor.`);
    return [];
  }
  try {
    const data = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(data);
  } catch (parseError) {
    console.error(`Hata: ${filename} dosyası okunurken veya ayrıştırılırken hata:`, parseError);
    return []; // Hata durumunda boş dizi döndür
  }
}

// JSON dosyasına yazma fonksiyonu
function writeJSON(filename, data) {
  const fullPath = path.join(dataPath, filename);
  try {
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    console.log(`${filename} dosyasına başarıyla yazıldı.`);
  } catch (writeError) {
    console.error(`Hata: ${filename} dosyasına yazılırken hata:`, writeError);
  }
}

// Ürün ekleme (çoklu görsel destekli)
const addProduct = (req, res) => {
  console.log('addProduct fonksiyonuna girildi.');
  console.log('req.body (form verileri):', req.body);
  console.log('req.files (yüklenen dosyalar):', req.files); // Multer tarafından eklenir

  try {
    const products = readJSON('products.json');

    const newId = Date.now();

    const images = (req.files && req.files.length)
      ? req.files.map(file => `/images/${file.filename}`)
      : [];

    console.log('Oluşturulan resim yolları:', images);

    // Frontend'den gelen string değerleri doğru tiplere çevirme
    const newProduct = {
      id: newId,
      title: req.body.title,
      description: req.body.description || '', // Açıklama boşsa boş string olsun
      oldPrice: Number(req.body.oldPrice) || 0, // Sayıya çevir, NaN ise 0
      newPrice: Number(req.body.newPrice) || 0, // Sayıya çevir, NaN ise 0
      images: images,
      categoryId: req.body.categoryId,
      createdAt: new Date().toISOString()
    };

    // Zorunlu alan kontrolü (frontend'de de var ama backend'de de olması sağlamlık sağlar)
    if (!newProduct.title || !newProduct.newPrice || !newProduct.categoryId) {
      return res.status(400).json({ success: false, error: 'Başlık, Yeni Fiyat ve Kategori zorunludur.' });
    }

    products.push(newProduct);
    writeJSON('products.json', products);

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('addProduct fonksiyonunda hata:', error);
    res.status(500).json({ success: false, error: 'Ürün eklenirken sunucu hatası oluştu.', message: error.message });
  }
};

// Tüm ürünleri getir
const getProducts = (req, res) => {
  try {
    const products = readJSON('products.json');
    res.json(products);
  } catch (error) {
    console.error('getProducts fonksiyonunda hata:', error);
    res.status(500).json({ success: false, error: 'Ürünler getirilirken hata oluştu.', message: error.message });
  }
};

// Ürün sil
const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  try {
    let products = readJSON('products.json');
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı.' });
    }

    writeJSON('products.json', products);
    res.json({ success: true });
  } catch (error) {
    console.error('deleteProduct fonksiyonunda hata:', error);
    res.status(500).json({ success: false, error: 'Ürün silinirken hata oluştu.', message: error.message });
  }
};

// Ürün güncelle
const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  try {
    let products = readJSON('products.json');
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Ürün bulunamadı.' });
    }

    const existing = products[index];
    const { title, description, oldPrice, newPrice, images, categoryId } = req.body; // images burada string[] olarak beklenir

    const updated = {
      ...existing,
      title: title || existing.title,
      description: description !== undefined ? description : existing.description, // Boş string de kabul edilsin
      oldPrice: (oldPrice !== undefined && oldPrice !== null) ? Number(oldPrice) : existing.oldPrice,
      newPrice: (newPrice !== undefined && newPrice !== null) ? Number(newPrice) : existing.newPrice,
      images: images || existing.images, // Frontend'den images gelmezse mevcutları koru
      categoryId: categoryId || existing.categoryId,
      updatedAt: new Date().toISOString()
    };

    // Güncellenen verilerde NaN kontrolü
    if (isNaN(updated.newPrice)) {
      return res.status(400).json({ success: false, error: 'Geçersiz yeni fiyat değeri.' });
    }

    products[index] = updated;
    writeJSON('products.json', products);

    res.json({ success: true, product: updated });
  } catch (error) {
    console.error('updateProduct fonksiyonunda hata:', error);
    res.status(500).json({ success: false, error: 'Ürün güncellenirken hata oluştu.', message: error.message });
  }
};

// Export
module.exports = {
  upload,
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct
};