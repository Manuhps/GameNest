export async function fetchCategories() {
    try {
        const response = await axios.get('http://127.0.0.1:8080/categories')
        return response.data.data
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export function updateCategorySelect(categories) {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="none">None</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.categoryID;
        option.textContent = category.categoryName;
        categorySelect.appendChild(option);
    })
}
