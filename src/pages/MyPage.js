import React from 'react';
import { useAuth } from '../AuthContext';
import '../css/Mypage.css';

const MyPage = () => {
    const { user } = useAuth();

    return (
        <div className="mypage-container">
            <h1>내 정보</h1>
            <div className="profile-info">
                <img src={user?.profile_image || '/path/to/default/image.png'} alt="프로필" className="profile-image" />
                <p><strong>아이디:</strong> {user?.loginId}</p>
                {/* 추가 사용자 정보를 여기에 표시 */}
            </div>
        </div>
    );
};

export default MyPage;
