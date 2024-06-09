/*document.addEventListener('DOMContentLoaded', function () {
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
*/

const container=document.querySelector('.row.gx-0.gy-2.row-cols-2.row-cols-md-3.row-cols-xl-3.justify-content-center')

const categoryID = window.location.search.split("=")[1]; // Pega o ID da categoria da URL

let page = 1;
const limit = 10;

function fetchConsoles(page, category) {
    const offset = (page - 1) * limit;

    fetch(`http://127.0.0.1:8080/products?offset=${offset}&limit=${limit}&category=${categoryID}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.data) {
                const products = data.data;
                let consoleCards = '';
                products.forEach(product => {
                    console.log(product);
                    consoleCards += `
                    <div class="col mb-5">
                        <div class="card h-100">
                            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Popular</div>
                            <img class="card-img-top" src="${product.img}" alt="${product.name}" />
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <h5 class="fw-bolder">${product.name}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                });
                container.innerHTML = consoleCards;

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
        .catch(error => {
            console.error('Erro ao buscar consoles:', error);
            container.innerHTML = '<p>There was an error fetching the category.</p>';
        });
}
document.querySelector('#nextPage').addEventListener('click', () => {
    page++;
    fetchConsoles(page, categoryID);
});

document.querySelector('#prevPage').addEventListener('click', () => {
    if (page > 1) {
        page--;
        fetchConsoles(page, categoryID);
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    fetchConsoles(page, categoryID);
});