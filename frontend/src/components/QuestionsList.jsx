import React, {useState, useEffect} from 'react';
import {questionsApi} from "@/api/questions.js";

export default function QuestionsList({}) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await questionsApi.getQuestions();
                setQuestions(response.data);
            } catch (error) {
                setError(`Ошибка при загрузке вопросов: ${error.response?.data?.detail || error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) {
        return <p>Загрузка вопросов...</p>;
    }

    if (error) {
        return <p style={{color: 'red'}}>{error}</p>;
    }

    if (questions.length === 0) {
        return <p>Вопросы отсутствуют.</p>;
    }

    return (
        <div style={{marginTop: '20px'}}>
            <h2>Список вопросов</h2>
            <ul style={{listStyle: 'none', padding: 0}}>
                {questions.map((question) => (
                    <li
                        key={question.question_id}
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            padding: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        <strong>Тема:</strong> {question.topic} <br/>
                        <strong>Email пользователя:</strong> {question.user_email} <br/>
                        <strong>Описание:</strong> {question.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};
