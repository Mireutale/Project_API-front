import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileEdit = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [loginId, setLoginId] = useState(user.login_id);
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');  // 기존 비밀번호 필드 추가

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 로컬 스토리지에서 access_token 가져오기
        const accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            alert('인증 토큰이 없습니다.');
            return;
        }

        try {
            const response = await axios.put(
                'http://127.0.0.1:8000/users/profile',
                {
                    login_id: loginId,
                    username,
                    email,
                    password: password || undefined,  // 비밀번호가 있을 때만 보냄
                    current_password: currentPassword // 기존 비밀번호 추가
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // 토큰을 Authorization 헤더에 포함
                    }
                }
            );

            // AuthContext 사용자 정보 갱신
            login(response.data);

            // 성공 메시지 표시 및 리다이렉트
            alert('프로필 수정이 완료되었습니다.');
            navigate('/mypage');
        } catch (error) {
            console.error('프로필 수정 실패:', error.response?.data?.detail || error.message);
            alert('프로필 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="profile-edit-container">
            <h2>프로필 수정</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>아이디:</label>
                    <input
                        type="text"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                    />
                </div>
                <div>
                    <label>이름:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>이메일:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>기존 비밀번호:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>새 비밀번호 (변경하려면 입력):</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
};

export default ProfileEdit;
