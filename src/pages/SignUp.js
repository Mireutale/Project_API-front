import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/styles.css';
import { useAuth } from '../AuthContext'; // AuthContext import 추가

const SignUp = () => {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // AuthContext 사용

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

            console.log('회원가입 성공:', response);

            // 회원가입 성공 시 받은 사용자 정보로 로그인 처리
            login(response.data); // 서버에서 받은 사용자 정보를 Context에 저장

            // 토큰 저장 및 홈페이지로 이동
            localStorage.setItem('access_token', response.data.access_token); // ✅ 일관성 있게 'access_token' 사용
            alert('회원가입이 완료되었습니다!'); // 회원가입 완료 알림
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
