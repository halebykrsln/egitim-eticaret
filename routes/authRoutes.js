const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

// Kullanıcı verisinin bulunduğu dosya
const usersPath = path.join(__dirname, '../data/users.json');

// 🔐 Şifre sıfırlama endpointi
router.post('/reset-password', (req, res) => {
  const { token, password, confirmPassword } = req.body;

  // Temel kontroller
  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Lütfen tüm alanları doldurun.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Şifreler eşleşmiyor.' });
  }

  // Kullanıcıları yükle
  let users = [];
  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  }

  // Token ve süresini kontrol et
  const user = users.find(
    u => u.resetToken === token && u.resetTokenExpires && u.resetTokenExpires > Date.now()
  );

  if (!user) {
    return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş bağlantı.' });
  }

  // Şifreyi hashle
  const hashedPassword = bcrypt.hashSync(password, 10);
  user.password = hashedPassword;

  // Token'i temizle
  delete user.resetToken;
  delete user.resetTokenExpires;

  // Güncellenmiş kullanıcıları kaydet
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');

  return res.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });
});

module.exports = router;