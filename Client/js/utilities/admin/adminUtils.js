export function populateAdminTable(data) {
    const tableHeader = document.getElementById('adminTableHeader');
    const tableBody = document.getElementById('adminTableBody');

    if (data.length > 0) {
        // Create table headers
        const headers = Object.keys(data[0]);
        headers.forEach(header => {
            const th = document.createElement('th');
            th.innerText = header.charAt(0).toUpperCase() + header.slice(1);
            tableHeader.appendChild(th);
        });

        // Create table rows
        data.forEach(item => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.innerText = item[header];
                tr.appendChild(td);
            });
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
}