import axios from "axios";

class QuestionsApiService {
    constructor() {
        this.url = "http://localhost:8000/questions/"
    }

    createQuestion(question) {
        return axios.post(this.url, question)
    }

    getQuestions() {
        const token = localStorage.getItem("accessToken");
        return axios.get(this.url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export const questionsApi = new QuestionsApiService();
