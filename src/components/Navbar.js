// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";
import "../css/Navbar.css";

const Navbar = () => {
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
        <Link to="/login">
          <button className="search-btn">로그인</button>
        </Link>
        <Link to="/signup">
          <button className="logout-btn">회원가입</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
