import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/Mypage.css';
import carrotImage from "../assets/carrot.png";

const MyPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("MyPage - Current user data:", user);
    }, [user]);

    if (!user) {
        return <div>사용자 정보를 불러오는 중...</div>;
    }

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    const handleDeleteAccount = () => {
        navigate('/delete-account');
    };

    const handleViewBought = () => {
        navigate('/my-bought');
    };

    const handleViewSelling = () => {
        navigate('/my-selling');
    };

    const handleViewLikes = () => {
        navigate('/my-likes');
    };

    return (
        <div className="mypage-container">
            <div className="profile-info">
                <div className="profile-image-wrapper-big">
                    <img
                        src={user.profile_image || carrotImage}
                        alt="프로필"
                        className="profile-image"
                    />
                </div>
                <div className="profile-details">
                    <p><strong>ID:</strong> {user.login_id || '정보 없음'}</p>
                    <p><strong>이름:</strong> {user.username || '정보 없음'}</p>
                    <p><strong>이메일:</strong> {user.email || '정보 없음'}</p>
                    <p><strong>가입일:</strong> {user.created_at ? new Date(user.created_at * 1000).toLocaleDateString() : '정보 없음'}</p>
                </div>
            </div>
            <div className="profile-actions">
                <button onClick={handleViewLikes} className="likes-btn">
                    ❤️
                </button>
                <button onClick={handleEditProfile} className="edit-profile-btn">프로필 수정</button>
                <button onClick={handleDeleteAccount} className="delete-account-btn">회원 탈퇴</button>
            </div>
            <br></br>
            <hr></hr>
            <div className="history-section">
                <div onClick={handleViewBought} className="history-card purchase-card">
                    <h3>구매 내역</h3>
                    <p>지금까지 구매한 상품 목록을 확인하세요.</p>
                </div>
                <div onClick={handleViewSelling} className="history-card selling-card">
                    <h3>판매 내역</h3>
                    <p>지금까지 판매한 상품 목록을 확인하세요.</p>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
