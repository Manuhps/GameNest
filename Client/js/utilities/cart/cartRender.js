/*import { getCurrent} from '../../api/orders.js';

export async function renderCart() {
    try {
        const currentOrder = await getCurrent();
        alert("EH")
        
        if (currentOrder && currentOrder.currentOrder.state === 'cart') {
            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.innerHTML = ''; // Clear previous content

            let totalPrice = 0;

            currentOrder.products.forEach(product => {
                totalPrice += product.salePrice * product.quantity;

                const productElement = document.createElement('div');
                productElement.className = 'd-flex justify-content-between align-items-center mb-3';

                productElement.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${product.imageUrl}" alt="${product.name}" class="img-thumbnail" style="width: 100px; height: auto;">
                        <div class="ms-3">
                            <h5>${product.name}</h5>
                            <p>${product.salePrice.toFixed(2)} €</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary me-2" onclick="decrementProduct(${product.productID})">-</button>
                        <span>${product.quantity}</span>
                        <button class="btn btn-outline-secondary ms-2" onclick="incrementProduct(${product.productID})">+</button>
                        <button class="btn btn-outline-danger ms-2" onclick="removeProduct(${product.productID})">Remove</button>
                    </div>
                `;

                cartItemsContainer.appendChild(productElement);
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
}*/