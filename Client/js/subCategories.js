export async function fetchSubCategories(categoryID) {
    try {
        const response = await axios.get(`http://127.0.0.1:8080/categories/${categoryID}/subCategories`);
        console.log(`http://127.0.0.1:8080/categories/${categoryID}/subCategories`);
        return response.data.data
    } catch (error) {
        console.error('Error fetching subCategories:', error);
        throw error;
    }
}
export function updateSubCategorySelect(subCategories) {
    const subCategorySelect = document.getElementById('subCategory');
    subCategorySelect.innerHTML = '<option value="none">None</option>';
    subCategories.forEach(subCategory => {
        const option = document.createElement('option');
        option.value = subCategory.subCategoryID;
        option.textContent = subCategory.subCategoryName;
        subCategorySelect.appendChild(option);
    });
}
export function clearSubCategorySelect() {
    const subCategorySelect = document.getElementById('subCategory');
    subCategorySelect.innerHTML = '';
}
