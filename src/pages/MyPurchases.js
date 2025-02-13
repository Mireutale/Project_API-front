import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import '../css/MyPurchases.css';

const MyPurchases = () => {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetch(`/api/${user.id}/purchases`)
                .then((response) => response.json())
                .then((data) => {
                    setPurchases(data['my purchase list']);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching purchases:", error);
                    setLoading(false);
                });
        }
    }, [user]);

    if (!user) {
        return <div>사용자 정보를 불러오는 중...</div>;
    }

    if (loading) {
        return <div>구매 내역을 불러오는 중...</div>;
    }

    return (
        <div className="mypurchases-container">
            <h1>내 구매 내역</h1>
            {purchases.length === 0 ? (
                <p>구매 내역이 없습니다.</p>
            ) : (
                <ul className="purchase-list">
                    {purchases.map((purchase) => (
                        <li key={purchase.id} className="purchase-item">
                            <p><strong>상품명:</strong> {purchase.product_name}</p>
                            <p><strong>가격:</strong> {purchase.price}원</p>
                            <p><strong>구매일:</strong> {new Date(purchase.purchase_date * 1000).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyPurchases;
