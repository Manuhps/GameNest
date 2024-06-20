import api from './axiosConfig.js'
const BASE_URL = 'http://127.0.0.1:8080/genres'

export async function fetchGenres() {
    try {
        const response = await api.get(BASE_URL)
        return response.data.data
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
}

export async function addGenre(genreName) {
    try {
        const response = await api.post(BASE_URL, { genreName },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating genre:', error);
        throw error;
    }
}

export async function delGenre(genreID){
    try {
        const response = await api.delete(`${BASE_URL}/${genreID}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting genre:', error);
        throw error;
    }
}