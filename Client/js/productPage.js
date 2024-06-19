import { fetchProductById, addDiscount, editProduct, getReviews, addReview } from './api/products.js';
import { addOrder, getCurrent, updateOrder } from './api/orders.js';
import { loadNavbar } from './utilities/navbar.js';
import { checkUserLoginStatus } from './utilities/userUtils.js';
import { populateDiscountTable } from './utilities/discountsUtils.js';
import { getSelf } from './api/users.js';

document.addEventListener('DOMContentLoaded', async function () {
    loadNavbar('navbarContainer');
    checkUserLoginStatus();
    const { user } = await getSelf();
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
                    <button class="btn btn-outline-dark flex-shrink-0 add-to-cart-button" type="button">
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

        // Add-to-cart button event listener
        document.querySelector('.add-to-cart-button').addEventListener('click', async () => {
            try {
                const products = [{ productID: productID, quantity: 1, salePrice: product.curPrice }]

                const currentOrder = await getCurrent();
                if (currentOrder && currentOrder.currentOrder.state === 'cart') {
                    await updateOrder(products)
                    alert('Product added to cart successfully!');
                } else {
                    await addOrder(products);
                    alert('Product added to cart successfully!');
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
                alert('There was an error adding the product to the cart.');
            }
        });

        // Fetch and display product reviews
        const reviewsContainer = document.getElementById('reviews-container');
        let hasReviewed = false
        try {
            const reviews = await getReviews(productID);
            reviews.data.forEach(review => {
                if(review.userID == user.userID){
                    hasReviewed = true
                }
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('col-12', 'mb-4');
                reviewElement.innerHTML = `
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex">
                                <img class="rounded-circle" src="${review.User.profileImg}" alt="${review.User.username}" width="50" height="50">
                                <div class="ms-3">
                                    <h5 class="fw-bolder">${review.User.username}</h5>
                                    <div class="d-flex align-items-center mb-2">
                                        ${'<span class="bi-star-fill text-warning"></span>'.repeat(review.rating)}
                                        ${'<span class="bi-star text-muted"></span>'.repeat(5 - review.rating)}
                                    </div>
                                    <p class="mb-0">${review.comment || ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }

        // Handle form submission for adding a new review
        const addReviewForm = document.getElementById('addReviewForm');
        if (hasReviewed) {
            addReviewForm.style.display = 'none';
            document.getElementById('alreadyReviewedMessage').style.display = 'block';
        }else{
            addReviewForm.addEventListener('submit', async function (event) {
                event.preventDefault();
    
                const rating = document.getElementById('ratingInput').value;
                const comment = document.getElementById('commentInput').value;
                const reviewData= {
                    rating,
                    comment
                }
                try {
                    await addReview(productID, reviewData);
                    alert('Review added successfully!');
                    addReviewForm.reset();
                    location.reload(); // Reload the page to display the new review
                } catch (error) {
                    console.error('Error adding review:', error);
                    alert(error.response.data.message || 'There was an error adding your review.');
                }
            });
        }
    } catch (error) {
        console.error('Error Fetching Product:', error);
    }
});