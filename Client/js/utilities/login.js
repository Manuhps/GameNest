// Import necessary functions
import { login } from '../api/users.js';

// Listen for the DOMContentLoaded event to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission

            // Collect input field values
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Send login data to the backend
            login(username, password)
                .then(response => {
                    if (!response) {
                        throw new Error('Login failed');
                    }
                    return response.data;
                })
                .then(data => {
                    // If login is successful, store the authentication token and redirect to the homepage
                    console.log('Login successful', data);

                    // Store the user's login state
                    localStorage.setItem('isLoggedIn', 'true');

                    // Hide the login button
                    const loginButton = document.getElementById('loginButton');
                    if (loginButton) loginButton.style.display = 'none';

                    // Show the logout button
                    const logoutButton = document.getElementById('logoutButton');
                    if (logoutButton) logoutButton.style.display = 'block';

                    // Show the profile icon
                    const profileIcon = document.getElementById('profileIcon');
                    if (profileIcon) profileIcon.style.display = 'block';

                    window.location.href = '/'; // Redirect to the homepage
                })
                .catch(error => {
                    console.error('Error during login:', error);
                });
        });
    }
});
