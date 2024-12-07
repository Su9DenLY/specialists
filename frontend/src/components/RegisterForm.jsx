import {useContext, useState} from "react";
import {AppContext} from "../AppContext.jsx";
import {customersApi} from "../api/customers.js";
import {specialistsApi} from "../api/specialists.js";
import {Toast} from "../utils/toast.js";


export default function RegisterForm({setLogin}) {
    const {role} = useContext(AppContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
        birth_date: "",
    });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            birth_date: new Date(formData.birth_date).toISOString(),
        };

        try {
            const api = role === "customer" ? customersApi : specialistsApi;
            await api.register(formattedData);
            setLogin(true)
            setFormData({
                email: "",
                password: "",
                first_name: "",
                last_name: "",
                phone: "",
                birth_date: "",
            })
            Toast.info("Вы успешно зарегистрировались")
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-5 bg-purple-100 w-2/3 h-fit pb-10 mb-10 items-center">
            <span className="mt-5">
                {role === "customer" ? "Регистрация для клиентов" : "Регистрация для специалистов"}
            </span>
            <form
                className="flex flex-col items-center justify-center gap-8 w-full"
                onSubmit={handleRegister}
            >
                {[
                    {label: "Почта", name: "email", type: "email"},
                    {label: "Пароль", name: "password", type: "password"},
                    {label: "Имя", name: "first_name", type: "text"},
                    {label: "Фамилия", name: "last_name", type: "text"},
                    {label: "Телефон", name: "phone", type: "text"},
                    {label: "Дата рождения", name: "birth_date", type: "date"},
                ].map(({label, name, type}) => (
                    <div key={name} className="flex flex-col items-center">
                        <label htmlFor={name}>{label}</label>
                        <input
                            type={type}
                            id={name}
                            name={name}
                            value={formData[name]}
                            onChange={handleInputChange}
                            className="w-52 p-0.5"
                            required
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                    Зарегистрироваться
                </button>
            </form>
        </div>
    );
}
