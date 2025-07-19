const { readJSON, writeJSON } = require('../utils/jsonUtils');

const getSliders = (req, res) => {
  const sliders = readJSON('sliders.json');
  res.json(sliders);
};

const saveSliders = (req, res) => {
  // İstek gövdesinden doğrudan 'red' ve 'green' anahtarlarını kullanın
  const { red, green } = req.body; // redSliders ve greenSliders yerine değiştirildi

  if (!Array.isArray(red) || !Array.isArray(green)) { // 'red' ve 'green' kontrolü
    return res.status(400).json({ error: "Slider verileri dizi olmalı." });
  }

  const sliders = { red, green }; // 'red' ve 'green' anahtarlarıyla kaydedin
  writeJSON('sliders.json', sliders);
  res.json({ success: true });
};

module.exports = { getSliders, saveSliders };