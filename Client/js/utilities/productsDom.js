import { fetchProducts } from '../api/products.js';
import { getStarsHTML } from './ratingStarsHome.js';

function displayProducts(products, pagination) {
    const limit = 12;
    let productCards = '';

    products.slice(0, limit).forEach(product => {
        // Calculate stars based on the rating (assuming rating is out of 5)
        const stars = getStarsHTML(product.rating);

        productCards += `
            <div class="col mb-5">
                <div class="card h-100">
                    <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Popular</div>
                    <img class="card-img-top" src="${product.img}" alt="${product.name}" />
                    <div class="card-body p-4">
                        <div class="text-center">
                            <h5 class="fw-bolder">${product.name}</h5>
                            <span id="sale-price">${product.curPrice}</span>
                            <div class="stars">${stars}</div> <!-- Display stars here -->
                            <div class="text-center">
                                <a class="btn btn-outline-dark mt-auto" href="./html/products.html?id=${product.productID}">View options</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    const container = document.getElementById('productsSection');
    container.innerHTML = productCards;

    if (pagination) {
        const { totalPages, currentPage } = pagination;

        let paginationLinks = '';
        for (let i = 1; i <= totalPages; i++) {
            const activeClass = i === currentPage ? 'active' : '';
            paginationLinks += `<a href="?page=${i}" class="${activeClass}">${i}</a>`;
        }

        const paginationContainer = document.querySelector('#paginationContainer');
        if (paginationContainer) {
            paginationContainer.innerHTML = paginationLinks;
        }
    }
}

// Function to fetch and display products with pagination
export async function fetchAndDisplayProducts(offset, params) {
    try {
        const { data, pagination } = await fetchProducts(offset, params);

        if (data && data.length > 0) {
            displayProducts(data, pagination);
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}