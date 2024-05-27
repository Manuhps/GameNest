function fetchProduct() {
    fetch(`http://127.0.0.1/products`)
        .then(response => response.json())
        .catch(error => console.error('Erro ao buscar os detalhes do produto:', error));
}

fetchProduct();