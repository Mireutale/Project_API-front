import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import axios from "axios";
import "../css/HomePage.css"; // CSS 파일 연결

const API_BASE_URL = "http://localhost:8000"; // FastAPI 주소

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate(); // ✅ 페이지 이동 함수 추가

  useEffect(() => {
    fetchProducts();
  }, []); // 초기 로딩 시 데이터 가져오기

  // ✅ 상품 목록 API 요청 (검색어 포함)
  const fetchProducts = async (query = "") => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { q: query }, // 쿼리 파라미터 추가
      });

      const fetchedProducts = response.data.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price.toLocaleString() + "원",
        image: item.productImages.length > 0
          ? `${API_BASE_URL}/uploads/${item.productImages[0].image_URI}`
          : `${API_BASE_URL}/uploads/default.png`, // 기본 이미지
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("❌ 상품 목록을 불러오지 못했습니다.", error);
    }
  };

  // ✅ 검색어 변경 시 상태 업데이트
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // ✅ 검색 실행 (Enter 키 또는 버튼 클릭 시)
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchProducts(searchTerm); // 검색어를 포함하여 API 요청
  };

  // ✅ 게시물 작성 페이지로 이동하는 함수
  const handleCreatePost = () => {
    navigate("/create-post"); // `/create-post` 경로로 이동
  };

  return (
    <div className="homepage">
      <h1 className="title">중고거래 인기매물</h1>

      {/* 🔍 검색 입력 필드 추가 */}
      <form className="home-search-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="상품 검색..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="home-search-input"
        />
        <button type="submit" className="home-search-button">검색</button>
      </form>

      <div className="product-list">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)} // ✅ 카드 클릭 시 상세 페이지 이동
            style={{ cursor: "pointer" }} // ✅ 마우스 오버 시 클릭 가능하게 변경
          >
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-info">
              <h2 className="product-name">{product.title}</h2>
              <p className="product-price">{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ 오른쪽 하단에 동그란 + 버튼 추가 */}
      <button className="floating-add-button" onClick={handleCreatePost}>
        +
      </button>
    </div>
  );
};

export default HomePage;