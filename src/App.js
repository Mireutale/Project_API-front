import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductDetailPage from "./pages/ProductDetailPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/product_detail" element={<ProductDetailPage productId={1}/>} />
        <Route path="/" element={<h1>홈페이지</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
