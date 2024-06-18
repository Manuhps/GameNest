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

export async function addGameMode(gameModeName) {
    try {
        const response = await axios.post(`${BASE_URL}`, { gameModeName },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating gameMode:', error);
        throw error;
    }
}

export async function delGameMode(gameModeID){
    try {
        const response = await axios.delete(`${BASE_URL}/${gameModeID}`,
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting gameMode:', error);
        throw error;
    }
}