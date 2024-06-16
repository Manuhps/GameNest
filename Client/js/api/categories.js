const BASE_URL = 'http://127.0.0.1:8080/categories'

export async function fetchCategories() {
    try {
        const response = await axios.get(BASE_URL)
        return response.data.data
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}