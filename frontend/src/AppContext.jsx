import React, {createContext, useEffect, useState} from "react";
import jwtDecode from "jwt-decode";

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [user, setUser] = useState("");
    const [role, setRole] = useState("");
    const [speciality, setSpeciality] = useState("");


    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            setUser(jwtDecode(accessToken).user_id);
            setRole(jwtDecode(accessToken).role)
        }
    }, [])


    return <AppContext.Provider value={{
        user,
        setUser,
        role,
        setRole,
        speciality,
        setSpeciality,
    }}>
        {children}
    </AppContext.Provider>;
};
