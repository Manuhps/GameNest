// Function to check user login status
export function checkUserLoginStatus() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const loginButton = document.getElementById('loginButton');
        if (loginButton) loginButton.style.display = 'none';

        const profileIcon = document.getElementById('profileIcon');
        if (profileIcon) profileIcon.style.display = 'block';

        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) logoutButton.style.display = 'block';
    }
}

// Function to handle user logout
export function logoutUser() {
    // Clear the user's login state
    localStorage.removeItem('isLoggedIn');

    // Update the UI
    const loginButton = document.getElementById('loginButton');
    if (loginButton) loginButton.style.display = 'block';

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) logoutButton.style.display = 'none';

    const profileIcon = document.getElementById('profileIcon');
    if (profileIcon) profileIcon.style.display = 'none';

    // Redirect to the Home Page
    window.location.href = '/';
}