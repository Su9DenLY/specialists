import axios from "axios";

class OrdersApiService {
    constructor() {
        this.url = "http://localhost:8000/orders/"
    }

    createOrder(order) {
        const token = localStorage.getItem("accessToken");
        return axios.post(`${this.url}`, order, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }

    cancelOrder(id) {
        const token = localStorage.getItem("accessToken");
        return axios.patch(`${this.url}${id}/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }

    completeOrder(id) {
        const token = localStorage.getItem("accessToken");
        return axios.patch(`${this.url}${id}/complete`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }

    getOrdersByCustomerId(id) {
        const token = localStorage.getItem("accessToken");
        return axios.get(`${this.url}customer/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }

    getOrdersBySpecialistId(id) {
        const token = localStorage.getItem("accessToken");
        return axios.get(`${this.url}specialist/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }
}

export const ordersApi = new OrdersApiService();
