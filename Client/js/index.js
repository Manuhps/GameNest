import { fetchCategories } from './api/categories.js';
import { fetchSubCategories } from './api/subCategories.js';
import { fetchAndDisplayProducts } from './utilities/productsDom.js';
import { updateCategorySelect } from './utilities/categoriesDom.js';
import { updateSubCategorySelect, clearSubCategorySelect } from './utilities/subCategoriesDom.js';
import { toggleGameModeAndGenreDisplay } from './utilities/toggleModeGenre.js';
import { checkUserLoginStatus, logoutUser } from './utilities/userUtils.js';
import { loadNavbar } from './utilities/navbar.js';

document.addEventListener('DOMContentLoaded', async function () {
    let offset = 0;
    try {
        //Load navbar dynamically
        loadNavbar('navbarContainer');

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
            event.preventDefault()
            offset = 0
            const search = document.getElementById('search').value;
            const category = document.getElementById('category').value;
            const subCategory = document.getElementById('subCategory').value;
            const price = document.querySelector('input[name="price"]:checked')?.value || '';
            const rating = document.querySelector('input[name="rating"]:checked')?.value || '';
            const date = document.querySelector('input[name="date"]:checked')?.value || '';

            const params = new URLSearchParams();

            if (search) params.append('name', search);
            if (category && category !== "none") params.append('categoryID', category);
            if (subCategory && subCategory !== "none") params.append('subCategoryID', subCategory);
            if (price && price !== "none") params.append('curPrice', price);
            if (rating && rating !== "none") params.append('rating', rating);
            if (date && date !== "none") params.append('date', date);

            await fetchAndDisplayProducts(offset, params);
        });

        // Initially load and display products
        await fetchAndDisplayProducts(offset);
    } catch (error) {
        console.error('Error loading products:', error);
    }
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Add event listener to the logout button
        document.getElementById('logoutButton').addEventListener('click', function () {
            logoutUser();
        });
    } 
});

    