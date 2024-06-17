document.addEventListener('DOMContentLoaded', function () {
    // Verifique o estado de login do usuário
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Oculta o botão de login
        const loginButton = document.getElementById('loginButton');
        if (loginButton) loginButton.style.display = 'none';

        // Mostra o ícone de perfil
        const profileIcon = document.getElementById('profileIcon');
        if (profileIcon) profileIcon.style.display = 'block';

        // Mostra o botão de logout
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) logoutButton.style.display = 'block';
    }
});


// Suponha que você tenha o ID do produto
let productID = window.location.search.split("=")[1]; // Pega o ID do produto da URL

fetch(`http://127.0.0.1:8080/products/${productID}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.product);
        const product = data.product;

        const productSection = document.querySelector('.row.gx-4.gx-lg-5.align-items-center');

        let priceSection = '';
        if (product.basePrice !== product.curPrice) {
            priceSection = `
                <div class="fs-5 mb-5">
                    <span class="text-decoration-line-through" id="product-price">${product.basePrice}</span>
                    <span id="sale-price">${product.curPrice}</span>
                </div>
            `;
        } else {
            priceSection = `
                <div class="fs-5 mb-5">
                    <span id="product-price">${product.basePrice}</span>
                </div>
            `;
        }

        productSection.innerHTML = `
            <div class="col-md-6"><img class="card-img-top mb-5 mb-md-0" id="product-image" src="${product.img}" alt="${product.name}" /></div>
            <div class="col-md-6">
                <h1 class="display-5 fw-bolder" id="product-name">${product.name}</h1>
                ${priceSection}
                <p class="lead" id="product-desc">${product.desc}</p>
                <div class="d-flex">
                    <button class="btn btn-outline-dark flex-shrink-0 add-to-cart-button" type="button" onclick="addToCart(${JSON.stringify(product)})">
                        <i class="bi-cart-fill me-1"></i>
                        Add to cart
                    </button>
                </div>
            </div>
        `;
        document.querySelector('.add-to-cart-button').addEventListener('click', () => addToCart(product));
    })
    .catch(error => console.error('Erro ao buscar o produto:', error));