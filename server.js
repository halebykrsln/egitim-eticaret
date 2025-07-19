const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser'); // Gerekli değil ama kalsın

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // JSON formatındaki istekleri ayrıştırır
app.use(express.urlencoded({ extended: true })); // URL kodlamalı istekleri ayrıştırır

// Statik dosyaları serve etmek için kesinlikle path ile tam yol verilmeli
// 'public' klasöründeki dosyalar tarayıcıdan erişilebilir olur (örn: /images/resim.jpg)
app.use(express.static(path.join(__dirname, 'public')));

// Route'lar
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const sliderRoutes = require('./routes/sliderRoutes');
app.use('/api/sliders', sliderRoutes);

// Test sayfası (root)
app.get('/', (req, res) => {
  res.send('ATANIYORUM-HOCAM API çalışıyor');
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Sunucu başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
  console.log(`Public klasörü: ${path.join(__dirname, 'public')}`); // Ek bilgi
});