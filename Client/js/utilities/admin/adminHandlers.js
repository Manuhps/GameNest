import { getUsers, banUser, unbanUser } from '../../api/users.js';
import { fetchCategories, delCategory } from '../../api/categories.js';
import { fetchSubCategories, delSubCategory } from '../../api/subCategories.js';
import { fetchGenres, delGenre } from '../../api/genres.js';
import { fetchGameModes, delGameMode } from '../../api/gameModes.js';
import { populateAdminTable } from './adminUtils.js';
import { reloadTable } from './adminModal.js';

export async function handleUsers(offset = 0) {
    try {
        const data = await getUsers(offset);
        populateAdminTable(data.data, 'users');
    } catch (error) {
        console.error('Error loading Users:', error);
        alert('Failed to load Users');
    }
}

export async function handleCategories() {
    try {
        const data = await fetchCategories();
        populateAdminTable(data, 'categories');
    } catch (error) {
        console.error('Error loading Categories:', error);
        alert('Failed to load Categories');
    }
}

export async function handleSubCategories() {
    try {
        const data = await fetchSubCategories();
        populateAdminTable(data, 'subCategories');
    } catch (error) {
        console.error('Error loading SubCategories:', error);
        alert('Failed to load SubCategories');
    }
}

export async function handleGenres() {
    try {
        const data = await fetchGenres();
        populateAdminTable(data, 'genres');
    } catch (error) {
        console.error('Error loading Genres:', error);
        alert('Failed to load Genres');
    }
}

export async function handleGameModes() {
    try {
        const data = await fetchGameModes();
        populateAdminTable(data, 'gameModes');
    } catch (error) {
        console.error('Error loading Game Modes:', error);
        alert('Failed to load Game Modes');
    }
}

// Functions to handle actions like ban/unban or delete
export async function handleBanUser(userId, currentType) {
    try {
        await banUser(userId);
        await reloadTable(currentType); // Reload table after banning user
        alert('User banned successfully');
    } catch (error) {
        console.error('Error banning user:', error);
        alert('Failed to ban user');
    }
}

export async function handleUnbanUser(userId, currentType) {
    try {
        await unbanUser(userId);
        await reloadTable(currentType); // Reload table after unbanning user
        alert('User unbanned successfully');
    } catch (error) {
        console.error('Error unbanning user:', error);
        alert('Failed to unban user');
    }
}

export async function handleDeleteCategory(categoryId, currentType) {
    try {
        await delCategory(categoryId);
        await reloadTable(currentType); // Reload table after deleting category
        alert('Category deleted successfully');
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
    }
}

export async function handleDeleteSubCategory(subCategoryId, currentType) {
    try {
        await delSubCategory(subCategoryId);
        await reloadTable(currentType); // Reload table after deleting subcategory
        alert('Subcategory deleted successfully');
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        alert('Failed to delete subcategory');
    }
}

export async function handleDeleteGenre(genreId, currentType) {
    try {
        await delGenre(genreId);
        await reloadTable(currentType); // Reload table after deleting genre
        alert('Genre deleted successfully');
    } catch (error) {
        console.error('Error deleting genre:', error);
        alert('Failed to delete genre');
    }
}

export async function handleDeleteGameMode(gameModeId, currentType) {
    try {
        await delGameMode(gameModeId);
        await reloadTable(currentType); // Reload table after deleting game mode
        alert('Game Mode deleted successfully');
    } catch (error) {
        console.error('Error deleting game mode:', error);
        alert('Failed to delete game mode');
    }
}