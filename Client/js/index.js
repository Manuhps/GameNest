import { fetchCategories } from './api/categories.js';
import { fetchSubCategories } from './api/subCategories.js';
import { fetchProducts } from './api/products.js';
import { displayProducts } from './utilities/productsDom.js';
import { updateCategorySelect } from './utilities/categoriesDom.js';
import { updateSubCategorySelect, clearSubCategorySelect } from './utilities/subCategoriesDom.js';
import { fetchGameModes } from './api/gameModes.js';
import { updateGameModeSelect } from './utilities/gameModesDom.js';
import { fetchGenres } from './api/genres.js';
import { updateGenreSelect } from './utilities/genresDom.js';

document.addEventListener('DOMContentLoaded', async function () {
    let offset = 0;
    try {
        // Check user's login status
        if (localStorage.getItem('isLoggedIn') === 'true') {
            // Hide login button
            const loginButton = document.getElementById('loginButton');
            if (loginButton) loginButton.style.display = 'none';

            // Show profile icon
            const profileIcon = document.getElementById('profileIcon');
            if (profileIcon) profileIcon.style.display = 'block';

            // Show logout button
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) logoutButton.style.display = 'block';
        }

        const categories = await fetchCategories();
        updateCategorySelect(categories);

        const categorySelect = document.getElementById('category');
        const gameModeSelect = document.getElementById('selGameMode');
        const genreSelect = document.getElementById('selGenre');

        categorySelect.addEventListener('change', async function () {
            clearSubCategorySelect();
            const selectedCategoryId = categorySelect.value;
            if (selectedCategoryId) {
                try {
                    const subCategories = await fetchSubCategories(selectedCategoryId);
                    updateSubCategorySelect(subCategories);
                    // Check if the selected category is "Games"
                    const selectedCategory = categories.find(category => category.categoryID == selectedCategoryId);
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
                } catch (error) {
                    console.error('Error fetching subCategories:', error);
                }
            }
        });

        document.querySelector('#nextPage').addEventListener('click', async () => {
            offset += 12;
            const params = new URLSearchParams(new FormData(document.getElementById('filterForm')));
            const { data, pagination } = await fetchProducts(offset, params);
            if (data && data.length > 0) {
                displayProducts(data, pagination);
            } else {
                console.log('No products found.');
            }
        });

        document.querySelector('#prevPage').addEventListener('click', async () => {
            if (offset > 0) {
                offset -= 12;
                const params = new URLSearchParams(new FormData(document.getElementById('filterForm')));
                const { data, pagination } = await fetchProducts(offset, params);
                if (data && data.length > 0) {
                    displayProducts(data, pagination);
                } else {
                    console.log('No products found.');
                }
            }
        });

        document.getElementById('filterForm').addEventListener('submit', async function (event) {
            event.preventDefault();
            offset = 0;
            const params = new URLSearchParams(new FormData(document.getElementById('filterForm')));
            const { data, pagination } = await fetchProducts(offset, params);
            if (data && data.length > 0) {
                displayProducts(data, pagination);
            } else {
                console.log('No products found.');
            }
        });

        const { data, pagination } = await fetchProducts(offset);

        if (data && data.length > 0) {
            displayProducts(data, pagination);
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
});
