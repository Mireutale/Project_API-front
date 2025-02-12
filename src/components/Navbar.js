import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import carrotImage from "../assets/carrot.png";
import "../css/Navbar.css";
import { useAuth } from "../AuthContext";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const profileImage = user?.profile_image || carrotImage;

  const handleProfileClick = () => {
    navigate("/mypage");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      logout();
      alert("로그아웃 되었습니다.");
      navigate("/"); // 홈으로 이동
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logoImage} alt="로고" className="logo-image" />
      </div>

      <ul className="nav-links">
        <li><Link to="/">홈</Link></li>
        <li>중고거래</li>
        <li>부동산</li>
        <li>중고차</li>
        <li>알바</li>
        <li>동네업체</li>
        <li>동네생활</li>
        <li>모임</li>
      </ul>

      {/* 로그인 및 회원가입 버튼 */}
      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="profile-container">
            <div className="profile-image-wrapper" onClick={handleProfileClick}>
              <img src={profileImage} alt="프로필" className="profile-image" />
              <div className="info-text">내 정보 보기</div>
            </div>
            <span className="user-name">{user?.login_id} 님</span>
            <button onClick={handleLogout} className="logout-btn">로그아웃</button>
          </div>
        ) : (
          <>
            <Link to="/login"><button>로그인</button></Link>
            <Link to="/signup"><button>회원가입</button></Link>
          </>
        )}
      </div>
    </nav>
  );
};


export default Navbar;