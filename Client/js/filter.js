fetch('http://127.0.0.1:8080/')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let selectElement = document.getElementById('category');
        if (data.categories) { // Check if data.categories is not undefined
            let optionsHTML = '';
            data.categories.forEach(category => {
                optionsHTML += `<option value="${category.categoryID}">${category.categoryName}</option>`;
            });
            selectElement.innerHTML = optionsHTML;
        } else {
            console.error('Categories not found in the response');
        }
    })
    .catch(error => console.error('Erro:', error));


    document.getElementById('price-filter').addEventListener('input', function(event) {
        const maxPrice = event.target.value;
        fetchProducts(maxPrice);
    });
    
    function fetchProducts(maxPrice) {
        fetch(`http://127.0.0.1:8080/products?maxPrice=${maxPrice}`)
            .then(response => response.json())
            .then(data => {
                // Handle the data as before
            })
            .catch(error => console.error('Erro:', error));
    }