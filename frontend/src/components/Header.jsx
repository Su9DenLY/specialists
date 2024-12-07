import {useNavigate} from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import Person2Icon from '@mui/icons-material/Person2';
import {useContext} from "react";
import {AppContext} from "@/AppContext.jsx";

export default function Header() {
    const {user, role, setUser, setRole} = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser("")
        setRole("")
        localStorage.removeItem("accessToken")
    }

    const handleProfile = () => {
        console.log(role)
        if (role === "customer") {
            navigate(`/customer/${user}`);
        } else if (role === "specialist") {
            navigate(`/specialists/${user}`);
        } else if (role === "admin") {
            navigate(`/admin`);
        } else {
            console.error("Unknown role or role is not set");
        }
    };

    return (
        <header className="w-full h-16 flex items-center justify-between">
            <div className="hover:cursor-pointer" onClick={() => navigate("/")}>
                <img src="/specialists.svg" alt="Логотип" className="w-52"/>
            </div>
            <div className="w-fit flex items-center justify-between gap-10 font-sans text-lg">
                {!user ? (
                    <>
                        <button onClick={() => navigate("/auth/specialist")}>Вход для специалистов</button>
                        <button onClick={() => navigate("/auth/customer")}>Вход для клиентов</button>
                    </>
                ) : (
                    <>
                        <button
                            className="flex items-center justify-center hover:cursor-pointer hover:bg-gray-200 p-2 rounded-3xl"
                            onClick={() => handleLogout()}>
                            <LogoutIcon/>
                        </button>
                        <button
                            className="flex items-center justify-center hover:cursor-pointer hover:bg-gray-200 p-2 rounded-3xl"
                            onClick={() => handleProfile()}
                        >
                            <Person2Icon/>
                        </button>
                    </>
                )}

            </div>
        </header>
    )
}
