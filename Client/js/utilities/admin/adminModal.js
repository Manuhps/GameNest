import { populateAdminTable } from './adminUtils.js';

export async function openAdminModal(title, getData) {
    const modalTitle = document.getElementById('adminModalLabel');
    const tableHeader = document.getElementById('adminTableHeader');
    const tableBody = document.getElementById('adminTableBody');

    modalTitle.innerText = `Manage ${title}`;
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    try {
        const data = await getData();
        populateAdminTable(data);
    } catch (error) {
        console.error(`Error loading ${title.toLowerCase()}:`, error);
        alert(`Failed to load ${title.toLowerCase()}`);
    }

    // Show the modal
    const adminModal = new bootstrap.Modal(document.getElementById('adminModal'));
    adminModal.show();
}