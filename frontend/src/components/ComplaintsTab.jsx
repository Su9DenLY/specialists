import {useContext, useEffect, useState} from "react";
import {complaintsApi} from "@/api/complaints.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {AppContext} from "@/AppContext.jsx";

export default function ComplaintsTab({specialistId}) {
    const {role, user} = useContext(AppContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadComplaints = async () => {
        try {
            const response = await complaintsApi.getComplaintsBySpecialistId(specialistId);
            setComplaints(response.data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role === "admin" || user === specialistId) {
            loadComplaints();
        }
    }, [role, user, specialistId]);

    if (loading) return <Skeleton count={5}/>;

    return (
        <div className="complaints-tab">
            <h2 className="font-bold text-2xl mb-4">Жалобы</h2>
            {complaints.length ? (
                <ul className="complaint-list">
                    {complaints.map((complaint) => (
                        <li key={complaint.complaint_id} className="border p-4 mb-2">
                            <p><strong>Жалоба:</strong> {complaint.description}</p>
                            <p><strong>Создана:</strong> {new Date(complaint.created_at).toLocaleString()}</p>
                            <p><strong>Клиент:</strong> {complaint.customer.first_name}</p>
                            <p><strong>Заказ:</strong> {complaint.order.address}</p>
                            <p><strong>Дата заказа:</strong> {new Date(complaint.order.scheduled_time).toLocaleString()}
                            </p>
                            <p><strong>Статус заказа:</strong> {complaint.order.status}</p>
                        </li>
                    ))}
                </ul>
            ) : <p>Жалобы отсутствуют</p>}
        </div>
    );
}
