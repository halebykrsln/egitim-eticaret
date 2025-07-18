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
    name,
    subcategories: []
  };

  categories.push(newCategory);
  writeJSON('categories.json', categories);
  res.json({ success: true, category: newCategory });
};

const addSubcategory = (req, res) => {
  const parentId = parseInt(req.params.id);
  const { name, count } = req.body;

  if (!parentId || !name) return res.status(400).json({ error: "Ana kategori ve alt kategori adı zorunlu." });

  const categories = readJSON('categories.json');
  const parentCategory = categories.find(c => c.id === parentId);
  if (!parentCategory) return res.status(404).json({ error: "Ana kategori bulunamadı." });

  if (!parentCategory.subcategories) parentCategory.subcategories = [];

  const newSubcategory = {
    id: Date.now(),
    name,
    count: count || 0
  };

  parentCategory.subcategories.push(newSubcategory);
  writeJSON('categories.json', categories);
  res.json({ success: true, subcategory: newSubcategory });
};

module.exports = { getCategories, addCategory, addSubcategory };
