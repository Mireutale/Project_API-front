import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";
import carrotImage from "../assets/carrot.png"; // carrot.png import
import "../css/Navbar.css";
import { useAuth } from "../AuthContext"; // AuthContext import

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth(); // AuthContext 사용
  const [isHovered, setIsHovered] = useState(false); // 마우스 hover 상태

  // 로그아웃 처리
  const handleLogout = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
    if (confirmLogout) {
      logout(); // 로그아웃 실행
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
          // 로그인 상태일 때
          <div className="profile-container">
            {/* carrot 이미지와 로그인된 사용자 이름 위치 바꾸기 */}
            <div
              className="profile-image-wrapper"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={carrotImage} // carrot.png 이미지를 불러옴
                alt="프로필"
                className="profile-image"
                onClick={() => alert("내 정보 보기")}
              />
              {isHovered && <span className="info-text">내 정보 보기</span>}
            </div>

            {/* 로그인된 사용자 이름 표시 */}
            <span className="user-name">{user.loginId}님</span>

            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </div>
        ) : (
          // 로그아웃 상태일 때
          <>
            <Link to="/login">
              <button className="search-btn">로그인</button>
            </Link>
            <Link to="/signup">
              <button className="logout-btn">회원가입</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
