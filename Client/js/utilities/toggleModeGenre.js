import { updateGameModeSelect } from './gameModesDom.js';
import { updateGenreSelect } from './genresDom.js';

export async function toggleGameModeAndGenreDisplay(selectedCategory) {
    const gameModeSelect = document.getElementById('selGameMode');
    const genreSelect = document.getElementById('selGenre');

    if (selectedCategory && selectedCategory.categoryName.toLowerCase() === 'games') {
        gameModeSelect.style.display = '';
        genreSelect.style.display = '';
        const gameModes = await fetchGameModes();
        const genres = await fetchGenres();
        updateGameModeSelect(gameModes);
        updateGenreSelect(genres);
    } else {
        gameModeSelect.style.display = 'none';
        genreSelect.style.display = 'none';
    }
}