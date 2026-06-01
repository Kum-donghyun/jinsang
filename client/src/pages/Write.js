import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import './Write.css';

export default function Write() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [voteOptionA, setVoteOptionA] = useState('글쓴이 잘못');
  const [voteOptionB, setVoteOptionB] = useState('상대방 잘못');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.info('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    loadCategories();
  }, [user, navigate]);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      if (res.data.length > 0) setCategoryId(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return toast.warning('제목을 입력해주세요.');
    if (!content.trim()) return toast.warning('내용을 입력해주세요.');
    if (!categoryId) return toast.warning('카테고리를 선택해주세요.');

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category_id', categoryId);
      formData.append('is_anonymous', isAnonymous);
      formData.append('vote_option_a', voteOptionA);
      formData.append('vote_option_b', voteOptionB);
      if (image) formData.append('image', image);

      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('게시글이 작성되었습니다!');
      navigate(`/post/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || '오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="write-page">
      {/* 카테고리 선택 */}
      <div className="write-section">
        <label className="write-label">카테고리</label>
        <select className="input-field" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 익명 토글 */}
      <div className="write-section write-row">
        <label className="write-label">익명으로 작성</label>
        <label className="toggle-switch">
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
          <span className="toggle-slider"></span>
        </label>
      </div>

      {/* 제목 */}
      <div className="write-section">
        <label className="write-label">제목</label>
        <input
          className="input-field"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>

      {/* 본문 */}
      <div className="write-section">
        <label className="write-label">내용</label>
        <textarea
          className="input-field write-textarea"
          placeholder="사연을 자유롭게 작성해주세요.&#10;&#10;어떤 상황이었는지, 누가 더 잘못했다고 생각하는지 등을 적어주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />
      </div>

      {/* 투표 옵션 */}
      <div className="write-section">
        <label className="write-label">⚖️ 투표 선택지</label>
        <div className="vote-options-input">
          <div className="vote-opt">
            <span className="vote-opt-label a">A</span>
            <input
              className="input-field"
              placeholder="선택지 A (예: 글쓴이 잘못)"
              value={voteOptionA}
              onChange={(e) => setVoteOptionA(e.target.value)}
            />
          </div>
          <div className="vote-opt">
            <span className="vote-opt-label b">B</span>
            <input
              className="input-field"
              placeholder="선택지 B (예: 상대방 잘못)"
              value={voteOptionB}
              onChange={(e) => setVoteOptionB(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div className="write-section">
        <label className="write-label">이미지 첨부</label>
        <label className="image-upload-area">
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          {preview ? (
            <img src={preview} alt="미리보기" className="image-preview" />
          ) : (
            <div className="image-placeholder">
              <FaImage size={24} />
              <span>이미지를 선택하세요</span>
            </div>
          )}
        </label>
      </div>

      {/* 작성 버튼 */}
      <div className="write-section">
        <button
          className="btn btn-primary btn-full write-submit"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? '업로드 중...' : '게시글 작성하기'}
        </button>
      </div>
    </div>
  );
}
