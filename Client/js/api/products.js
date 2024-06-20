import api from './axiosConfig.js'
const BASE_URL = 'http://127.0.0.1:8080/products'

export async function fetchProducts(offset = 0, params = null) {
    const limit = 12;
    let url = `${BASE_URL}?offset=${offset}&limit=${limit}`;

    if (params != null) {
        const queryString = new URLSearchParams(params).toString();
        url += `&${queryString}`;
    }
    try {
        const response = await api.get(url);
        return response.data
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

export async function fetchProductById(productId) {
    const url = `${BASE_URL}/${productId}`;
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error Fetching Product:', error);
        throw error;
    }
}

export async function addProduct(name, desc, basePrice, stock, categoryID = null, img = null, genres = null, gameModes = null, platform = null, subCategoryID = null) {
    try {
        const response = await api.post(BASE_URL, {
            name,
            desc,
            basePrice,
            stock,
            categoryID,
            platform,
            img,
            genres,
            gameModes,
            subCategoryID
        },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error Adding Product:', error);
        throw error;
    }
}

export async function delProduct(productID) {
    try {
        const response = await api.delete(`${BASE_URL}/${productID}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

export async function getDiscounts(productID) {
    try {
        const response = await api.get(`${BASE_URL}/${productID}/discounts`);
        return response.data
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

export async function addDiscount(productID, percentage, startDate, endDate) {
    try {
        const response = await api.post(`${BASE_URL}/${productID}/discounts`, {
            productID,
            percentage,
            startDate,
            endDate
        },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error Adding Discount:', error);
        throw error;
    }
}

export async function delDiscount(productID, discountID) {
    try {
        const response = await api.delete(`${BASE_URL}/${productID}/discounts/${discountID}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error deleting discount:', error);
        throw error;
    }
}

export async function editProduct(productID, updateData) {
    try {
        const response = await api.patch(`${BASE_URL}/${productID}`,
            updateData,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error Updating Product:', error);
        throw error;
    }
}

export async function getReviews(productID) {
    try {
        const response = await api.get(`${BASE_URL}/${productID}/reviews`);
        return response.data
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

export async function addReview(productID, reviewData) {
    try {
        const response = await api.post(`${BASE_URL}/${productID}/reviews`,
            reviewData,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            }
        );
        return response.data
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

export async function delComment(productID, reviewID) {
    try {
        const response = await api.delete(`${BASE_URL}/${productID}/reviews/${reviewID}/comment`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
        return response.data;
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Error deleting comment')
        throw error;
    }
}