import api from './axiosConfig.JS'
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
        const response = await axios.post(`${BASE_URL}`, { genreName });
        return response.data;
    } catch (error) {
        console.error('Error creating genre:', error);
        throw error;
    }
}

export async function delGenre(genreID){
    try {
        const response = await axios.delete(`${BASE_URL}/${genreID}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting genre:', error);
        throw error;
    }
}