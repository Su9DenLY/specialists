import React, {useState} from 'react';
import {specialitiesApi} from "@/api/specialities.js";
import QuestionsList from "@/components/QuestionsList.jsx";


export default function AdminProfile({}) {
    const [specialityTitle, setSpecialityTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAddSpeciality = async () => {
        if (!specialityTitle.trim()) {
            setMessage('Название специальности не может быть пустым!');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await specialitiesApi.createSpecialities({title: specialityTitle});
            setMessage(`Специальность добавлена: ${response.data.title}`);
            setSpecialityTitle('');
        } catch (error) {
            setMessage(`Ошибка при добавлении специальности: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
            <h1>Профиль администратора</h1>

            <div style={{marginBottom: '40px', textAlign: 'center'}}>
                <h2>Добавление специальности</h2>
                <input
                    type="text"
                    placeholder="Название специальности"
                    value={specialityTitle}
                    onChange={(e) => setSpecialityTitle(e.target.value)}
                    style={{padding: '10px', width: '100%', marginBottom: '10px'}}
                />
                <button
                    onClick={handleAddSpeciality}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                >
                    {loading ? 'Добавление...' : 'Добавить специальность'}
                </button>
                {message && (
                    <p style={{marginTop: '20px', color: message.includes('Ошибка') ? 'red' : 'green'}}>
                        {message}
                    </p>
                )}
            </div>

            <QuestionsList/>
        </div>
    );
};
