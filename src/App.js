import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage"; // 추가
import ProductDetailPage from "./pages/ProductDetailPage";
<<<<<<< HEAD
import ChatRoom from "./pages/ChatRoom";
=======
import CreatePostPage from "./pages/CreatePostPage";
>>>>>>> dbc3b7b374f54e12e8349e761e907bb88f50b94f

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
<<<<<<< HEAD
        <Route path="/product_detail" element={<ProductDetailPage productId={1} />} />
        <Route path="/" element={<h1>홈페이지</h1>} />
        <Route path="/chat/:chatroomId" element={<ChatRoom />} />  {/* 채팅방 라우팅 */}
=======
        {/* 홈 페이지 라우트 연결 */}
        <Route path="/" element={<HomePage />} />

        {/* 상품 상세 페이지 라우트, ID를 URL을 통해 전달 */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
>>>>>>> dbc3b7b374f54e12e8349e761e907bb88f50b94f
      </Routes>
    </Router>
  );
};

export default App;
