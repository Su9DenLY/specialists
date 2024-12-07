import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {reviewsApi} from "../api/reviews.js";
import {AppContext} from "../AppContext.jsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SpecialistReviews() {
    const {id: specialistId} = useParams();
    const {user, role} = useContext(AppContext);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [loading, setLoading] = useState(true);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const res = await reviewsApi.getReviewsBySpecialistId(specialistId);
            setReviews(res.data);
        } catch (error) {
            console.error("Error loading reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.trim()) return;
        try {
            await reviewsApi.postReview({specialist_id: specialistId, text: newReview});
            setNewReview("");
            loadReviews();
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [specialistId]);

    return (
        <div className="mt-10">
            <h2 className="font-bold text-2xl mb-4">Отзывы</h2>
            {loading ? (
                <Skeleton count={3}/>
            ) : reviews.length ? (
                <ul className="space-y-4">
                    {reviews.map(({review_id, text, created_at}) => (
                        <li key={review_id} className="p-4 border rounded">
                            <p>{text}</p>
                            <span
                                className="text-gray-500 text-sm">Создан: {new Date(created_at).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Нет отзывов</p>
            )}
            {role === "customer" && user && (
                <form onSubmit={handleReviewSubmit} className="mt-6">
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Напишите отзыв..."
                        className="w-full p-2 border rounded"
                        rows="4"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
                    >
                        Оставить отзыв
                    </button>
                </form>
            )}
            {!user && (
                <p className="text-red-500 mt-4">Только авторизованные пользователи могут оставлять отзывы.</p>
            )}
        </div>
    );
}
