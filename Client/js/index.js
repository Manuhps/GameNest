document.addEventListener('DOMContentLoaded', function () {
    // Check user's login status
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Hide login button
        const loginButton = document.getElementById('loginButton');
        if (loginButton) loginButton.style.display = 'none';
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
        // Show profile icon
        const profileIcon = document.getElementById('profileIcon');
        if (profileIcon) profileIcon.style.display = 'block';

        // Show logout button
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) logoutButton.style.display = 'block';
    }

let page = 1;
const container = document.querySelector('.row.gx-4.gx-lg-5.row-cols-2.row-cols-md-3.row-cols-xl-4.justify-content-center');

function fetchProducts(page, limit = 12) { // Add limit parameter with a default value of 12
    const offset = (page - 1) * limit;

    fetch(`http://127.0.0.1:8080/products?offset=${offset}&limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.data) {
                const products = data.data.slice(0, limit); // Limit the number of products to 'limit'
                let productCards = '';
                products.forEach(product => {
                    productCards += `
                        <div class="col mb-5">
                            <div class="card h-100">
                                <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Popular</div>
                                <img class="card-img-top" src="${product.img}" alt="${product.name}" />
                                <div class="card-body p-4">
                                    <div class="text-center">
                                        <h5 class="fw-bolder">${product.name}</h5>
                                        <span id="sale-price">${product.curPrice}</span>
                                         <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="./html/products.html?id=${product.productID}">View options</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                container.innerHTML = productCards;

                // Check if pagination data exists
                if (data.pagination) {
                    const { totalPages, currentPage } = data.pagination;

                    let paginationLinks = '';
                    for (let i = 1; i <= totalPages; i++) {
                        // Add 'active' class to the current page link
                        const activeClass = i === currentPage ? 'active' : '';
                        paginationLinks += `<a href="?page=${i}" class="${activeClass}">${i}</a>`;
                    }

                    // Add pagination links to the DOM
                    document.querySelector('#paginationContainer').innerHTML = paginationLinks;
                }
            }
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
}

document.querySelector('#nextPage').addEventListener('click', () => {
    page++;
    fetchProducts(page);
});

document.querySelector('#prevPage').addEventListener('click', () => {
    if (page > 1) {
        page--;
        fetchProducts(page);
    }
});

fetchProducts(page, 12);
});