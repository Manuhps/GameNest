import { fetchCategories } from './api/categories.js';
import { fetchSubCategories } from './api/subCategories.js';
import { fetchAndDisplayProducts } from './utilities/productsDom.js';
import { updateCategorySelect } from './utilities/categoriesDom.js';
import { updateSubCategorySelect, clearSubCategorySelect } from './utilities/subCategoriesDom.js';
import { toggleGameModeAndGenreDisplay } from './utilities/toggleModeGenre.js';
import { checkUserLoginStatus, logoutUser } from './utilities/userUtils.js';

document.addEventListener('DOMContentLoaded', async function () {
    let offset = 0;
    try {
        // Check user's login status
        checkUserLoginStatus();

        // Load and update categories in the category selector
        const categories = await fetchCategories();
        updateCategorySelect(categories);

        // Event listener for change in category selector
        const categorySelect = document.getElementById('category');
        categorySelect.addEventListener('change', async function () {
            clearSubCategorySelect();
            const selectedCategoryId = categorySelect.value;
            if (selectedCategoryId) {
                try {
                    const subCategories = await fetchSubCategories(selectedCategoryId);
                    updateSubCategorySelect(subCategories);

                    // Check if the selected category is "Games"
                    const selectedCategory = categories.find(category => category.categoryID == selectedCategoryId);
                    toggleGameModeAndGenreDisplay(selectedCategory);
                } catch (error) {
                    console.error('Error fetching subCategories:', error);
                }
            }
        });

        // Event for pagination - Next page
        document.querySelector('#nextPage').addEventListener('click', async () => {
            offset += 12;
            await fetchAndDisplayProducts(offset);
        });

        // Event for pagination - Previous page
        document.querySelector('#prevPage').addEventListener('click', async () => {
            if (offset > 0) {
                offset -= 12;
                await fetchAndDisplayProducts(offset);
            }
        });

        // Event for filter form submission
        document.getElementById('filterForm').addEventListener('submit', async function (event) {
            event.preventDefault();
            offset = 0;
            await fetchAndDisplayProducts(offset);
        });

        // Initially load and display products
        await fetchAndDisplayProducts(offset);
    } catch (error) {
        console.error('Error loading products:', error);
    }
});

// Add event listener to the logout button
document.getElementById('logoutButton').addEventListener('click', function () {
    logoutUser();
});