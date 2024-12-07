import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import {BrowserRouter as Router} from "react-router-dom";
import {Route, Routes} from "react-router-dom";
import Specialists from "./components/Specialists.jsx";
import SpecialistProfile from "./components/SpecialistProfile.jsx";
import CustomerProfile from "./components/CustomerProfile.jsx";
import Auth from "./components/Auth.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import QuestionForm from "@/components/QuestionForm.jsx";
import AdminProfile from "@/components/AdminProfile.jsx";

function App() {
    return (
        <Router>
            <div className="w-9/12  mx-auto">
                <Header/>
                <Routes>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/auth/:role" element={<Auth/>}/>
                    <Route path="/specialists" element={<Specialists/>}/>
                    <Route path="/admin" element={<AdminProfile/>}/>
                    <Route path="/specialists/:id" element={<SpecialistProfile/>}/>
                    <Route path="/customer/:id" element={<CustomerProfile/>}/>
                </Routes>
            </div>
            <QuestionForm/>
            <ToastContainer/>
        </Router>
    )
}

export default App
