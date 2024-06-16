document.addEventListener('DOMContentLoaded', function () {
    // Verifique o estado de login do usuário
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Oculta o botão de login
        const loginButton = document.getElementById('loginButton');
        if (loginButton) loginButton.style.display = 'none';

        // Mostra o ícone de perfil
        const profileIcon = document.getElementById('profileIcon');
        if (profileIcon) profileIcon.style.display = 'block';

        // Mostra o botão de logout
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) logoutButton.style.display = 'block';
    }
});

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartElement = document.getElementById('cart');
    if (cartElement) {
        if (cart.length === 0) {
            cartElement.textContent = '0';
        } else {
            cartElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }
}

function addToCart(product) {


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

    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart count
    let cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
    updateCartCount();
}

function generateCart() {
    // Get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Clear the cart display
    let cartDisplay = document.querySelector('#cart-items');
    cartDisplay.innerHTML = '';

    // Generate HTML for each product in the cart
    let cartItemsHTML = cart.map(generateCartItem).join('');

    // Insert the cart items HTML into the DOM
    cartDisplay.innerHTML = cartItemsHTML;

    // Update the cart count
    let cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function generateCartItem(item) {
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
            <button class="btn btn-link text-dark px-3" onclick="incrementProductQuantity(${item.id})"><i class="bi-plus-circle-fill"></i></button>
            <button class="btn btn-link text-dark px-3" onclick="removeFromCart(${item.id})"><i class="bi-trash"></i></button>
        </div>
        <div>
            Total price: $${item.price * item.quantity}
        </div>
    </div>
`;
}

function incrementProductQuantity(productId) {
    // Obtenha o carrinho do localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Encontre o produto no carrinho
    let cartItem = cart.find(item => item.id === productId);

    // Se o produto já está no carrinho, aumente sua quantidade
    if (cartItem) {
        cartItem.quantity++;
    } else {
        console.error(`Produto com ID ${productId} não encontrado no carrinho.`);
        return;
    }

    // Salve o carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Atualize a visualização do carrinho
    document.getElementById('cart').innerHTML = generateCart(cart);

    // Atualize a contagem do carrinho
    updateCartCount();
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
    updateCartCount();
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
    let cartItemsHTML = cart.map(generateCartItem).join('');

    // Insert the cart items HTML into the DOM
    let cartItemsElement = document.getElementById('cart-items');
    if (cartItemsElement) {
        cartItemsElement.innerHTML = cartItemsHTML;
    }
}

function checkOut() {

    let userIsLoggedIn = localStorage.getItem('isLoggedIn');

    if (userIsLoggedIn === 'true') {
        // Se o usuário estiver logado, mostre o modal de checkout
        let checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'), {});
        checkoutModal.show();
    } else {
        // Se o usuário não estiver logado, mostre o modal de login
        let loginModal = new bootstrap.Modal(document.getElementById('loginModal1'), {});
        loginModal.show();
    }
}


function redirectToLogin() {
    window.location.href = 'login.html';
}

window.onload = loadCart;

window.addEventListener('storage', function(event) {
    if (event.key === 'cart') {
        updateCartCount();
    }
});
