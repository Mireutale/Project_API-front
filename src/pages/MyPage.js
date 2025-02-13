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

    const handleViewPurchases = () => {
        navigate('/my-purchases');
    };

    const handleViewSelling = () => {
        navigate('/my-selling'); // 판매 내역 페이지로 이동
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
            {/* 버튼 영역 */}
            <div className="profile-actions">
                <button onClick={handleEditProfile} className="edit-profile-btn">프로필 수정</button>
                <button onClick={handleDeleteAccount} className="delete-account-btn">회원 탈퇴</button>
            </div>
            <br></br>
            <hr></hr>
            {/* 구매/판매 내역 섹션 */}
            <div className="history-section">
                <div onClick={handleViewPurchases} className="history-card purchase-card">
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
