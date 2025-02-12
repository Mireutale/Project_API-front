import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/styles.css';
import { useAuth } from '../AuthContext';

const Login = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
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
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const userData = response.data;

            // AuthContext의 login 함수 호출
            login(userData);

            // 로컬 스토리지에 저장
            localStorage.setItem('access_token', userData.access_token);
            localStorage.setItem('refresh_token', userData.refresh_token); // Refresh Token 저장
            localStorage.setItem('user', JSON.stringify(userData));

            alert('로그인 성공!');
            navigate('/mypage');
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
