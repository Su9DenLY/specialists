import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../AppContext.jsx";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";

export default function Auth() {
    const {setRole} = useContext(AppContext);
    const [isLogin, setIsLogin] = useState(true);

    const {role} = useParams();
    useEffect(() => {
        setRole(role);
    }, [role]);

    return (
        <div className="flex flex-col items-center justify-center w-full mt-10">
            <div className="flex flex-row items-center justify-center w-2/3 gap-10 p-4">
                <button className="bg-purple-100 hover:bg-purple-300 border px-7 py-3 rounded-3xl"
                        onClick={() => setIsLogin(true)}>Войти
                </button>
                <button className="bg-purple-100 hover:bg-purple-300 border px-7 py-3 rounded-3xl"
                        onClick={() => setIsLogin(false)}>Зарегистрироваться
                </button>
            </div>
            {isLogin ? <LoginForm/> : <RegisterForm/>}
        </div>
    )
}
