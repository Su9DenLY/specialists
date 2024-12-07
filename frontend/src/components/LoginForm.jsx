import {useContext, useState} from "react";
import {AppContext} from "../AppContext.jsx";
import {customersApi} from "../api/customers.js";
import {specialistsApi} from "../api/specialists.js";
import {useNavigate} from "react-router-dom";
import jwtDecode from "jwt-decode";


export default function LoginForm() {
    const {role, setUser, setRole} = useContext(AppContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const user = {email, password, role};

        try {
            const api = role === "customer" ? customersApi : specialistsApi;
            const response = await api.login(user);
            setUser(jwtDecode(response.data.access_token).user_id);
            setRole(jwtDecode(response.data.access_token).role)
            localStorage.setItem("accessToken", response.data.access_token);
            navigate("/")
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-5 bg-purple-100 w-2/3 h-fit pb-10 items-center">
            <span className="mt-5">
                {role === "customer" ? "Вход для клиентов" : "Вход для специалистов"}
            </span>
            <form
                className="flex flex-col items-center justify-center gap-8 w-full"
                onSubmit={handleLogin}
            >
                <div className="flex flex-col items-center">
                    <label htmlFor="email">Почта</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                    Войти
                </button>
            </form>
        </div>
    );
}
