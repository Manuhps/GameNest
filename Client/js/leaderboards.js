import { getMostOrders, getMostSpent, getMostReviews } from "./api/leaderboards.js";
import { loadNavbar } from "./utilities/navbar.js";
document.addEventListener('DOMContentLoaded', async function () {
    loadNavbar('navbarContainer');

    try {
        const mostSpent = await getMostSpent();
        const mostOrders = await getMostOrders();
        const mostReviews = await getMostReviews();

        function populateTable(leaderboardData, tableBodyId, scoreKey) {
            const tableBody = document.getElementById(tableBodyId);
            tableBody.innerHTML = ''; // Clear any existing rows
            leaderboardData.forEach((item, index) => {
                const row = `
                    <tr>
                        <th scope="row">${index + 1}</th>
                        <td>${item.username}</td>
                        <td>${item[scoreKey]}</td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        }

        populateTable(mostSpent.data, 'mostSpentBody', 'totalSpent');
        populateTable(mostOrders.data, 'mostOrdersBody', 'totalOrders');
        populateTable(mostReviews.data, 'mostReviewsBody', 'totalReviews');
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
});