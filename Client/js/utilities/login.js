import { login } from '../api/users.js';

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

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
                    // If login is successful, store the authentication token and update UI
                    console.log('Login successful', data);

                    // Store the user's login state
                    localStorage.setItem('isLoggedIn', 'true');

                    // Redirect to the homepage
                    window.location.href = '/';
                })
                .catch(error => {
                    console.error('Error during login:', error);
                });
        });
    }
});