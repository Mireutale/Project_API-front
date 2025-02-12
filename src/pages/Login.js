import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/styles.css';

const Login = () => {
    const [loginId, setLoginId] = useState(''); // email 대신 loginId 사용
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // 백엔드 API 엔드포인트 URL
            const API_ENDPOINT = 'http://localhost:8000/users/token';

            // form-data 객체 생성
            const formData = new FormData();
            formData.append('username', loginId); // loginId를 username으로 전달
            formData.append('password', password);

            console.log('API 요청:', {
                url: API_ENDPOINT,
                data: formData
            });

            // 서버로 로그인 요청 보내기
            const response = await axios.post(
                API_ENDPOINT,
                formData, // request body에 form-data 객체 전달
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'  // form-data 형식임을 명시
                    }
                }
            );

            console.log('API 응답:', response);

            // 응답 데이터에서 토큰 추출
            const token = response.data.access_token;

            // 토큰 저장 및 홈페이지로 이동
            localStorage.setItem('token', token);
            navigate('/'); // 홈 페이지로 이동
        } catch (error) {
            console.error('로그인 실패:', error);
            if (error.response) {
                // 서버에서 응답을 받은 경우
                console.error('응답 데이터:', error.response.data);
                console.error('응답 상태 코드:', error.response.status);
                setError(`로그인 실패: ${error.response.status} - ${error.response.data.detail || error.message}`);
            } else if (error.request) {
                // 서버로 요청이 전송되었지만 응답을 받지 못한 경우
                console.error('응답을 받지 못함:', error.request);
                setError('로그인 실패: 서버에서 응답이 없습니다.');
            } else {
                // 요청을 보내기 전에 오류가 발생한 경우
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
                    placeholder="로그인 ID" // placeholder 변경
                    value={loginId} // email 대신 loginId 사용
                    onChange={(e) => setLoginId(e.target.value)} // email 대신 loginId 사용
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
