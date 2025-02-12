import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "../css/ProductDetailPage.css";

const API_BASE_URL = "http://localhost:8000"; // FastAPI 주소

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const userId = 1; // TODO: 실제 로그인된 사용자 ID 사용
  const accessToken = localStorage.getItem("access_token");

  // ✅ 상품 정보 및 좋아요 상태 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        let _product = response.data.product;

        if (response.data.productImages) {
          _product.images = response.data.productImages.map(
            (image) => `${API_BASE_URL}/uploads/${image.image_URI}`
          );
        } else {
          _product.images = [];
        }
        setProduct(_product);

        // 좋아요 상태 가져오기
        const likeResponse = await axios.get(
          `${API_BASE_URL}/products/${id}/likes?user_id=${userId}`
        );
        setLiked(likeResponse.data.liked);
      } catch (error) {
        console.error("❌ 데이터를 가져오지 못했습니다.", error);
      }
    };

    fetchProductData();
  }, [id]);

  // ✅ 이미지 이전/다음 버튼 기능 추가
  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  

  

  // ✅ 댓글 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/comments`, {
          params: { product_id: id },
        });
        setComments(response.data.comments);
      } catch (error) {
        console.error("❌ 댓글을 가져오지 못했습니다.", error);
      }
    };

    fetchComments();
  }, [id]);

  // ✅ 댓글 추가
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !product?.id) return;

    try {
      await axios.post(`${API_BASE_URL}/comments`, {
        product_id: product.id,
        user_id: userId,
        content: commentText,
      });

      const response = await axios.get(`${API_BASE_URL}/comments`, {
        params: { product_id: id },
      });
      setComments(response.data.comments);
      setCommentText("");
    } catch (error) {
      console.error("❌ 댓글을 추가하지 못했습니다.", error);
    }
  };

  // ✅ 좋아요 추가/삭제 기능
  const handleLikeToggle = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!product?.id) return;

    try {
      if (liked) {
        await axios.delete(`${API_BASE_URL}/products/${product.id}/likes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // ✅ 로그인 토큰 추가
          },
          data: { user_id: userId },
        });

        console.log("🎯 좋아요 취소 성공");
        setLiked(false);
      } else {
        await axios.post(
          `${API_BASE_URL}/products/${product.id}/likes`,
          { user_id: userId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // ✅ 로그인 토큰 추가
            },
          }
        );

        console.log("🎯 좋아요 추가 성공");
        setLiked(true);
      }
    } catch (error) {
      console.error("❌ 좋아요 변경 실패", error);
    }
  };

  const goToChatRoom = () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    const chatroomId = 1; // 예제용 채팅방 ID
    navigate(`/chat/${chatroomId}`);
  };

  // ✅ 카테고리 옵션 목록
  const categories = [
    { id: 1, name: "전자기기" },
    { id: 2, name: "의류" },
    { id: 3, name: "가구" },
    { id: 4, name: "도서" },
    { id: 5, name: "기타" },
  ];

  if (!product) return <p>상품 정보를 불러오는 중...</p>;

  return (
    <div className="container">
      <div className="product-section">
        <div className="image-section">
          <div className="image-slider">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex]}
                  alt={`상품 이미지 ${currentImageIndex + 1}`}
                  className="product-image"
                />
                <button className="prev-btn" onClick={prevImage}>
                  <ChevronLeft size={24} />
                </button>
                <button className="next-btn" onClick={nextImage}>
                  <ChevronRight size={24} />
                </button>
              </>
            ) : (
              <p>이미지가 없습니다.</p>
            )}
          </div>
        </div>
        <section className="info-section">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-category">
            {categories.find((c) => c.id === product.category_id)?.name || "기타"}
          </p>
          <p className="product-price">
            {product?.price?.toLocaleString() ?? "가격 정보 없음"}원
          </p>
          <div className="meta-info">
            <p>채팅 2 · 관심 {product.heart_count} · 조회 104</p>
          </div>
          <div className="button-section">
            <button 
              className={`like-btn ${liked ? "liked" : ""}`} 
              onClick={handleLikeToggle} 
              disabled={!accessToken} // 로그인되지 않으면 버튼 비활성화
            >
              {liked ? "💖 관심 등록" : "🤍 관심 등록"}
            </button>
            <button 
  className="cta-btn" 
  onClick={goToChatRoom} 
  disabled={!accessToken} // 로그인하지 않으면 버튼 비활성화
>
  채팅하기
</button>
          </div>
        </section>
      </div>

      {/* ✅ 댓글 섹션 */}
      <div className="comment-section">
        <h2>댓글</h2>
        <form id="comment-form" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            id="comment-input"
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button type="submit">작성</button>
        </form>
        <ul id="comment-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <span>{comment.content}</span>
              </li>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductDetails;
