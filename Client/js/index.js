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

const container = document.querySelector('.row.gx-4.gx-lg-5.row-cols-2.row-cols-md-3.row-cols-xl-4.justify-content-center');

fetch('http://127.0.0.1:8080/products')
    .then(response => response.json())
    .then(data => {
        const products = data.products;
        let productCards = '';
        products.forEach(product => {
            productCards +=  `
                <div class="col mb-5">
                    <div class="card h-100">
                        <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Popular</div>
                        <img class="card-img-top" src="${product.img}" alt="${product.name}" />
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${product.name}</h5>
                                <div class="d-flex justify-content-center small text-warning mb-2">
                                    <div class="bi-star-fill"></div>
                                    <div class="bi-star-fill"></div>
                                    <div class="bi-star-fill"></div>
                                    <div class="bi-star-fill"></div>
                                    <div class="bi-star-fill"></div>
                                </div>
                                <span class="text-muted text-decoration-line-through">${product.basePrice}</span>
                                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="html/products.html?id=${product.productID}">View options</a></div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = productCards;
    })
    .catch(error => console.error('Erro ao buscar produtos:', error));

    