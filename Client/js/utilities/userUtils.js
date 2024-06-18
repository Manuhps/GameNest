// Function to check user login status
export function checkUserLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginButton = document.getElementById('loginButton');
    const profileIcon = document.getElementById('profileIcon');
    const logoutButton = document.getElementById('logoutButton');

    if (isLoggedIn) {
        if (loginButton) loginButton.style.display = 'none';
        if (profileIcon) profileIcon.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'block';
    } else {
        if (loginButton) loginButton.style.display = 'block';
        if (profileIcon) profileIcon.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

// Function to handle user logout
export function logoutUser() {
    // Clear the user's login state
    localStorage.removeItem('isLoggedIn');

    // Update the UI
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const profileIcon = document.getElementById('profileIcon');

    if (loginButton) loginButton.style.display = 'block';
    if (logoutButton) logoutButton.style.display = 'none';
    if (profileIcon) profileIcon.style.display = 'none';

    // Redirect to the Home Page
    window.location.href = '/';
}