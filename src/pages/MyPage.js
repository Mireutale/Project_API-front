import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import '../css/Mypage.css';
import carrotImage from "../assets/carrot.png";

const MyPage = () => {
    const { user } = useAuth();

    useEffect(() => {
        console.log("MyPage - Current user data:", user);
    }, [user]);

    if (!user) {
        return <div className="loading-container">사용자 정보를 불러오는 중...</div>;
    }

    return (
        <div className="mypage-container">
            <h1 className="mypage-title">My Page</h1>
            <div className="profile-info">
                <div className="profile-image-wrapper-big">
                    <img
                        src={user.profile_image || carrotImage}
                        alt="프로필"
                        className="profile-image"
                    />
                </div>
                <div className="profile-details">
                    <p><strong>Login ID:</strong> {user.login_id || '정보 없음'}</p>
                    <p><strong>이름:</strong> {user.username || '정보 없음'}</p>
                    <p><strong>이메일:</strong> {user.email || '정보 없음'}</p>
                    <p><strong>가입일:</strong> {user.created_at ? new Date(user.created_at * 1000).toLocaleDateString() : '정보 없음'}</p>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
