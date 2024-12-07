import axios from "axios";

class SpecialistsApiService {
    constructor() {
        this.url = 'http://localhost:8000/specialists'
    }

    login(user) {
        return axios.post(`${this.url}/login`, user)
    }

    register(user) {
        return axios.post(`${this.url}/register`, user)
    }

    getSpecialists() {
        return axios.get(this.url)
    }

    getSpecialistsBySpeciality(speciality) {
        return axios.get(`${this.url}/speciality/${speciality}`)
    }

    getSpecialistsById(id) {
        return axios.get(`${this.url}/specialist/${id}`)
    }
}

export const specialistsApi = new SpecialistsApiService();
