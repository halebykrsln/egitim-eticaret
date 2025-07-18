const { readJSON, writeJSON } = require('../utils/jsonUtils');

const getCategories = (req, res) => {
  const categories = readJSON('categories.json');
  res.json(categories);
};

const addCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Kategori adı zorunlu." });

  const categories = readJSON('categories.json');
  const newCategory = {
    id: Date.now(),
    name
  };
console.log("✅ getCategories fonksiyonu yüklendi");

  categories.push(newCategory);
  writeJSON('categories.json', categories);
  res.json({ success: true, category: newCategory });
};

module.exports = { getCategories, addCategory };
