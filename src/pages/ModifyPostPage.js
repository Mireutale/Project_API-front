import React, { useState, useEffect, use } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";  // ✅ useNavigate 추가
import axios from "axios";
import "../css/CreatePostPage.css";

const ModifyPostPage = () => {
  const { product_id } = useParams();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // ✅ File 객체를 저장하는 배열 추가
  const [imageIDs, setImageIDs] = useState([]);
  const [categoryId, setCategoryId] = useState(1);
  const maxImages = 5;


  const navigate = useNavigate();  // ✅ useNavigate 설정
  const API_URL = "http://localhost:8000";

  // ✅ localStorage에서 토큰 가져오기
  const accessToken = localStorage.getItem("access_token");
  console.log("🛠️ 현재 저장된 토큰:", accessToken);

  // ✅ 카테고리 옵션 목록
  const categories = [
    { id: 1, name: "전자기기" },
    { id: 2, name: "의류" },
    { id: 3, name: "가구" },
    { id: 4, name: "도서" },
    { id: 5, name: "기타" },
  ];

  // ✅ 이미지 업로드 핸들러 (File 객체 저장)
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    if (files.length + imageFiles.length > maxImages) {
      alert(`이미지는 최대 ${maxImages}개까지 업로드할 수 있습니다.`);
      return;
    }
    setImageFiles([...imageFiles, ...files]); // ✅ File 객체 저장
    files.forEach((file) => {
        // image_id 설정
        uploadImage(file).then((productImage) => {
            console.log(productImage);
            setImageIDs((prev) => [...prev, productImage.id]);
        });
    });
  };

  // ✅ 이미지 삭제 핸들러
  const handleRemoveImage = async (index) => {
    const image_id = imageIDs[index];
    await deleteImage(image_id);
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImageIDs(imageIDs.filter((_, i) => i !== index));
  };

  const isFormValid = title && price && content;

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${product_id}`);
      const product = response.data.product;
      const productImages = response.data.productImages;

      setTitle(product.title);
      setPrice(product.price);
      setContent(product.content);
      setCategoryId(product.category_id);
      fetchImageFiles(productImages);
    } catch (error) {
        console.error("상품 정보 불러오기 실패:", error);
    }
  };
  const fetchImageFiles = async (productImages) => {
    try {
      const imageFiles = await Promise.all(
        productImages.map(async (productImage) => {
          const imageUrl = `${API_URL}/uploads/${productImage.image_URI}`;
          const response = await fetch(imageUrl);
  
          if (!response.ok) throw new Error("이미지 로드 실패");
  
          const blob = await response.blob();
          setImageIDs((prev) => [...prev, productImage.id]);
        console.log("살려주세요");
          console.log(imageIDs);
          return new File([blob], productImage.image_URI.split('/').pop(), { type: blob.type });
        })
      );
  
      setImageFiles(imageFiles);
    } catch (error) {
      console.error("이미지 파일 변환 중 오류 발생:", error);
    }
  };
  const uploadImage = async (file) => {
    try {
      let formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(`${API_URL}/products/${product_id}/image`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("이미지 업로드 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }
  }
  const deleteImage = async (image_id) => {
    try {
      await axios.delete(`${API_URL}/products/${product_id}/image/${image_id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        });
        console.log("이미지 삭제 성공");
    } catch (error) {
        console.error("이미지 삭제 실패:", error);
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [product_id]);

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
      // ✅ 게시글 등록 요청 (토큰 포함)
      const response = await axios.put(`${API_URL}/products/${product_id}`, postData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("게시글 등록 성공:", response.data);
      alert("게시글이 수정정되었습니다!");

      // ✅ 홈 페이지로 이동
      navigate(`/product/${product_id}`);  // ✅ window.location.href 대신 SPA 방식 유지
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="title">수정</h1>

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

        {/* ✅ 카테고리 선택 */}
        <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value, 10))} className="input-field">
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
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

export default ModifyPostPage;