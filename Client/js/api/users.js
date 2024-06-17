import api from './axiosConfig.js'

const BASE_URL = 'http://127.0.0.1:8080/users'

export async function login(username, password) {
    try {
        const response = await api.post(`${BASE_URL}/login`, {
            username,
            password
        });
        const token = response.data.accessToken;
        localStorage.setItem('authToken', token); // Save the token to localStorage
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

export async function getSelf(){
    try {
        const response = await api.get(`${BASE_URL}/me`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

// Function to update user profile
export async function updateUserProfile(updatedProfile) {
    try {
        const response = await api.patch(`${BASE_URL}/me`, updatedProfile);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}