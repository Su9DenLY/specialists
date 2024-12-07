import axios from "axios";

class ComplaintsApiService {
    constructor() {
        this.url = "http://localhost:8000/complaints/"
    }

    createComplaint(complaint) {
        const token = localStorage.getItem("accessToken");
        return axios.post(this.url, complaint, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }

    getComplaintsBySpecialistId(id) {
        const token = localStorage.getItem("accessToken");
        return axios.get(`${this.url}${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export const complaintsApi = new ComplaintsApiService();
