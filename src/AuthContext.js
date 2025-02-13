import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("access_token");

        if (storedUser && storedToken) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.access_token) {
            localStorage.setItem("access_token", userData.access_token);
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // 추가적인 클린업이 필요한 경우 여기에 추가
    };

    const getToken = () => {
        return localStorage.getItem("access_token");
    };

    const updateUser = (updatedUserData) => {
        const newUserData = { ...user, ...updatedUserData };
        setUser(newUserData);
        localStorage.setItem("user", JSON.stringify(newUserData));
        if (updatedUserData.access_token) {
            localStorage.setItem("access_token", updatedUserData.access_token);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, getToken, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
