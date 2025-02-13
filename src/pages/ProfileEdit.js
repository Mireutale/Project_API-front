import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/ProfileEdit.css';

const ProfileEdit = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [loginId, setLoginId] = useState(user.login_id);
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    password: password || undefined,
                    current_password: currentPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                }
            );

            // 새 토큰 저장
            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
            }

            // AuthContext 사용자 정보 갱신
            login(response.data);

            alert('프로필 수정이 완료되었습니다.');
            navigate('/mypage');
        } catch (error) {
            console.error('프로필 수정 실패:', error.response?.data?.detail || error.message);
            alert('프로필 수정 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="profile-edit-container">
            <h2 className="profile-title">프로필 수정</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="profile-form-group">
                    <label>아이디 <span className="profile-optional">(선택)</span>:</label>
                    <input
                        type="text"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        className="profile-input"
                    />
                </div>
                <div className="profile-form-group">
                    <label>이름 <span className="profile-optional">(선택)</span>:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="profile-input"
                    />
                </div>
                <div className="profile-form-group">
                    <label>이메일 <span className="profile-optional">(선택)</span>:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="profile-input"
                    />
                </div>
                <div className="profile-form-group">
                    <label>기존 비밀번호 <span className="profile-required">*(필수)</span>:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="profile-input"
                    />
                </div>
                <div>
                    <label>새 비밀번호 <span className="required">*(필수)</span>:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="profile-input"
                    />
                </div>
                <button type="submit" className="profile-submit-button">수정 완료</button>
            </form>
        </div>
    );
};

export default ProfileEdit;
