function fetchProduct(productId) {
    fetch(`http://127.0.0.1:8080/produtos/${productId}`)
        .then(response => response.json())
        .then(produto => {
            document.getElementById('product-name').textContent = produto.name;
            document.getElementById('description').textContent = produto.desc;
            document.getElementById('original-price').textContent = `$${produto.basePrice}`;
            document.getElementById('product-image').src = produto.img;
        })
        .catch(error => console.error('Erro ao buscar os detalhes do produto:', error));
}

// Agora você pode chamar essa função com diferentes IDs de produto
fetchProduct('1');