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

    const handleEdit = (productId) => {
        // 수정 로직 구현
        navigate(`/edit-product/${productId}`);
    };

    const handleDelete = async (productId) => {
        // 삭제 로직 구현
        if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`${API_BASE_URL}/products/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                fetchMyProducts(); // 상품 목록 새로고침
            } catch (error) {
                console.error("상품 삭제 중 오류가 발생했습니다.", error);
            }
        }
    };

    return (
        <div className="myselling-page">
            <h1 className="title">내가 판매중인 상품</h1>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>가격</th>
                        <th>자세히 보기</th>
                        <th>수정</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr className="empty-row">
                            <td colSpan="6" className="empty-cell">
                                <div className="empty-state">판매중인 상품이 없습니다.</div>
                            </td>
                        </tr>
                    ) : (
                        products.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.title}</td>
                                <td>{product.price}</td>
                                <td>
                                    <Link to={`/product/${product.id}`} className="myselling-detail-button">
                                        자세히 보기
                                    </Link>
                                </td>
                                <td>
                                    <button onClick={() => handleEdit(product.id)} className="myselling-edit-button">
                                        수정
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(product.id)} className="myselling-delete-button">
                                        삭제
                                    </button>
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

export default MySelling;
