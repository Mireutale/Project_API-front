import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/ProductDetailPage.css";
import macImage from "../assets/airpot2.png";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = "http://localhost:8000"; // FastAPI 주소

const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const userId = 1; // TODO: 실제 로그인된 사용자 ID 사용

  // ✅ 상품 정보 및 좋아요 상태 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        setProduct(response.data.product);

        const likeResponse = await axios.get(`${API_BASE_URL}/products/${id}/likes?user_id=${userId}`);
        setLiked(likeResponse.data.liked);
      } catch (error) {
        console.error("데이터를 가져오지 못했습니다.", error);
      }
    };

    fetchProductData();
  }, [id]);

  // ✅ 댓글 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}/comments`);
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
      await axios.post(`${API_BASE_URL}/products/${product.id}/comments`, {
        user_id: userId,
        content: commentText,
      });

      const response = await axios.get(`${API_BASE_URL}/products/${product.id}/comments`);
      setComments(response.data.comments);
      setCommentText("");
    } catch (error) {
      console.error("❌ 댓글을 추가하지 못했습니다.", error);
    }
  };

  // ✅ 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!product?.id) return;

    try {
      await axios.delete(`${API_BASE_URL}/products/${product.id}/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
      console.log("🗑️ 댓글 삭제 성공");
    } catch (error) {
      console.error("❌ 댓글 삭제 실패", error);
    }
  };

  // ✅ 댓글 수정 모드 활성화
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  // ✅ 댓글 수정 완료
  const handleUpdateComment = async (commentId) => {
    if (!product?.id) return;

    try {
      await axios.put(`${API_BASE_URL}/products/${product.id}/comments/${commentId}`, {
        user_id: userId,
        content: editText,
      });

      const response = await axios.get(`${API_BASE_URL}/products/${product.id}/comments`);
      setComments(response.data.comments);
      setEditingCommentId(null);
      console.log("✅ 댓글 수정 성공");
    } catch (error) {
      console.error("❌ 댓글 수정 실패", error);
    }
  };

  // ✅ 좋아요 추가/삭제 기능
  const handleLikeToggle = async () => {
    if (!product?.id) return;

    try {
      if (liked) {
        await axios.delete(`${API_BASE_URL}/products/${product.id}/likes`, {
          headers: { "Content-Type": "application/json" },
          data: { user_id: userId },
        });

        console.log("🎯 좋아요 취소 성공");
        setLiked(false);
      } else {
        await axios.post(`${API_BASE_URL}/products/${product.id}/likes`, { user_id: userId });

        console.log("🎯 좋아요 추가 성공");
        setLiked(true);
      }
    } catch (error) {
      console.error("❌ 좋아요 변경 실패", error);
    }
  };

  const categoryMap = {
    1: "전자기기",
    2: "의류",
    3: "가구",
    4: "생활용품",
    5: "스포츠",
  };

  if (!product) return <p>상품 정보를 불러오는 중...</p>;

  return (
    <div className="container">
      <div className="product-section">
        <div className="image-section">
          <img src={macImage} alt="상품 이미지" className="product-image" />
        </div>
        <section className="info-section">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-category">{categoryMap[product.category_id] || "기타"}</p>
          <p className="product-price">{product?.price?.toLocaleString() ?? "가격 정보 없음"}원</p>
          <p className="product-description">
            {product.content.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <div className="meta-info">
            <p>채팅 2 · 관심 {product.heart_count} · 조회 104</p>
          </div>
          <div className="button-section">
            <button className={`like-btn ${liked ? "liked" : ""}`} onClick={handleLikeToggle}>
              {liked ? "💖 관심 등록" : "🤍 관심 등록"}
            </button>
            <button className="cta-btn" onClick={goToChatRoom}>채팅하기</button>
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
                {editingCommentId === comment.id ? (
                  <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} />
                ) : (
                  <span>{comment.content}</span>
                )}

                {comment.user_id === userId && (
                  <div className="comment-buttons">
                    {editingCommentId === comment.id ? (
                      <>
                        <button onClick={() => handleUpdateComment(comment.id)}>저장</button>
                        <button onClick={() => setEditingCommentId(null)}>취소</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditComment(comment)}>수정</button>
                        <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                      </>
                    )}
                  </div>
                )}
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
