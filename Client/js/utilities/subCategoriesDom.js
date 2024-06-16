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