import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/HomePage.css";

const API_BASE_URL = "http://43.203.243.68"; // FastAPI 주소

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("accuracy");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
      console.error("상품 목록을 불러오지 못했습니다.", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("카테고리를 불러오지 못했습니다.", error);
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

      {/* 검색 필드 */}
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

      {/* 카테고리 & 정렬 컨테이너 (한 줄 배치) */}
      <div className="filter-container">
        <div className="category-sort-wrapper">
          {/* 카테고리 선택 */}
          <div className="category-container">
            <label htmlFor="category">카테고리: </label>
            <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">전체</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 선택 */}
          <div className="sort-container">
            <label htmlFor="sort">정렬: </label>
            <select id="sort" value={sortType} onChange={handleSortChange}>
              <option value="accuracy">정확도</option>
              <option value="price_asc">가격 낮은 순</option>
              <option value="price_desc">가격 높은 순</option>
              <option value="latest">최신순</option>
              <option value="likes">좋아요 많은 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 상품 목록 */}
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
      <button className="floating-add-button" onClick={handleCreatePost}>
        +
      </button>
    </div>
  );
};

export default HomePage;
