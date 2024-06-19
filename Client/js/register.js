import { register, login } from './api/users.js';

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Collect the values of the input fields
        const username = document.getElementById('usernameInput').value;
        const email = document.getElementById('emailInput').value; 
        const password = document.getElementById('passwordInput').value;

        try {
            // Sends the registration data using the register function
            const registerData = await register(username, email, password);

            // If registration is successful, log in the user
            console.log('Registration successful', registerData);

            try {
                const loginData = await login(username, password);

                if (!loginData) {
                    throw new Error('Login failed');
                }

                // If login is successful, store the authentication token and update UI
                console.log('Login successful', loginData);

                // Store the user's login state
                localStorage.setItem('isLoggedIn', 'true');

                // Redirect to the homepage
                window.location.href = '/';
            } catch (loginError) {
                console.error('Login after registration failed', loginError.message);
            }
        } catch (error) {
            console.error('Registration failed', error.message);
        }
    });
});