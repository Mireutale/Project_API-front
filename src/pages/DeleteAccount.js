import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/DeleteAccount.css';

const DeleteAccount = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    throw new Error('인증 토큰이 없습니다.');
                }

                await axios.delete('http://127.0.0.1:8000/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                logout(); // 로그아웃 처리
                localStorage.removeItem('access_token'); // 토큰 제거
                navigate('/'); // 홈페이지로 이동
                alert('계정이 성공적으로 삭제되었습니다.');
            } catch (error) {
                console.error('계정 삭제 실패:', error);
                alert(`계정 삭제 실패: ${error.response?.data?.detail || error.message}`);
            }
        }
    };

    return (
        <div className="delete-account-container">
            <h2>회원 탈퇴</h2>
            <p>계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다.</p>
            <p>이 작업은 되돌릴 수 없습니다.</p>
            <button onClick={handleDeleteAccount} className="delete-account-btn">계정 삭제</button>
        </div>
    );
};

export default DeleteAccount;
