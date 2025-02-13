import React, { createContext, useState, useContext, useEffect } from "react";

// AuthContext 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
    const [user, setUser] = useState(null); // 사용자 정보 상태

    // 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보와 토큰을 가져와 초기화
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("access_token");

        if (storedUser && storedToken) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser)); // 로컬 스토리지에서 가져온 사용자 정보 파싱
        }
    }, []);

    // 로그인 함수
    const login = (userData) => {
        setIsLoggedIn(true); // 로그인 상태로 설정
        setUser(userData); // 사용자 정보 저장
        localStorage.setItem("user", JSON.stringify(userData)); // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem("access_token", userData.access_token); // 로컬 스토리지에 Access Token 저장
    };

    // 로그아웃 함수
    const logout = () => {
        setIsLoggedIn(false); // 로그아웃 상태로 설정
        setUser(null); // 사용자 정보 초기화
        localStorage.removeItem("user"); // 로컬 스토리지에서 사용자 정보 제거
        localStorage.removeItem("access_token"); // 로컬 스토리지에서 Access Token 제거
        localStorage.removeItem("refresh_token"); // Refresh Token도 제거 (필요 시)
    };

    // Access Token 가져오기 함수
    const getToken = () => {
        return localStorage.getItem("access_token");
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthContext를 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);
