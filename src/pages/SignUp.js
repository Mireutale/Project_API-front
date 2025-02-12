import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/styles.css';

const SignUp = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // 백엔드 API 엔드포인트 URL
            const API_ENDPOINT = 'http://localhost:8000/users/signup';

            // 서버로 회원가입 요청 보내기
            const response = await axios.post(API_ENDPOINT, {
                login_id: loginId,
                pwd: password,
                name: name,
                email: email
            });

            // 응답 데이터에서 토큰 추출
            const token = response.data.access_token;

            // 토큰 저장 및 홈페이지로 이동
            localStorage.setItem('token', token);
            navigate('/'); // 홈 페이지로 이동
        } catch (error) {
            console.error('회원가입 실패:', error.response?.data || error.message);
            setError('회원가입에 실패했습니다. 입력 내용을 확인해주세요.');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>회원가입</h2>
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
                <input
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">회원가입</button>
                <p>
                    이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
