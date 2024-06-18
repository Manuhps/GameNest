import { handleBanUser, handleUnbanUser, handleDeleteCategory, handleDeleteSubCategory, handleDeleteGenre, handleDeleteGameMode } from './adminHandlers.js';
import { addCategory } from '../../api/categories.js';
import { addGameMode } from '../../api/gameModes.js';
import { addGenre } from '../../api/genres.js';
import { addSubCategory } from '../../api/subCategories.js';
import { reloadTable } from './adminModal.js'; // Importing reloadTable function

export function populateAdminTable(data, type) {
    const tableHeader = document.getElementById('adminTableHeader');
    const tableBody = document.getElementById('adminTableBody');

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (data.length > 0) {
        // Create table headers
        const headers = Object.keys(data[0]);
        headers.forEach(header => {
            const th = document.createElement('th');
            th.innerText = header.charAt(0).toUpperCase() + header.slice(1);
            tableHeader.appendChild(th);
        });

        // Add Actions column
        const thActions = document.createElement('th');
        thActions.innerText = 'Actions';
        tableHeader.appendChild(thActions);

        // Create table rows
        data.forEach(item => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.innerText = item[header];
                tr.appendChild(td);
            });

            // Add Actions column
            const actionsTd = document.createElement('td');

            if (type === 'users') {
                const banButton = document.createElement('button');
                banButton.innerText = item.isBanned ? 'Unban' : 'Ban';
                banButton.className = 'btn btn-warning btn-sm';
                banButton.onclick = async () => {
                    try {
                        if (item.isBanned) {
                            await handleUnbanUser(item.userID, type);
                        } else {
                            await handleBanUser(item.userID, type);
                        }
                    } catch (error) {
                        console.error('Error banning/unbanning user:', error);
                        alert('Failed to update user status');
                    }
                };
                actionsTd.appendChild(banButton);
            } else {
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.onclick = async () => {
                    try {
                        switch (type) {
                            case 'categories':
                                await handleDeleteCategory(item.categoryID, type);
                                break;
                            case 'subCategories':
                                await handleDeleteSubCategory(item.subCategoryID, type);
                                break;
                            case 'genres':
                                await handleDeleteGenre(item.genreID, type);
                                break;
                            case 'gameModes':
                                await handleDeleteGameMode(item.gameModeID, type);
                                break;
                            default:
                                throw new Error('Unknown type');
                        }
                        // After deleting, reload the table
                        await reloadTable(type);
                    } catch (error) {
                        console.error('Error deleting item:', error);
                        alert('Failed to delete item');
                    }
                };
                actionsTd.appendChild(deleteButton);
            }

            tr.appendChild(actionsTd);
            tableBody.appendChild(tr);
        });
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = tableHeader.children.length;
        td.innerText = 'No data available';
        tr.appendChild(td);
        tableBody.appendChild(tr);
    }

    // Add input field and "Add" button only if it's not 'users' type
    if (type !== 'users') {
        const modalBody = document.querySelector('#adminModal .modal-body');

        // Check if there's already an existing container, and remove it if so
        const existingContainer = modalBody.querySelector('.admin-table-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        const container = document.createElement('div');
        container.className = 'admin-table-container text-center mt-3';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        if (type === 'categories') {
            nameInput.placeholder = `Enter new category name`;
        } else {
            nameInput.placeholder = `Enter new ${type.slice(0, -1)} name`;
        }
        nameInput.className = 'form-control mb-2';
        container.appendChild(nameInput);

        const addButton = document.createElement('button');
        if (type === 'categories') {
            addButton.innerText = `Add New Category`;
        } else {
            addButton.innerText = `Add New ${type.charAt(0).toUpperCase() + type.slice(1, -1)}`;
        }
        addButton.className = 'btn btn-primary btn-sm me-2';
        addButton.onclick = async () => {
            const itemName = nameInput.value.trim();
            if (itemName) {
                try {
                    switch (type) {
                        case 'categories':
                            await addCategory(itemName);
                            break;
                        case 'subCategories':
                            await addSubCategory(itemName);
                            break;
                        case 'genres':
                            await addGenre(itemName);
                            break;
                        case 'gameModes':
                            await addGameMode(itemName);
                            break;
                        default:
                            throw new Error('Unknown type');
                    }
                    await reloadTable(type);
                    nameInput.value = ''; // Clear input value after adding
                } catch (error) {
                    console.error('Error adding item:', error);
                    alert('Failed to add item');
                }
            } else {
                alert('Please enter a valid name for the new item.');
            }
        };
        container.appendChild(addButton);

        modalBody.appendChild(container);
    }
}