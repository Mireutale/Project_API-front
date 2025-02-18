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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [heartCount, setHeartCount] = useState(0);
  const [chatroomCount, setChatroomCount] = useState(0);
  const storedUserId = sessionStorage.getItem("user_id");
  const userId = storedUserId ? Number(storedUserId) : null; // parseInt 대신 Number 사용
  console.log("현재 로그인된 user_id:", userId);
  const accessToken = sessionStorage.getItem("access_token");
  const [views, setViews] = useState(0);
  const fetchViewCount = async ({ productId }) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/products/${productId}/view`,
        null, // 요청 본문 없음
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setViews(response.data.views);
    } catch (error) {
      console.error("조회수를 가져오지 못했습니다:", error);
    }
  };

  const fetchChatrooms = async () => {
    try {
        const response = await axios.get("http://localhost:8000/chats", {
            headers: {
                Authorization: `Bearer ${accessToken}`, // 인증 필요시 추가
            },
        });

        console.log(response); // 응답 데이터 확인

        // 현재 product.id와 일치하는 채팅방 개수 계산
        const filteredChatrooms = response.data.chatrooms.filter(
            (chat) => chat.product_id === product.id
        );

        console.log("Filtered Chatrooms:", filteredChatrooms); // 필터링된 채팅방 확인

        // 채팅방 개수 설정
        setChatroomCount(filteredChatrooms.length);
    } catch (error) {
        console.error("Failed to fetch chatrooms:", error);
    }
  };

  fetchChatrooms();

  const handleChatClick = async (productId) => {
    try {
        await axios.post("/chats", { product_id: productId }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // 채팅방 추가 후 목록 다시 불러오기
        fetchChatrooms();
    } catch (error) {
        console.error("Failed to create chatroom:", error);
    }
  };

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
      } catch (error) {
        console.error("❌ 데이터를 가져오지 못했습니다.", error);
      }
    };
    fetchProductData();
  }, [id]);

  // 제품 데이터가 로드된 후, 조회수 업데이트 API 호출
  const [hasFetchedViews, setHasFetchedViews] = useState(false);  

  useEffect(() => {
    if (product && product.id && !hasFetchedViews) {
      fetchViewCount({ productId: product.id });
      setHasFetchedViews(true);  // 조회수 업데이트 후 상태 변경
    }
  }, [product, hasFetchedViews]);


  // 좋아요 상태 가져오기 (로그인된 경우만 요청)
  useEffect(() => {
    if (!id || !userId) return; // userId가 없으면 요청하지 않음

    const fetchLikeStatus = async () => {
      try {
        const likeResponse = await axios.get(
          `${API_BASE_URL}/products/${id}/likes`,
          {
            params: { user_id: userId },
          }
        );
        setLiked(likeResponse.data.liked);
        setHeartCount(likeResponse.data.count);
      } catch (error) {
        console.error("좋아요 상태를 가져오지 못했습니다.", error);
      }
    };

    fetchLikeStatus();
    getHeartCount();
  }, [id, userId]);

  // 이미지 이전/다음 버튼 기능 추가
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

  // 댓글 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/comments`, {
          params: { product_id: id },
        });
        setComments(response.data.comments);
      } catch (error) {
        console.error("댓글을 가져오지 못했습니다.", error);
      }
      };

    fetchComments();
  }, [id]);

  // 댓글 추가 (로그인 필수)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!commentText.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/comments`,
        { product_id: id, content: commentText },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const response = await axios.get(`${API_BASE_URL}/comments`, {
        params: { product_id: id },
      });
      setComments(response.data.comments);
      setCommentText("");
    } catch (error) {
      console.error("댓글을 추가하지 못했습니다.", error);
    }
  };

  // 댓글 수정
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    if (!accessToken) {
      console.warn("저장 불가: accessToken 없음");
      return;
    }

    console.log(`댓글 수정 요청: ID ${commentId}, 내용: ${editText}`);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/comments/${commentId}`,
        { content: editText }, // JSON body로 `content` 전달
        {
          headers: {
            "Content-Type": "application/json", // JSON 형식으로 전달
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("댓글 수정 성공", response.data);

      // 수정 후 댓글 목록 다시 불러오기
      const updatedComments = await axios.get(`${API_BASE_URL}/comments`, {
        params: { product_id: id },
      });
      setComments(updatedComments.data.comments);
      setEditingCommentId(null); // 수정 상태 초기화
    } catch (error) {
      console.error(
        "댓글을 수정하지 못했습니다.",
        error.response ? error.response.data : error
      );
    }
  };
  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!accessToken) return;

    try {
      await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("댓글을 삭제하지 못했습니다.", error);
    }
  };
  const getHeartCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);
      setHeartCount(response.data.product.heart_count);
    } catch (error) {
      console.error("좋아요 개수를 가져오지 못했습니다.", error);
    }
  };
  const handleLikeToggle = async () => {
    console.log("좋아요 토글");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!product?.id || !userId) return; // userId가 없을 경우 요청 차단

    try {
      if (liked) {
        // 좋아요 취소 (DELETE 요청을 JSON Body로 전송)
        await axios.delete(`${API_BASE_URL}/products/${product.id}/likes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          data: { user_id: userId }, // DELETE 요청의 body에 user_id 포함
        });

        console.log("좋아요 취소 성공");
        setLiked(false);
      } else {
        // 좋아요 추가 (POST 요청)
        await axios.post(
          `${API_BASE_URL}/products/${product.id}/likes`,
          { user_id: userId }, // JSON Body로 user_id 전달
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("좋아요 추가 성공");
        setLiked(true);
      }
    } catch (error) {
      console.error("좋아요 변경 실패", error);
    }
    getHeartCount();
  };

const goToChatRoom = async (productId) => {
  const accessToken = sessionStorage.getItem("access_token");
  if (!accessToken) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    // 상품 정보를 가져옴 (여기서는 axios를 사용해서 상품 정보를 가져오는 예시)
    const productResponse = await axios.get(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const productUserId = productResponse.data.user_id;
    const userId = decodeJwt(accessToken).user_id;  // JWT에서 user_id를 추출하는 함수 (적절히 구현 필요)

    // 채팅방 생성 요청
    const response = await axios.post(`${API_BASE_URL}/products/${productId}/chats`, {}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // 공백과 함께 Bearer 토큰을 정확히 설정
      },
    });

    const chatroomId = response.data.chatroom_id;
    navigate(`/chat/${chatroomId}`);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // 401 오류가 발생하면 로그인 만료 처리
      alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
      sessionStorage.removeItem("access_token");  // 토큰 삭제
      sessionStorage.removeItem("refresh_token");  // 리프레시 토큰 삭제 (필요시)
      // 로그인 페이지로 리다이렉트
      navigate("/login");
    } else {
      console.error("채팅방 생성 실패", error);
      alert("채팅방을 만들 수 없습니다.");
    }
  }
};

// JWT 토큰에서 user_id를 추출하는 함수 (예시)
const decodeJwt = (token) => {
  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));
  return decoded;
};
  
  // **구매하기** 기능 추가
  const handlePurchase = async () => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // **구매 API 호출 (실제 API 엔드포인트에 맞게 수정)**
      const response = await axios.post(
        `${API_BASE_URL}/products/${id}/purchase`, // 예시 URL
        {}, // 필요한 경우 request body 추가
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // **구매 성공 알림 또는 처리**
      alert("상품 구매 대기가 완료되었습니다.");
      console.log("상품 구매 대기 성공:", response.data);

      // **구매 후 처리 (예: 페이지 리디렉션, 상태 업데이트 등)**
      // 예시: 구매 완료 페이지로 이동
      // navigate('/purchase-complete');
    } catch (error) {
      console.error("상품 구매 대기 중 오류 발생:", error);
      alert("상품 구매 대기에 실패했습니다.");
    }
  };

  // 카테고리 옵션 목록
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
            {
              categories.find((c) => c.id === product.category_id)?.name ||
              "기타"
            }
          </p>
          <p className="product-price">
            {product?.price?.toLocaleString() ?? "가격 정보 없음"}원
          </p>
          <div className="product-description">
            <p>{product.content}</p>
          </div>
          <div className="meta-info">
            <p>채팅 {chatroomCount} · 관심 {heartCount} · 조회 {views}</p>
          </div>
          <div className="button-section">
            <button
              className={`like-btn ${liked ? "liked" : ""}`}
              onClick={handleLikeToggle}
              disabled={!accessToken} // 로그인되지 않으면 버튼 비활성화
            >
              {liked ? "💖" : "🤍"}
            </button>
            <button
              className="cta-btn"
              onClick={() => {
                goToChatRoom(product.id); 
                handleChatClick(product.id);
              }}
              disabled={!accessToken}
            >
              채팅하기
            </button>
            {/* **구매하기 버튼** */}
            <button
              className="purchase-btn"
              onClick={handlePurchase}
              disabled={!accessToken}
            >
              🔔
            </button>
          </div>
        </section>
      </div>

      {/* 댓글 섹션 */}
      <div className="comment-section">
        <h2>댓글</h2>

        {/* 댓글 작성 폼 */}
        <form id="comment-form" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            id="comment-input"
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button type="submit" disabled={!accessToken}>
            작성
          </button>
        </form>
        {!accessToken && <p style={{ color: "red" }}>로그인이 필요합니다.</p>}

        <ul id="comment-list">
  {comments.length > 0 ? (
    comments.map((comment) => (
      <li key={comment.id} className="comment-item">
        <div className="comment-header">
          <div className="comment-meta">
            <span className="comment-user">User ID: {comment.user_id}</span>
            <span className="comment-separator"> | </span>
            <span className="comment-date">
              {new Date(comment.last_modified).toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
        </div>
        <div className="comment-edit-container">
          {editingCommentId === comment.id ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="comment-input"
            />
          ) : (
            <p className="comment-content">{comment.content}</p>
          )}
          {userId && comment.user_id === userId && (
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
        </div>
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
