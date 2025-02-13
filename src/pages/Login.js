import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/styles.css';
import { useAuth } from '../AuthContext';

const Login = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // navigate 추가
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const API_ENDPOINT = 'http://localhost:8000/users/token';
        
            const formData = new FormData();
            formData.append('username', loginId);
            formData.append('password', password);
        
            const response = await axios.post(API_ENDPOINT, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
    
            const userData = response.data;
            console.log("✅ 로그인 성공, 서버 응답 데이터:", userData);
    
            // ✅ user_id (id) 저장
            if (userData.id) {
                sessionStorage.setItem("user_id", userData.id);
                console.log("✅ user_id 저장 완료:", userData.id);
            } else {
                console.warn("⚠️ user_id가 응답에 없습니다!");
            }
    
            // ✅ access_token 저장 (로그인 후 받은 토큰)
            if (userData.access_token) {
                sessionStorage.setItem("access_token", userData.access_token);
                console.log("✅ access_token 저장 완료:", userData.access_token);
            } else {
                console.warn("⚠️ access_token이 응답에 없습니다!");
            }
    
            // ✅ refresh_token 저장 (백엔드에서 제공되지 않으면 생략 가능)
            if (userData.refresh_token) {
                sessionStorage.setItem("refresh_token", userData.refresh_token);
            } else {
                console.warn("⚠️ refresh_token이 없습니다!");
            }
    
            // ✅ user 객체 저장 (전체 정보 포함)
            sessionStorage.setItem("user", JSON.stringify(userData));
    
            // AuthContext의 login 함수 호출
            login(userData);
    
            alert('로그인 성공!');
    
            // 홈 화면으로 이동
            navigate('/'); // 홈 화면으로 이동
        } catch (error) {
            console.error('로그인 실패:', error);
            if (error.response) {
                setError(`로그인 실패: ${error.response.status} - ${error.response.data.detail || error.message}`);
            } else if (error.request) {
                setError('로그인 실패: 서버에서 응답이 없습니다.');
            } else {
                setError(`로그인 실패: ${error.message}`);
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>로그인</h2>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    placeholder="로그인 ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">로그인</button>
                <p>
                    계정이 없으신가요? <Link to="/signup">회원가입</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
