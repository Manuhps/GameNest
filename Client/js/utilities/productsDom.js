import { fetchProducts } from '../api/products.js';
import { getStarsHTML } from './ratingStarsHome.js';

function displayProducts(products, pagination, limit) {
    let productCards = '';

    products.slice(0, limit).forEach(product => {
        // Calculate stars based on the rating 
        const stars = getStarsHTML(product.rating);

        productCards += `
            <div class="col mb-5">
                <div class="card h-100">
                    <img class="card-img-top" src="${product.img}" alt="${product.name}" />
                    <div class="card-body p-4 text-bg-light p-3">
                        <div class="text-center">
                            <h5 class="fw-bolder">${product.name}</h5>
                            <span id="sale-price">${product.curPrice}</span>
                            <div class="stars">${stars}</div>
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

    // if (pagination) {
    //     const { totalPages, currentPage } = pagination;
    //     console.log(pagination);
    //     let paginationLinks = '';
    //     for (let i = 1; i <= totalPages + 1; i++) {
    //         const activeClass = i === currentPage ? 'active' : '';
    //         paginationLinks += `<a href="?page=${i}" class="${activeClass}">${i}</a>`;
    //     }

    //     const paginationContainer = document.querySelector('#paginationContainer');
    //     if (paginationContainer) {
    //         paginationContainer.innerHTML = paginationLinks;
    //     }
    // }
}

// Function to fetch and display products with pagination
export async function fetchAndDisplayProducts(offset, limit = 12, params) {
    try {
        const data = await fetchProducts(offset, limit, params);

        if (data && data.data.length > 0) {
            displayProducts(data.data, data.pagination, limit);
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}