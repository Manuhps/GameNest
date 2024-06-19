import { getCurrent, getOrderProducts, delOrderProduct, incrementProduct, decrementProduct, updateOrder } from './api/orders.js';
import { getSelf } from './api/users.js';

async function renderCart() {
    try {
        const currentOrder = await getCurrent();

        if (currentOrder && currentOrder.currentOrder.state === 'cart') {
            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.innerHTML = ''; // Clear previous content
            const orderProducts = await getOrderProducts();

            let totalPrice = 0;

            orderProducts.data.forEach(product => {
                totalPrice += parseInt(product.salePrice) * product.quantity;

                const productElement = document.createElement('div');
                productElement.className = 'd-flex justify-content-between align-items-center mb-3';

                productElement.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${product.Product.img}" alt="${product.Product.name}" class="img-thumbnail" style="width: 100px; height: auto;">
                        <div class="ms-3">
                            <h5>${product.Product.name}</h5>
                            <p>${parseInt(product.salePrice).toFixed(2)} €</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary me-2 decrement-btn">-</button>
                        <span>${product.quantity}</span>
                        <button class="btn btn-outline-secondary ms-2 increment-btn">+</button>
                        <button class="btn btn-outline-danger ms-2 remove-btn">Remove</button>
                    </div>
                `;

                cartItemsContainer.appendChild(productElement);

                // Adicionar event listeners aos botões criados dinamicamente
                const decrementBtn = productElement.querySelector('.decrement-btn');
                decrementBtn.addEventListener('click', async () => {
                    await decrementProduct(product.productID);
                    renderCart(); // Atualizar a página após decrementar
                });

                const incrementBtn = productElement.querySelector('.increment-btn');
                incrementBtn.addEventListener('click', async () => {
                    await incrementProduct(product.productID);
                    renderCart(); // Atualizar a página após incrementar
                });

                const removeBtn = productElement.querySelector('.remove-btn');
                removeBtn.addEventListener('click', async () => {
                    await delOrderProduct(product.productID);
                    renderCart(); // Atualizar a página após remover
                });
            });

            const totalPriceElement = document.createElement('div');
            totalPriceElement.className = 'text-end';
            totalPriceElement.innerHTML = `<h4>Total: ${totalPrice.toFixed(2)} €</h4>`;

            cartItemsContainer.appendChild(totalPriceElement);
        } else {
            document.getElementById('cart-items').innerHTML = '<p>Your cart is empty.</p>';
        }
    } catch (error) {
        console.error('Error rendering cart:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
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

        const products = (await getOrderProducts()).data.map(product => ({
            productID: product.productID,
            quantity: product.quantity
        }));

        const orderData = {
            cardName,
            cardNumber,
            cardExpiryDate,
            pointsToUse: points || 0
        };

        try {
            const response = await updateOrder(orderData);
            if (response) {
                alert('Order completed successfully!');
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
