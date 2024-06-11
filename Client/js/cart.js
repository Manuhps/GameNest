function addToCart(product) {
    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product in the cart
    let cartItem = cart.find(item => item.id === product.id);

    // If the product is already in the cart, increase its quantity
    if (cartItem) {
        cartItem.quantity++;
    } else {
        // Otherwise, add a new product to the cart
        cart.push({
            id: product.id,
            name: product.name,
            image: product.img,
            price: product.basePrice,
            quantity: 1
        });
    }

    // Save the cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart count
    let cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    } else {
        console.error('Cart element does not exist');
    }

}

function generateCartItemHTML(item) {
    return `
    <div class="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div class="d-flex align-items-center">
            <img class="rounded" src="${item.image}" alt="${item.name}" width="90" />
            <div class="ms-3 ms-sm-4">
                <h4 class="h5 mb-0">${item.name}</h4>
                <p class="mb-0">Quantidade: ${item.quantity}</p>
            </div>
        </div>
        <div class="d-flex align-items-center">
            <p class="mb-0">$${item.price}</p>
            <button class="btn btn-link text-dark px-3" onclick="removeFromCart(${item.id})"><i class="bi-trash"></i></button>
        </div>
    </div>
`;
}


function removeFromCart(productId) {
    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product in the cart
    let cartItem = cart.find(item => item.id === productId);

    // If the product is in the cart, decrease its quantity
    if (cartItem) {
        cartItem.quantity--;

        // If the quantity is zero, remove the product from the cart
        if (cartItem.quantity === 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }

    // Save the cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reload the cart
    loadCart();
}

function loadCart() {
    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Update the cart count
    let cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.textContent = cart.reduce((total, product) => total + product.quantity, 0);
    } else {
        console.error('Cart element does not exist');
    }

    // Generate HTML for each product in the cart
    let cartItemsHTML = cart.map(generateCartItemHTML).join('');

    // Insert the cart items HTML into the DOM
    let cartItemsElement = document.getElementById('cart-items');
    if (cartItemsElement) {
        cartItemsElement.innerHTML = cartItemsHTML;
    } else {
        console.error('Cart items element does not exist');
    }
}

window.onload = loadCart;