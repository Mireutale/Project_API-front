import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "../css/MyLike.css";

const API_BASE_URL = "http://localhost:8000";

const MyLike = () => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLikedProducts();
    }, []);

    const fetchLikedProducts = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                throw new Error('No access token found');
            }

            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData || !userData.id) {
                throw new Error('User not logged in');
            }

            const response = await axios.get(`${API_BASE_URL}/users/${userData.id}/likes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("API 응답 데이터:", response.data);
            setLikedProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching liked products:', error.response?.data || error.message);
            setError('좋아요 목록을 불러오는 데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePost = () => {
        navigate("/create-post");
    };

    if (isLoading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="mylike-page">
            <h1 className="title">내가 좋아요한 상품</h1>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>상품명</th>
                        <th>가격</th>
                        <th>등록일</th>
                        <th>자세히 보기</th>
                    </tr>
                </thead>
                <tbody>
                    {likedProducts.length === 0 ? (
                        <tr className="empty-row">
                            <td colSpan="5" className="empty-cell">
                                <div className="empty-state">좋아요한 상품이 없습니다.</div>
                            </td>
                        </tr>
                    ) : (
                        likedProducts.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.title}</td>
                                <td>{product.price ? `${product.price.toLocaleString()}원` : "가격 정보 없음"}</td>
                                <td>{new Date(product.date).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/product/${product.id}`} className="mylike-detail-button">
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

export default MyLike;
