import api from './axiosConfig.js'
const BASE_URL = 'http://127.0.0.1:8080/categories'

export async function fetchCategories() {
    try {
        const response = await api.get(BASE_URL)
        return response.data.data
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export async function addCategory(categoryName) {
    try {
        const response = await api.post(`${BASE_URL}`, { categoryName },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
}

export async function delCategory(categoryID){
    try {
        const response = await api.delete(`${BASE_URL}/${categoryID}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}