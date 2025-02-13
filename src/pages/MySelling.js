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
                        <tr>
                            <td colSpan="4">올린 상품이 없습니다.</td>
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
