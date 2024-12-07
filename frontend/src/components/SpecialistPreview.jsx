import {formatDate} from "../utils/lib.js";
import {useNavigate} from "react-router-dom";

export default function SpecialistPreview({specialistData}) {
    const navigate = useNavigate();

    return (
        <div className="w-full h-fit hover:cursor-pointer border-black border p-7 bg-purple-100 hover:bg-purple-300"
             onClick={() => navigate(`/specialists/${specialistData?.user_id}`)}>
            <span className="font-bold text-3xl">
                {specialistData?.first_name} {specialistData?.last_name}
            </span>
            <div>
                Почта: {specialistData?.email}<br/>
                Телефон: {specialistData?.phone}<br/>
                День рождения: {formatDate(specialistData?.birth_date)}<br/>
                На сервисе с {formatDate(specialistData?.created_at)}<br/>
                {specialistData?.experience ? `Опыт: ${specialistData?.experience}\n` : null}
                {specialistData?.rating ? `Опыт: ${specialistData?.rating}\n` : null}
                {specialistData?.description ? `Опыт: ${specialistData?.description}\n` : null}
            </div>
        </div>
    )
}
