const BASE_URL = 'http://127.0.0.1:8080/users'

export async function login(username, password) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw new Error('Error trying to login' + error.message);
    }
}

// Logout
export function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
}