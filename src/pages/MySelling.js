import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import '../css/MySelling.css';

const MySelling = () => {
    const [sellingItems, setSellingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchSellingItems = async () => {
            if (!user || !user.id) {
                setError("사용자 정보를 찾을 수 없습니다.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/${user.id}/selling`); if (!response.ok) {
                    throw new Error('서버에서 판매 내역을 가져오는데 실패했습니다.');
                }
                const data = await response.json();
                setSellingItems(data.my_selling_list);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSellingItems();
    }, [user]);

    if (loading) return <div>판매 내역을 불러오는 중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div className="myselling-container">
            <h2>내 판매 내역</h2>
            {sellingItems.length === 0 ? (
                <p>판매 내역이 없습니다.</p>
            ) : (
                <ul className="selling-list">
                    {sellingItems.map((item) => (
                        <li key={item.id} className="selling-item">
                            <h3>{item.title}</h3>
                            <p>가격: {item.price}원</p>
                            <p>상태: {item.soldout ? '판매 완료' : '판매 중'}</p>
                            <p>등록일: {new Date(item.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MySelling;
