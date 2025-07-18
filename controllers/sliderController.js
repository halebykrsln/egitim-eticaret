const { readJSON, writeJSON } = require('../utils/jsonUtils');

const getSliders = (req, res) => {
  const sliders = readJSON('sliders.json');
  res.json(sliders);
};

const saveSliders = (req, res) => {
  const { red, green } = req.body;
  if (!red || !green) {
    return res.status(400).json({ error: "Her iki slider başlığı zorunludur." });
  }

  const sliders = { red, green };
  writeJSON('sliders.json', sliders);
  res.json({ success: true });
};

module.exports = { getSliders, saveSliders };
