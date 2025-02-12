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
        console.log("로그인 데이터:", userData); // 디버깅용 로그
        setIsLoggedIn(true);
        setUser(userData); // 사용자 정보를 상태에 저장
        localStorage.setItem('user', JSON.stringify(userData)); // 로컬 스토리지에 저장
        localStorage.setItem('access_token', userData.access_token); // 토큰 저장
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
