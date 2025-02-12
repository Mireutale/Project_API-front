import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import Login from "./pages/Login"; // Login 컴포넌트 import
import SignUp from "./pages/SignUp"; // SignUp 컴포넌트 import
import MyPage from "./pages/MyPage"; // MyPage 컴포넌트 import

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        {/* 새로운 라우트 추가 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
};

export default App;
