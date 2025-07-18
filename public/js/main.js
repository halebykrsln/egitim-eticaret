document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/products') // Backend route
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById('product-list');
      container.innerHTML = ''; // Temizle

      // Ürün sayısını HTML'e yaz
      const countEl = document.getElementById('product-count');
      if (countEl) {
        countEl.innerText = `${products.length} ürün`;
      }

      products.forEach(product => {
        const imageUrl = product.images.length > 0 
          ? product.images[0] 
          : '/images/default.jpg'; // varsayılan görsel

        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';

        card.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${imageUrl}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
              <h6 class="card-title">${product.title}</h6>
              <p class="card-text">${product.description}</p>
              <p class="card-text">
                <span class="text-decoration-line-through text-muted me-2">₺${product.oldPrice}</span>
                <span class="fw-bold text-success">₺${product.newPrice}</span>
              </p>
              <button class="btn btn-primary w-100">SEPETE EKLE</button>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Ürünler yüklenemedi:", err);
    });
});
