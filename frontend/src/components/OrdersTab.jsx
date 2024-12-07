import {useContext, useEffect, useState} from "react";
import {ordersApi} from "@/api/orders.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {AppContext} from "@/AppContext.jsx";
import {complaintsApi} from "@/api/complaints.js";
import {Toast} from "@/utils/toast.js";

export default function OrdersTab({isOwnProfile, userId}) {
    const {role} = useContext(AppContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [complaintDescription, setComplaintDescription] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    

    const loadOrders = async () => {
        try {
            const url = window.location.pathname;
            const response =
                (role === "customer" || (role === "admin" && url.startsWith("/customer/")))
                    ? await ordersApi.getOrdersByCustomerId(userId)
                    : await ordersApi.getOrdersBySpecialistId(userId);

            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (orderId) => {
        try {
            await ordersApi.cancelOrder(orderId);
            loadOrders();
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };

    const handleComplete = async (orderId) => {
        try {
            await ordersApi.completeOrder(orderId);
            loadOrders();
        } catch (error) {
            console.error("Error completing order:", error);
        }
    };

    const handleSendComplaint = async () => {
        if (!complaintDescription.trim() || !selectedOrder) return;
        try {
            const complaint = {
                order_id: selectedOrder.order_id,
                customer_id: selectedOrder.customer.customer_id,
                specialist_id: selectedOrder.specialist.specialist_id,
                description: complaintDescription.trim(),
            };
            await complaintsApi.createComplaint(complaint);
            Toast.success("Жалоба успешно отправлена!");
            setShowComplaintForm(false);
            setComplaintDescription("");
            setSelectedOrder(null);
        } catch (error) {
            console.error("Error sending complaint:", error);
            Toast.error("Не удалось отправить жалобу.");
        }
    };

    useEffect(() => {
        if (isOwnProfile) {
            loadOrders();
        }
    }, [isOwnProfile]);

    if (!isOwnProfile) return null;

    if (loading) return <Skeleton count={5}/>;

    const statuses = {
        "created": "Создан",
        "cancelled": "Отменен",
        "completed": "Завершен"
    }

    return (
        <div className="orders-tab">
            <h2 className="font-bold text-2xl mb-4">Мои заказы</h2>
            {orders.length === 0 ? (
                <p>Заказы отсутствуют</p>
            ) : (
                <ul className="order-list">
                    {orders.map((order) => (
                        <li key={order.order_id} className="border p-2 mb-2">
                            <p><strong>Адрес:</strong> {order.address}</p>
                            <p><strong>Дата:</strong> {new Date(order.scheduled_time).toLocaleString()}</p>
                            <p><strong>Цена:</strong> {order.price}₽</p>
                            <p><strong>Описание:</strong> {order.description}</p>
                            <p><strong>Статус:</strong> {statuses[order.status]}</p>
                            <p><strong>Последнее обновление:</strong> {new Date(order.updated_at).toLocaleString()}</p>
                            <div className="flex gap-2 mt-2">
                                {role === "customer" && (
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowComplaintForm(true);
                                        }}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Пожаловаться
                                    </button>
                                )}
                                {order.status === "created" && (
                                    <>
                                        <button
                                            onClick={() => handleCancel(order.order_id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Отменить заказ
                                        </button>
                                        <button
                                            onClick={() => handleComplete(order.order_id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                        >
                                            Завершить
                                        </button>
                                    </>)}
                            </div>

                        </li>
                    ))}
                </ul>
            )}

            {showComplaintForm && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-4">Подать жалобу</h3>
                        <textarea
                            className="w-full p-2 border rounded mb-4"
                            rows="4"
                            placeholder="Опишите вашу жалобу"
                            value={complaintDescription}
                            onChange={(e) => setComplaintDescription(e.target.value)}
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => {
                                    setShowComplaintForm(false);
                                    setComplaintDescription("");
                                    setSelectedOrder(null);
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleSendComplaint}
                            >
                                Отправить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
