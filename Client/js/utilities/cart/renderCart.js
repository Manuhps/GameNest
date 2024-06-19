import { getCurrent, getOrderProducts, decrementProduct, incrementProduct, delOrderProduct } from "../../api/orders.js";

export async function renderCart() {
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