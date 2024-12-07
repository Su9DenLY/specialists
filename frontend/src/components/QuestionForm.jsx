import {useState} from "react";
import {questionsApi} from "@/api/questions.js";
import {Toast} from "@/utils/toast.js";

export default function QuestionForm() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !topic || !description) {
            Toast.info("Все поля обязательны для заполнения.");
            return;
        }

        const question = {user_email: email, topic, description};

        try {
            setLoading(true);
            await questionsApi.createQuestion(question);
            Toast.success("Ваш вопрос успешно отправлен!");
            setEmail("");
            setTopic("");
            setDescription("");
            setIsVisible(false);
        } catch (error) {
            console.error(error);
            Toast.error("Не удалось отправить вопрос.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4">
            {!isVisible ? (
                <button
                    onClick={() => setIsVisible(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
                >
                    Задать вопрос
                </button>
            ) : (
                <div className="bg-white border rounded-lg shadow-lg p-4 w-72 animate-slideUp">
                    <h3 className="text-lg font-bold mb-4">Задать вопрос</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">
                                Почта для связи
                            </label>
                            <input
                                type="email"
                                className="w-full border rounded px-2 py-1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">
                                Тема вопроса
                            </label>
                            <input
                                type="text"
                                className="w-full border rounded px-2 py-1"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium mb-1">
                                Описание
                            </label>
                            <textarea
                                className="w-full border rounded px-2 py-1"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsVisible(false)}
                                className="bg-gray-300 text-black px-3 py-1 rounded"
                                disabled={loading}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                disabled={loading}
                            >
                                {loading ? "Отправка..." : "Отправить"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
