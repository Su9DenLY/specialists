import {useParams} from "react-router-dom";
import {useEffect, useState, useContext} from "react";
import {customersApi} from "../api/customers.js";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {AppContext} from "@/AppContext.jsx";
import OrdersTab from "@/components/OrdersTab.jsx";
import {formatDate} from "@/utils/lib.js";

export default function CustomerProfile() {
    const {id} = useParams();
    const {user, role} = useContext(AppContext);
    const [customer, setCustomer] = useState(null);
    const [loadingCustomer, setLoadingCustomer] = useState(true);

    const loadCustomer = async () => {
        try {
            const response = await customersApi.getUserById(id);
            setCustomer(response.data);
        } catch (error) {
            console.error("Error fetching customer data:", error);
        } finally {
            setLoadingCustomer(false);
        }
    };

    useEffect(() => {
        loadCustomer();
    }, [id]);

    if (loadingCustomer) {
        return <Skeleton count={5} height={30}/>;
    }

    if (!customer) {
        return <p>Не удалось загрузить профиль клиента</p>;
    }

    const isOwnProfile = (user === id || role === "admin");

    return (
        <div>
            <h1>Профиль клиента</h1>
            <div className="w-fit">
                <span className="font-bold text-3xl">
                    {customer.first_name} {customer.last_name || <Skeleton/>}
                </span>
                <div className="flex flex-col">
                    <span><strong>Почта:</strong> {customer.email || <Skeleton width={200}/>}</span>
                    <span><strong>Телефон:</strong> {customer.phone || <Skeleton width={200}/>}</span>
                    <span><strong>День рождения:</strong> {customer.birth_date ? formatDate(customer.birth_date) :
                        <Skeleton width={200}/>}</span>
                    <span><strong>На сервисе с</strong> {customer.created_at ? formatDate(customer.created_at) :
                        <Skeleton width={200}/>}</span>
                </div>
            </div>
            <OrdersTab
                isOwnProfile={isOwnProfile}
                userId={id}
            />
        </div>
    );
}
