import { getDiscounts, delDiscount } from '../api/products.js';

export async function populateDiscountTable(productId) {
    try {
        const discounts = await getDiscounts(productId);
        const discountTableBody = document.getElementById('discountTableBody');

        discountTableBody.innerHTML = '';
        discounts.data.forEach((discount) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${discount.percentage}</td>
                <td>${discount.startDate}</td>
                <td>${discount.endDate}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-discount-btn" data-id="${discount.discountID}">Delete</button>
                </td>
            `;
            discountTableBody.appendChild(row);
        });

        // Attach event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-discount-btn');
        deleteButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                const discountId = button.dataset.id;
                try {
                    await delDiscount(productId, discountId);
                    await populateDiscountTable(productId);
                } catch (error) {
                    console.error('Error deleting discount:', error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching discounts:', error);
    }
};