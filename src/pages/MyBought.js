import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/MyBought.css";

const API_BASE_URL = "http://localhost:8000";

const MyBought = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyBoughtProducts();
    }, []);

    const fetchMyBoughtProducts = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/purchases/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            console.log("API 응답 데이터:", response.data);
            setProducts(response.data || []);
        } catch (error) {
            console.error("내가 구매한 상품 목록을 불러오지 못했습니다.", error);
            setError("상품 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = () => {
        navigate("/create-post");
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="mybought-page">
            <h1 className="title">내가 구매한 상품</h1>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>판매자</th>
                        <th>구매일</th>
                        <th>자세히 보기</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr className="empty-row">
                            <td colSpan="6" className="empty-cell">
                                <div className="empty-state">구매한 상품이 없습니다.</div>
                            </td>
                        </tr>
                    ) : (
                        products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.title}</td>
                                <td>{product.price ? `${product.price.toLocaleString()}원` : "가격 정보 없음"}</td>
                                <td>{product.seller_name}</td>
                                <td>{new Date(product.purchase_date).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/product/${product.id}`} className="mybought-detail-button">
                                        자세히 보기
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <button className="floating-add-button" onClick={handleCreatePost}>
                +
            </button>
        </div>
    );
};

export default MyBought;
