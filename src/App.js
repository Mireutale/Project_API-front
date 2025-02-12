import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage"; // 추가
import ProductDetailPage from "./pages/ProductDetailPage";
import ChatRoom from "./pages/ChatRoom";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/product_detail" element={<ProductDetailPage productId={1} />} />
        <Route path="/" element={<h1>홈페이지</h1>} />
        <Route path="/chat/:chatroomId" element={<ChatRoom />} />  {/* 채팅방 라우팅 */}
      </Routes>
    </Router>
  );
};

export default App;
