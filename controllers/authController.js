const bcrypt = require('bcrypt');
const { readUsers, writeUsers } = require('../utils/jsonUtils');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const users = readUsers();

  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword
  };

  users.push(newUser);
  writeUsers(users);

  res.json({ success: true, message: 'Kayıt başarılı.' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Şifre yanlış.' });
  }

  res.json({ success: true, message: 'Giriş başarılı.', user: { id: user.id, name: user.name, email: user.email } });
};

module.exports = { register, login };
