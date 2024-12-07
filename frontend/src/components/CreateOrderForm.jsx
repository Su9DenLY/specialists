import {useState} from "react";
import {ordersApi} from "@/api/orders.js";
import {Toast} from "@/utils/toast.js";

export default function CreateOrderForm({customerId, specialistId, setCreating}) {
    const [form, setForm] = useState({
        address: "",
        scheduled_time: "",
        price: 0,
        description: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ordersApi.createOrder({
                ...form,
                customer_id: customerId,
                specialist_id: specialistId,
                status: "created",
            });
            Toast.success("Заказ успешно создан!");
            setForm({address: "", scheduled_time: "", price: 0, description: ""});
            setCreating(false);
        } catch (error) {
            console.error(error);
            Toast.error("Ошибка создания заказа");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center bg-white p-6 rounded shadow-lg w-1/3">
            <h2>Создать заказ</h2>
            <div className="flex flex-col items-center">
                <label>Адрес</label>
                <input
                    type="text"
                    name="address"
                    value={form.address}
                    className="w-64 border border-gray-800"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col items-center">
                <label>Дата и время</label>
                <input
                    type="datetime-local"
                    name="scheduled_time"
                    value={form.scheduled_time}
                    className="w-64 border border-gray-800 text-center"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col items-center">
                <label>Цена</label>
                <input
                    type="number"
                    name="price"
                    value={form.price}
                    className="w-64 border border-gray-800"
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex flex-col items-center">
                <label>Описание</label>
                <textarea
                    name="description"
                    value={form.description}
                    className="w-64 border border-gray-800"
                    rows={4}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="flex gap-2 justify-end">
                <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setCreating(false)}>
                    Отмена
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded"
                        type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Создание..." : "Создать"}
                </button>
            </div>
        </form>
    );
}
