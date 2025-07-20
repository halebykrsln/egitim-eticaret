const fs = require('fs');
const path = require('path');

const readJSON = (filename) => {
  try {
    // JSON dosyalarınızın nerede olduğuna göre 'data' yolunu ayarlayın
    const filePath = path.join(__dirname, '..', 'data', filename); 
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') { // Dosya bulunamadı hatası
      console.warn(`Uyarı: ${filename} bulunamadı. Boş dizi/nesne döndürülüyor.`);
      return []; // Veya dosyanın beklenen varsayılanına göre {} döndürün
    }
    console.error(`${filename} okunurken hata oluştu:`, error);
    return []; // Veya uygun şekilde ele alın
  }
};

const writeJSON = (filename, data) => {
  try {
    // JSON dosyalarınızın nerede olduğuna göre 'data' yolunu ayarlayın
    const filePath = path.join(__dirname, '..', 'data', filename); 
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`${filename} yazılırken hata oluştu:`, error);
  }
};

module.exports = { readJSON, writeJSON };