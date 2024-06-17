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