import axios from "axios";

class CustomersApiService {
    constructor() {
        this.url = 'http://localhost:8000/customers'
    }

    login(user) {
        return axios.post(`${this.url}/login`, user)
    }

    register(user) {
        return axios.post(`${this.url}/register`, user)
    }

    getUserById(id) {
        return axios.get(`${this.url}/${id}`)
    }
}

export const customersApi = new CustomersApiService();
