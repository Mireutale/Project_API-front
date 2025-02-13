import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ChatRoom from "./pages/ChatRoom";
import CreatePostPage from "./pages/CreatePostPage";
import Login from "./pages/Login"; // Login 컴포넌트 import
import SignUp from "./pages/SignUp"; // SignUp 컴포넌트 import
import MyPage from "./pages/MyPage"; // MyPage 컴포넌트 import
import { AuthProvider } from "./AuthContext"; // AuthContext 추가
import ProfileEdit from './pages/ProfileEdit';
import DeleteAccount from './pages/DeleteAccount';
import MyPurchases from './pages/MyPurchases';
import MySelling from './pages/MySelling';
import ModifyPostPage from "./pages/ModifyPostPage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* 채팅방 라우팅 */}
          <Route path="/chat/:chatroomId" element={<ChatRoom />} />
          {/* 홈 페이지 라우트 연결 */}
          <Route path="/" element={<HomePage />} />
          {/* 상품 상세 페이지 라우트, ID를 URL을 통해 전달 */}
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          {/* 새로운 라우트 추가 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/edit-profile" element={<ProfileEdit />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/my-purchases" element={<MyPurchases />} />
          <Route path="/my-purchases" element={<MyPurchases />} />
          <Route path="/my-selling" element={<MySelling />} />
          <Route path="/modify-post/:product_id" element={<ModifyPostPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
