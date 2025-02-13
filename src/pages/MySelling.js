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

    const handleModifyPost = (id) => {
        navigate(`/modify-post/${id}`);
    };
    
    const handleDeletePost = async (id) => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) {
            return;
        }
        axios.delete(`${API_BASE_URL}/products/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        })
        .then(() => {
            alert("상품이 삭제되었습니다.");
            fetchMyProducts();
        })
        .catch((error) => {
            console.error("상품 삭제에 실패했습니다.", error);
        });
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
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr className="empty-row">
                            <td colSpan="4" className="empty-cell">
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
                                    <button className="myselling-modify-button" onClick={() => handleModifyPost(product.id)}>수정</button>
                                    <button className="myselling-delete-button" onClick={() => handleDeletePost(product.id)}>삭제</button>
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
