import { renderCart } from './utilities/cart/renderCart.js';
import { getOrderProducts, completeOrder } from './api/orders.js';
import { getSelf } from './api/users.js';
import { loadNavbar } from './utilities/navbar.js';
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar('navbarContainer', false, true);
    renderCart();

    const btnCheckout = document.getElementById('btnCheckout');
    btnCheckout.addEventListener('click', async () => {
        const orderProducts = await getOrderProducts();
        if (orderProducts.data.length == 0) {
            alert("Cart can't be empty");
        } else {
            const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
            checkoutModal.show();

            const { user } = await getSelf();
            const pointsHeader = document.getElementById('pointsHeader');
            if (pointsHeader) {
                pointsHeader.innerText = `Points: ${user.points || 0}`;
            }
        }
    });

    const confirmPurchase = document.getElementById('confirmPurchase');
    confirmPurchase.addEventListener('click', async () => {
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiryDate = document.getElementById('cardExpiryDate').value;
        const points = document.getElementById('points').value;

        const orderData = {
            cardName,
            cardNumber,
            cardExpiryDate,
            pointsToUse: points || 0
        };

        try {
            const response = await completeOrder(orderData);
            if (response) {
                alert('Order completed successfully!');
                 // Clear the cart items container
                 const cartItemsContainer = document.getElementById('cart-items');
                 cartItemsContainer.innerHTML = ''; // Clear previous content
 
            } else {
                alert('Failed to complete order');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('An error occurred while updating the order');
        }
    });
});
