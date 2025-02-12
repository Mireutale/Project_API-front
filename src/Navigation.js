// Navigation.js (예시)
import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/login">로그인</Link>
                </li>
                <li>
                    <Link to="/signup">회원가입</Link>
                </li>
                <li>
                    <Link to="/mypage">마이페이지</Link> {/* 마이페이지 링크 추가 */}
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;
