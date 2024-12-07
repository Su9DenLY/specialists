import axios from "axios";

class SpecialitiesApiService {
    constructor() {
        this.url = 'http://localhost:8000/specialities/'
    }

    getSpecialities() {
        return axios.get(this.url);
    }

    createSpecialities(data) {
        const token = localStorage.getItem("accessToken");
        return axios.post(this.url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }

    getSpecialitiesBySpecialistId(specialistId) {
        return axios.get(`${this.url}${specialistId}`)
    }

    deleteRelationSpecialistSpeciality(specialistId, specialityId) {
        const token = localStorage.getItem("accessToken");
        return axios.delete(`${this.url}${specialistId}/${specialityId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }

    createRelationSpecialistSpeciality(specialistId, specialityId) {
        const token = localStorage.getItem("accessToken");
        return axios.post(`${this.url}${specialistId}/${specialityId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    }
}

export const specialitiesApi = new SpecialitiesApiService();
