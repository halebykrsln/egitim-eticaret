const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs-extra');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'gizli-anahtar',
  resave: false,
  saveUninitialized: true
}));

// JSON kullanıcı işlemleri
async function readUsers() {
  const exists = await fs.pathExists(USERS_FILE);
  if (!exists) await fs.writeJson(USERS_FILE, []);
  return fs.readJson(USERS_FILE);
}
function writeUsers(users) {
  return fs.writeJson(USERS_FILE, users, { spaces: 2 });
}

// === ROUTES ===
// Kategori, Ürün, Slider router'ları
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const sliderRoutes = require('./routes/sliderRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sliders', sliderRoutes);
app.use('/api/users', authRoutes);

// === GİRİŞ & KAYIT HTML SAYFALARI ===
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// === GİRİŞ İŞLEMİ ===
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await readUsers();

  const user = users.find(u => u.email === email);
  if (!user) return res.send('Kullanıcı bulunamadı.');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.send('Şifre hatalı.');

  req.session.user = { email: user.email };
  res.redirect('/admin');
});

// === KAYIT İŞLEMİ ===
app.post('/register', async (req, res) => {
  const { email, password, password2 } = req.body;
  if (password !== password2) return res.send('Şifreler uyuşmuyor.');

  const users = await readUsers();
  if (users.find(u => u.email === email)) {
    return res.send('Bu email zaten kayıtlı.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });
  await writeUsers(users);

  res.redirect('/login');
});

// === YETKİLİ SAYFA: Admin Panel ===
app.get('/admin', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// === ÇIKIŞ ===
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});


// === ROOT ===
app.get('/', (req, res) => {
  res.send('ATANIYORUM-HOCAM API çalışıyor');
});

// === SUNUCU BAŞLAT ===
app.listen(PORT, () => {
  console.log(`✅ Sunucu: http://localhost:${PORT}`);
  console.log(`📂 Statik klasör: ${path.join(__dirname, 'public')}`);
});
