import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/CreatePostPage.css";

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const maxImages = 5;

  const navigate = useNavigate();
  const API_URL = "/api";
  const accessToken = localStorage.getItem("access_token");

  console.log("현재 저장된 토큰:", accessToken);

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories/`);
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(response.data[0].id); // 기본값 설정
        }
      } catch (error) {
        console.error("카테고리 불러오기 실패:", error);
      }
    };

    fetchCategories();
  }, []);

  // 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + imageFiles.length > maxImages) {
      alert(`이미지는 최대 ${maxImages}개까지 업로드할 수 있습니다.`);
      return;
    }
    setImageFiles([...imageFiles, ...files]);
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const isFormValid = title && price && content && categoryId;

  // 게시글 등록 요청
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    const postData = {
      title,
      price: parseInt(price, 10),
      content,
      category_id: categoryId,
    };

    try {
      const response = await axios.post(`${API_URL}/products`, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("게시글 등록 성공:", response.data);
      alert("게시글이 등록되었습니다!");

      // 이미지 업로드
      if (imageFiles.length > 0) {
        const productId = response.data.product.id;
        imageFiles.forEach(async (file) => {
          let formData = new FormData();
          formData.append("image", file);
          await axios.post(`${API_URL}/products/${productId}/image`, formData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          });
        });
        console.log("이미지 업로드 완료");
      }

      navigate("/");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="title">중고거래 글쓰기</h1>

      <div className="image-upload-container">
        <label className="image-box">
          {imageFiles.length < maxImages ? (
            <>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <span className="image-icon">📷</span>
              <p className="image-count">{imageFiles.length}/{maxImages}</p>
            </>
          ) : (
            <p>최대 {maxImages}장</p>
          )}
        </label>

        <div className="image-preview-container">
          {imageFiles.map((file, index) => (
            <div key={index} className="image-preview">
              <img src={URL.createObjectURL(file)} alt={`upload-${index}`} />
              <button className="delete-button" onClick={() => handleRemoveImage(index)}>❌</button>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="글 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="₩ 가격"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />
        <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value, 10))} className="input-field">
          {categories.length > 0 ? (
            categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))
          ) : (
            <option value="">카테고리를 불러오는 중...</option>
          )}
        </select>

        <textarea
          placeholder="게시글 내용을 작성해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea-field"
        />

        <button type="submit" className="submit-button" disabled={!isFormValid}>
          등록 하기
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
