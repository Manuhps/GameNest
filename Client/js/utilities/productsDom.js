export function displayProducts(products, pagination) {
    const limit = 12;
    let productCards = '';

    products.slice(0, limit).forEach(product => {
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

    if (pagination) {
        const { totalPages, currentPage } = pagination;

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
