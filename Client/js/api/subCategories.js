import api from './axiosConfig.js'
const BASE_URL = 'http://127.0.0.1:8080/categories'

export async function fetchSubCategories(categoryID) {
    try {
        const response = await api.get(`${BASE_URL}/${categoryID}/subCategories`);
        return response.data.data
    } catch (error) {
        console.error('Error fetching subCategories:', error);
        throw error;
    }
}

export async function addSubCategory(categoryID, subCategoryName) {
    try {
        const response = await axios.post(`${BASE_URL}/${categoryID}/subCategories`, { subCategoryName });
        return response.data;
    } catch (error) {
        console.error('Error creating subCategory:', error);
        throw error;
    }
}

export async function delSubCategory(categoryID, subCategoryID){
    try {
        const response = await axios.delete(`${BASE_URL}/${categoryID}/subCategories/${subCategoryID}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
}