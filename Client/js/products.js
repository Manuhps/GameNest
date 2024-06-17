import { fetchProductById } from './api/products.js'; // Supondo que você tenha um arquivo api.js com a função fetchProductById
import { loadNavbar } from './utilities/navbar.js';
import { checkUserLoginStatus } from './utilities/userUtils.js';

document.addEventListener('DOMContentLoaded', async function () {
    loadNavbar('navbarContainer')
    checkUserLoginStatus()

    let productID = window.location.search.split("=")[1];

    try {
        const { product } = await fetchProductById(productID);
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
    } catch (error) {
        console.error('Erro ao buscar o produto:', error);
    }
});