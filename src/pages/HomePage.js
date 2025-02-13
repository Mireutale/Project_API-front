import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/MySelling.css";

const API_BASE_URL = "http://localhost:8000";

const MySelling = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/selling`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProducts(response.data.my_selling_list);
    } catch (error) {
      console.error("내가 올린 상품 목록을 불러오지 못했습니다.", error);
    }
  };

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  return (
    <div className="myselling-page">
      <h1 className="title">내가 올린 매물</h1>

      <div className="product-list">
        {products.length === 0 ? (
          <p>올린 상품이 없습니다.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="product-block">
              <div className="product-info">
                <h2 className="product-name">{product.title}</h2>
                <p className="product-price">{product.price.toLocaleString()}원</p>
                <Link to={`/product/${product.id}`} className="myselling-detail-button">
                  자세히 보기
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="floating-add-button" onClick={handleCreatePost}>
        +
      </button>
    </div>
  );
};

export default MySelling;
