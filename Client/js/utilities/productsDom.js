import { fetchProducts, fetchProductById } from '../api/products.js'

function displayProducts(products, pagination) {
    const limit = 12;
    let productCards = '';

    products.slice(0, limit).forEach(product => {
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

export async function displayProductDetails(productId) {
    try {
        const { product } = await fetchProductById(productId);

        const productSection = document.getElementById('productsSection');

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
    } catch (error) {
        console.error('Error showing product details:', error);
    }
}