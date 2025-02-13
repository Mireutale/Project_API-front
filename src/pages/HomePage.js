import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/HomePage.css";

const API_BASE_URL = "http://localhost:8000"; // FastAPI 주소

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // 🔥 카테고리 목록
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("accuracy"); // 기본 정렬: 정확도
  const [selectedCategory, setSelectedCategory] = useState(""); // 🔥 선택한 카테고리
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // 🔥 카테고리 목록 불러오기
  }, [sortType, selectedCategory]); // 정렬 또는 카테고리 변경 시 API 호출

  const fetchProducts = async (query = "") => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: { q: query, sort_type: sortType, category_id: selectedCategory || null },
      });

      const fetchedProducts = response.data.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price.toLocaleString() + "원",
        image: item.productImages.length > 0 
          ? `${API_BASE_URL}/uploads/${item.productImages[0].image_URI}` 
          : `${API_BASE_URL}/uploads/default.png`,
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("❌ 상품 목록을 불러오지 못했습니다.", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("❌ 카테고리를 불러오지 못했습니다.", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchProducts(searchTerm);
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCreatePost = () => {
    navigate("/create-post"); // 게시물 작성 페이지로 이동
  };

  return (
    <div className="homepage">
      <h1 className="title">중고거래 인기매물</h1>

      {/* 🔍 검색 필드 */}
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

      {/* 📜 상품 목록 */}
      <div className="product-list">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
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