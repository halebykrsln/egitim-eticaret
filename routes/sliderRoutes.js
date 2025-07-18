const express = require('express');
const router = express.Router();
const { getSliders, saveSliders } = require('../controllers/sliderController');

router.get('/', getSliders);      // Slider verilerini getir
router.post('/', saveSliders);    // Slider verilerini kaydet

module.exports = router;
