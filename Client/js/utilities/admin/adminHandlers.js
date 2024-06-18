import { getUsers } from '../../api/users.js';
import { fetchCategories } from '../../api/categories.js';
import { fetchSubCategories } from '../../api/subCategories.js';
import { fetchGenres } from '../../api/genres.js';
import { fetchGameModes } from '../../api/gameModes.js';
import { populateAdminTable } from './adminUtils.js';

export async function handleUsers(offset = 0) {
    try {
        const data = await getUsers(offset);
        populateAdminTable(data.data);
    } catch (error) {
        console.error('Error loading Users:', error);
        alert('Failed to load Users');
    }
}

export async function handleCategories() {
    try {
        const data = await fetchCategories();
        populateAdminTable(data.data);
    } catch (error) {
        console.error('Error loading Categories:', error);
        alert('Failed to load Categories');
    }
}

export async function handleSubCategories() {
    try {
        const data = await fetchSubCategories();
        populateAdminTable(data.data);
    } catch (error) {
        console.error('Error loading SubCategories:', error);
        alert('Failed to load SubCategories');
    }
}

export async function handleGenres() {
    try {
        const data = await fetchGenres();
        populateAdminTable(data.data);
    } catch (error) {
        console.error('Error loading Genres:', error);
        alert('Failed to load Genres');
    }
}

export async function handleGameModes() {
    try {
        const data = await fetchGameModes();
        populateAdminTable(data.data);
    } catch (error) {
        console.error('Error loading Game Modes:', error);
        alert('Failed to load Game Modes');
    }
}