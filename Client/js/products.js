function fetchProduct(productId) {
    fetch(`http://127.0.0.1:8080/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-desc').textContent = product.desc;
            document.getElementById('product-price').textContent = `$${product.basePrice}`;
        })
        .catch(error => console.error('Erro ao buscar os detalhes do produto:', error));
}

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
fetchProduct(productId);