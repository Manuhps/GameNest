export async function fetchProducts(offset = 0, params = null) {
    const limit = 12; 
    let url = `http://127.0.0.1:8080/products?offset=${offset}&limit=${limit}`;

    if (params != null) {
        const queryString = new URLSearchParams(params).toString();
        url += `&${queryString}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (data && data.data) {
            const products = data.data.slice(0, limit);
            let productCards = '';
            products.forEach(product => {
                productCards += `
                    <div class="col mb-5">
                        <div class="card h-100">
                            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Popular</div>
                            <img class="card-img-top" src="${product.img}" alt="${product.name}" />
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <h5 class="fw-bolder">${product.name}</h5>
                                    <span id="sale-price">${product.curPrice}</span>
                                    <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="./html/products.html?id=${product.productID}">View options</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            const container = document.querySelector('.row.gx-4.gx-lg-5.row-cols-2.row-cols-md-3.row-cols-xl-4.justify-content-center');
            container.innerHTML = productCards;

            if (data.pagination) {
                const { totalPages, currentPage } = data.pagination;

                let paginationLinks = '';
                for (let i = 1; i <= totalPages; i++) {
                    const activeClass = i === currentPage ? 'active' : '';
                    paginationLinks += `<a href="?page=${i}" class="${activeClass}">${i}</a>`;
                }

                const paginationContainer = document.querySelector('#paginationContainer');
                if (paginationContainer) {
                    paginationContainer.innerHTML = paginationLinks;
                }
            }
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
