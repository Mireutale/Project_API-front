import React, { useState } from "react";
import "../css/CreatePostPage.css"; // 스타일 추가

const CreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const maxImages = 5;

  // ✅ 이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > maxImages) {
      alert(`이미지는 최대 ${maxImages}개까지 업로드할 수 있습니다.`);
      return;
    }

    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...imageUrls]);
  };

  // ✅ 이미지 삭제 핸들러
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // ✅ 등록 버튼 활성화 여부
  const isFormValid = title && price && content;

  // ✅ 등록하기 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    const postData = { title, price, location, content, images };
    console.log("게시글 데이터:", postData);

    // TODO: 백엔드 API로 데이터 전송
  };

  return (
    <div className="create-post-container">
      <h1 className="title">중고거래 글쓰기</h1>

      {/* 이미지 업로드 */}
      <div className="image-upload-container">
        <label className="image-box">
          {images.length < maxImages ? (
            <>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <span className="image-icon">📷</span>
              <p className="image-count">{images.length}/{maxImages}</p>
            </>
          ) : (
            <p>최대 {maxImages}장</p>
          )}
        </label>

        {/* 이미지 미리보기 */}
        <div className="image-preview-container">
          {images.map((img, index) => (
            <div key={index} className="image-preview">
              <img src={img} alt={`upload-${index}`} />
              <button className="delete-button" onClick={() => handleRemoveImage(index)}>❌</button>
            </div>
          ))}
        </div>
      </div>

      {/* 입력 필드 */}
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
        <input type="text" value={location} readOnly className="input-field readonly" />

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
