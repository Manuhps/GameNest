import { fetchProductById, addDiscount, editProduct } from './api/products.js';
import { loadNavbar } from './utilities/navbar.js';
import { checkUserLoginStatus } from './utilities/userUtils.js';
import { populateDiscountTable } from './utilities/discountsUtils.js';

document.addEventListener('DOMContentLoaded', async function () {
    loadNavbar('navbarContainer');
    checkUserLoginStatus();

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

        // Populate discounts table
        await populateDiscountTable(productID);

        const addDiscountForm = document.getElementById('addDiscountForm');
        addDiscountForm.addEventListener('submit', async function (event) {
            event.preventDefault()
            const percentage = document.getElementById('percentageInput').value;
            const startDate = document.getElementById('startDateInput').value;
            const endDate = document.getElementById('endDateInput').value;

            try {
                await addDiscount(productID, percentage, startDate, endDate);
                alert('Discount added successfully!');
                const modal = new bootstrap.Modal(document.getElementById('discountModal'));
                modal.hide();
                addDiscountForm.reset();
            } catch (error) {
                console.error('Error adding discount:', error);
            }
        })
        // Handle form submission for editing product
        document.getElementById('editProductForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            const updateData = {
                name: document.getElementById('editNameInput').value,
                desc: document.getElementById('editDescInput').value,
                basePrice: document.getElementById('editPriceInput').value,
                img: document.getElementById('editImgInput').value,
                platform: document.getElementById('editPlatformInput').value
            };

            try {
                await editProduct(productID, updateData);
                alert('Product updated successfully!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
                modal.hide();
            } catch (error) {
                console.error('Error updating product:', error);
            }
        });

        // Add-to-cart button event listener (example)
        document.querySelector('.add-to-cart-button').addEventListener('click', () => addToCart(product));
    } catch (error) {
        console.error('Error Fetching Product:', error);
    }
});