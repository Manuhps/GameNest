import api from './axiosConfig.js'
const BASE_URL = 'http://127.0.0.1:8080/orders'

export async function fetchOrders() {
    try {
        const response = await api.get(BASE_URL ,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function addOrder(products) {
    try {
        const response = await api.post(BASE_URL, { 
            products
        },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

export async function getMyOrders() {
    try {
        const response = await api.get(`${BASE_URL}/me`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export async function getCurrent() {
    try {
        const response = await api.get(`${BASE_URL}/current`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export async function getOrderProducts() {
    try {
        const response = await api.get(`${BASE_URL}/current/orderProducts`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

export async function updateOrder(products) {
    try {
        const response = await api.patch(`${BASE_URL}/current`,
            {
                products
            },
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            }
        );
        return response.data
    } catch (error) {
        console.error('Error updating current order:', error);
        throw error;
    }
}

export async function incrementProduct(productID) {
    return api.patch(`${BASE_URL}/current/products/${productID}`, { action: "increment"},
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
}

export async function decrementProduct(productID) {
    return api.patch(`${BASE_URL}/current/products/${productID}`, { action: "decrement"},
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
}

export async function delOrderProduct(productID){
    try {
        const response = await api.delete(`${BASE_URL}/current/products/${productID}`,
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


