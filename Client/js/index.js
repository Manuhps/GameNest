import { fetchCategories, updateCategorySelect } from './categories.js'
import { fetchSubCategories, updateSubCategorySelect, clearSubCategorySelect } from './subCategories.js'
import { fetchProducts } from './productss.js'


document.addEventListener('DOMContentLoaded', async function () {
    let offset = 0
    try {   
        // Check user's login status
        if (localStorage.getItem('isLoggedIn') === 'true') {
            // Hide login button
            const loginButton = document.getElementById('loginButton');
            if (loginButton) loginButton.style.display = 'none';

            // Mostra o ícone de perfil
            const profileIcon = document.getElementById('profileIcon');
            if (profileIcon) profileIcon.style.display = 'block';

            // Mostra o botão de logout
            const logoutButton = document.getElementById('logoutButton');
            if (logoutButton) logoutButton.style.display = 'block';
        }
        const categories = await fetchCategories();
        updateCategorySelect(categories);

        const categorySelect = document.getElementById('category');
        categorySelect.addEventListener('change', async function () {
            clearSubCategorySelect();
            const selectedCategoryId = categorySelect.value;
            if (selectedCategoryId) {
                try {
                    const subCategories = await fetchSubCategories(selectedCategoryId);
                    console.log(subCategories);

                    updateSubCategorySelect(subCategories);
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            }
        });
        
        document.querySelector('#nextPage').addEventListener('click', () => {
            offset+= 12;
            fetchProducts(offset);
        });

        document.querySelector('#prevPage').addEventListener('click', () => {
            if (offset > 0) {
                offset-= 12;
                fetchProducts(offset);
            }
        });
        document.getElementById('filterForm').addEventListener('submit', function (event) {
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
            
            fetchProducts(offset, params)
        })
        fetchProducts()
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
});