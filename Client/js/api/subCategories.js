const BASE_URL = 'http://127.0.0.1:8080/categories'

export async function fetchSubCategories(categoryID) {
    try {
        const response = await axios.get(`${BASE_URL}/${categoryID}/subCategories`);
        return response.data.data
    } catch (error) {
        console.error('Error fetching subCategories:', error);
        throw error;
    }
}