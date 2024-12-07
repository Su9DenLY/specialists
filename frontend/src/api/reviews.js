import axios from "axios";

class ReviewsApiService {
    constructor() {
        this.url = "http://localhost:8000/reviews/";
    }

    getReviewsBySpecialistId(id) {
        return axios.get(`${this.url}${id}`)
    }

    postReview(review) {
        const token = localStorage.getItem("accessToken");
        return axios.post(`${this.url}`, review, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    }
}

export const reviewsApi = new ReviewsApiService();
