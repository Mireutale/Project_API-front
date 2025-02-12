import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보 확인
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token');
        if (storedUser && storedToken) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setIsLoggedIn(true);  // 이 부분 추가
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('access_token', userData.access_token);
    };


    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
    };

    const getToken = () => {
        return localStorage.getItem('access_token');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
