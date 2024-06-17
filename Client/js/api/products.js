import api from './axiosConfig.js'
const BASE_URL = 'http://127.0.0.1:8080/products'

export async function fetchProducts(offset = 0, params = null) {
    const limit = 12; 
    let url = `${BASE_URL}?offset=${offset}&limit=${limit}`;

    if (params != null) {
        const queryString = new URLSearchParams(params).toString();
        url += `&${queryString}`;
    }
    try {
        const response = await api.get(url);
        return response.data
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

export async function fetchProductById(productId) {
    const url = `${BASE_URL}/${productId}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error Fetching Product:', error);
        throw error;
    }
}