document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevents the default form submission

        // Collects the values of the input fields
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Sends the registration data to the backend
        fetch('http://127.0.0.1:8080/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            return response.json();
        })
        .then(data => {
           // If registration is successful, store the authentication token and redirect to the login page
           console.log('Registration successful', data);

           window.location.href = 'login.html'; // Redirects to the login page
        });
    });
});