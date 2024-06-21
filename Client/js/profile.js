import { getSelf, updateUserProfile } from './api/users.js';
import { openAdminModal } from './utilities/admin/adminModal.js';
import { handleUsers, handleCategories, handleSubCategories, handleGenres, handleGameModes } from './utilities/admin/adminHandlers.js';
import { loadNavbar } from './utilities/navbar.js';
import { checkUserLoginStatus, logoutUser } from './utilities/userUtils.js';
import { getMyOrders } from './api/orders.js';
import { fetchProductById } from './api/products.js';

document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Load navbar dynamically
        loadNavbar('navbarContainer', true);

        // Check user login status and update UI accordingly
        checkUserLoginStatus();

        const { user } = await getSelf();

        const usernameField = document.getElementById('username');
        const emailField = document.getElementById('email');
        const profileImage = document.getElementById('profileImage');
        const pointsHeader = document.getElementById('pointsHeader');
        const adminSection = document.getElementById('adminSection');

        if (usernameField) {
            usernameField.value = user.username;
        }

        if (emailField) {
            emailField.value = user.email;
        }

        if (profileImage) {
            profileImage.src = user.profileImg;
        }

        if (pointsHeader) {
            pointsHeader.innerText = `Points: ${user.points || 0}`;
        }

        // Hide the Profile button in navbar when on profile page
        const profileButton = document.getElementById('profileIcon');
        if (profileButton) {
            profileButton.style.display = 'none';
        }

        // Show admin options if the user is an admin
        if (user.role === 'admin') {
            if (adminSection) {
                adminSection.style.display = 'block';
            }

            // Event listeners for admin buttons
            document.getElementById('btnUsers').addEventListener('click', () => openAdminModal('Users', handleUsers, 'users'));
            document.getElementById('btnCategories').addEventListener('click', () => openAdminModal('Categories', handleCategories, 'categories'));
            // document.getElementById('btnSubCategories').addEventListener('click', () => openAdminModal('SubCategories', handleSubCategories, 'subCategories'));
            document.getElementById('btnGenres').addEventListener('click', () => openAdminModal('Genres', handleGenres, 'genres'));
            document.getElementById('btnGameModes').addEventListener('click', () => openAdminModal('Game Modes', handleGameModes, 'gameModes'));
        }

        // Update profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', async function (event) {
                event.preventDefault();

                const updatedProfile = {
                    username: document.getElementById('username').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                };

                try {
                    const updatedUser = await updateUserProfile(updatedProfile);
                    alert('Profile updated successfully');
                } catch (error) {
                    console.error('Error updating profile:', error);
                    alert('Failed to update profile');
                }
            });
        }

        // Logout button event listener
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                logoutUser();
            });
        }

        // Fetch and display orders when the Orders tab is clicked
        const ordersTab = document.getElementById('userOrders-tab');
        if (ordersTab) {
            ordersTab.addEventListener('click', async function () {
                try {
                    const orders = await getMyOrders();
                    const ordersContainer = document.getElementById('ordersContainer');
                    ordersContainer.innerHTML = ''; // Clear existing orders

                    for (const order of orders.data) {
                        const orderDetails = [];
                        let orderTotal = 0; // Initialize order total for this order

                        for (const orderProduct of order.OrderProducts) {
                            const productResponse = await fetchProductById(orderProduct.productID);
                            const product = productResponse.product;
                            const productTotal = orderProduct.quantity * parseFloat(product.basePrice);
                            orderTotal += productTotal;

                            orderDetails.push({
                                ...orderProduct,
                                name: product.name,
                                imageUrl: product.img,
                                price: product.basePrice,
                                total: productTotal.toFixed(2)
                            });
                        }

                        const orderElement = document.createElement('div');
                        orderElement.classList.add('order');
                        orderElement.innerHTML = `
                            <h6>Order ID: ${order.orderID}</h6>
                            <p>Date: ${new Date(order.deliverDate).toLocaleDateString()}</p>
                            <p>State: ${order.state}</p>
                            <div class="products">
                                ${orderDetails.map(product => `
                                    <div class="product">
                                        <img src="${product.imageUrl}" alt="${product.name}" class="product-image" />
                                        <div class="product-details">
                                            <p>Price: $${product.price}</p>
                                            <p>Name: ${product.name}</p>
                                            <p>Quantity: ${product.quantity}</p>
                                            <p>Total Price: $${product.total}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div style="clear: both;"></div> <!-- Clear floats after products -->
                            <p><strong>Order Total: $${orderTotal.toFixed(2)}</strong></p>
                            <hr />
                        `;
                        ordersContainer.appendChild(orderElement);
                    }
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    alert('Failed to load orders');
                }
            });
        }
        // Event listener for logout button
        document.getElementById('logoutButton').addEventListener('click', function () {
            logoutUser();
        });
    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Failed to load user profile');
    }
});