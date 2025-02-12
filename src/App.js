import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage"; // 추가
import ProductDetailPage from "./pages/ProductDetailPage";
import CreatePostPage from "./pages/CreatePostPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* 홈 페이지 라우트 연결 */}
        <Route path="/" element={<HomePage />} />

        {/* 상품 상세 페이지 라우트, ID를 URL을 통해 전달 */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
      </Routes>
    </Router>
  );
};

export default App;
