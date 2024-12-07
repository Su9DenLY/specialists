import {useParams} from "`react-router-dom`";
import {useContext, useEffect, useState} from "react";
import {specialistsApi} from "../api/specialists.js";
import {formatDate} from "../utils/lib.js";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SpecialistReviews from "@/components/SpecialistReviews.jsx";
import OrdersTab from "@/components/OrdersTab.jsx";
import CreateOrderForm from "@/components/CreateOrderForm.jsx";
import {AppContext} from "@/AppContext.jsx";
import ComplaintsTab from "@/components/ComplaintsTab.jsx";
import SpecialistSpecialities from "@/components/SpecialistSpecialities.jsx";

export default function SpecialistProfile() {
    const {id: specialistId} = useParams();
    const {user, role} = useContext(AppContext);
    const [specialist, setSpecialist] = useState([]);
    const [creating, setCreating] = useState(false);

    const loadSpecialist = async () => {
        try {
            const res = await specialistsApi.getSpecialistsById(specialistId)
            setSpecialist(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        loadSpecialist();
    }, [])

    const isOwnProfile = (user === specialistId || role === "admin");

    return (
        <div className="relative">
            <h1>Профиль специалиста</h1>
            <div className="flex flex-row gap-10">
                <div className="w-fit">
                <span className="font-bold text-3xl">
                    {specialist?.first_name} {specialist?.last_name || <Skeleton/>}
                </span>
                    <div className="flex flex-col">
                        <span><strong>Почта:</strong> {specialist?.email || <Skeleton width={200}/>}</span>
                        <span><strong>Телефон:</strong> {specialist?.phone || <Skeleton width={200}/>}</span>
                        <span><strong>День рождения:</strong> {specialist?.birth_date ? formatDate(specialist?.birth_date) :
                            <Skeleton width={200}/>}</span>
                        <span><strong>На сервисе с</strong> {specialist?.created_at ? formatDate(specialist?.created_at) :
                            <Skeleton width={200}/>}</span>
                        {specialist?.experience ?
                            <span><strong>Опыт:</strong> ${specialist?.experience ||
                                <Skeleton width={200}/>}</span> : null}
                        {specialist?.rating ?
                            <span><strong>Рейтинг:</strong> ${specialist?.rating ||
                                <Skeleton width={200}/>}</span> : null}
                        {specialist?.description ?
                            <span><strong>Описание:</strong><br/> ${specialist?.description || <Skeleton width={200}/>}</span> : null}
                    </div>
                </div>
                {role === "customer" && <button className="w-fit h-fit rounded-3xl py-1 px-5 bg-purple-300"
                                                onClick={() => setCreating(true)}>Создать заказ</button>}
            </div>
            <SpecialistSpecialities specialistId={specialistId}/>
            <SpecialistReviews/>
            {role === "customer" && creating && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <CreateOrderForm customerId={user} specialistId={specialistId} setCreating={setCreating}/>
                </div>
            )}
            <OrdersTab isOwnProfile={isOwnProfile} userId={specialistId}/>
            {(role === "admin" || isOwnProfile) && (
                <ComplaintsTab specialistId={specialistId}/>
            )}
        </div>
    );
}
