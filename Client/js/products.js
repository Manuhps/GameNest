document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('profileIcon').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'block';
    }
});

const productSection = document.querySelector('.row.gx-4.gx-lg-5.align-items-center');

// Suponha que você tenha o ID do produto
let productID = window.location.search.split("=")[1]; // Pega o ID do produto da URL

fetch(`http://127.0.0.1:8080/products/${productID}`)
    .then(response => response.json())
    .then(data => {
        const product = data.product; // Supondo que a API retorna o produto em 'product'
        productSection.innerHTML = `
            <div class="col-md-6"><img class="card-img-top mb-5 mb-md-0" id="product-image" src="${product.img}" alt="${product.name}" /></div>
            <div class="col-md-6">
                <h1 class="display-5 fw-bolder" id="product-name">${product.name}</h1>
                <div class="fs-5 mb-5">
                    <span class="text-decoration-line-through" id="product-price">${product.basePrice}</span>
                    <span id="sale-price">$40.00</span>
                </div>
                <p class="lead" id="product-desc">${product.desc}</p>
                <div class="d-flex">
                    <button class="btn btn-outline-dark flex-shrink-0" type="button">
                        <i class="bi-cart-fill me-1"></i>
                        Add to cart
                    </button>
                </div>
            </div>
        `;
    })
    .catch(error => console.error('Erro ao buscar o produto:', error));