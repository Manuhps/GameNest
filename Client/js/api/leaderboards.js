import api from './axiosConfig.js'
const BASE_URL = 'http://127.0.0.1:8080/leaderboards'

export async function getMostSpent() {
    try {
        const response = await api.get(`${BASE_URL}/mostSpent`);
        return response.data
    } catch (error) {
        console.error('Error fetching mostSpent:', error);
    }
}

export async function getMostOrders() {
    try {
        const response = await api.get(`${BASE_URL}/mostOrders`);
        return response.data
    } catch (error) {
        console.error('Error fetching mostOrders:', error);
    }
}

export async function getMostReviews() {
    try {
        const response = await api.get(`${BASE_URL}/mostReviews`);
        return response.data
    } catch (error) {
        console.error('Error fetching mostReviews:', error);
    }
}