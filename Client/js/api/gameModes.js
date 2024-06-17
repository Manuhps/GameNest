import api from './axiosConfig.js'
const BASE_URL = 'http://127.0.0.1:8080/gameModes'

export async function fetchGameModes() {
    try {
        const response = await api.get(BASE_URL)
        return response.data.data
    } catch (error) {
        console.error('Error fetching GameModes:', error);
        throw error;
    }
}