import { handleUsers, handleCategories, handleSubCategories, handleGenres, handleGameModes } from './adminHandlers.js';

export async function openAdminModal(title, getData) {
    const modalTitle = document.getElementById('adminModalLabel');
    const tableHeader = document.getElementById('adminTableHeader');
    const tableBody = document.getElementById('adminTableBody');

    modalTitle.innerText = `Manage ${title}`;
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    try {
        const data = await getData();
    } catch (error) {
        console.error(`Error loading ${title.toLowerCase()}:`, error);
        alert(`Failed to load ${title.toLowerCase()}`);
    }

    // Show the modal
    const adminModal = new bootstrap.Modal(document.getElementById('adminModal'));
    adminModal.show();
}

export async function reloadTable(type) {
    switch (type) {
        case 'users':
            await handleUsers();
            break;
        case 'categories':
            await handleCategories();
            break;
        case 'subCategories':
            await handleSubCategories();
            break;
        case 'genres':
            await handleGenres();
            break;
        case 'gameModes':
            await handleGameModes();
            break;
        default:
            throw new Error('Unknown type');
    }
}