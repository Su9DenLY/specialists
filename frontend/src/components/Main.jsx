import SpecialitiesList from "./SpecialitiesList.jsx";

export default function Main() {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex flex-col">
                <span className="font-sans text-5xl font-bold pl-4 pt-4 pb-2">
                    На сервисе найдется любой специалист
                </span>
                <span className="font-sans text-2xl pl-4 pt-2 pb-2">
                    Наш слоган: "Быстро. Комфортно. Качественно"
                </span>
            </div>
            <SpecialitiesList/>
        </div>
    )
}
