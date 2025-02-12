import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage"; // 추가
import ProductDetailPage from "./pages/ProductDetailPage";
import ChatRoom from "./pages/ChatRoom";
import CreatePostPage from "./pages/CreatePostPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/chat/:chatroomId" element={<ChatRoom />} />  {/* 채팅방 라우팅 */}
        <Route path="/" element={<HomePage />} /> {/* 홈 페이지 라우트 연결 */}
        {/* 상품 상세 페이지 라우트, ID를 URL을 통해 전달 */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
      </Routes>
    </Router>
  );
};

export default App;
