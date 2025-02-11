import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
        <li><Link to="/product_detail">중고거래</Link></li>
        <li>부동산</li>
        <li>중고차</li>
        <li>알바</li>
        <li>동네업체</li>
        <li>동네생활</li>
        <li>모임</li>
      </ul>

      {/* ✅ 검색 입력창 & 버튼 */}
      <div className="navbar-right">
        <button className="search-btn">로그인</button>
        <button className="logout-btn">회원가입</button>
      </div>
    </nav>
  );
};

export default Navbar;
