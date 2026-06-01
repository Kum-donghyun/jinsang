import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFire, FaClock, FaGavel } from 'react-icons/fa';
import api from '../api';
import './CategoryList.css';

const SORT_TABS = [
  { key: 'latest', label: '최신글', icon: <FaClock /> },
  { key: 'popular', label: '인기글', icon: <FaFire /> },
  { key: 'verdict', label: '판결글', icon: <FaGavel /> },
];

const CATEGORY_NAMES = {
  cs: '서비스', work: '직장', drive: '운전', sales: '판매직',
  education: '교직', relationship: '인간관계', free: '자유',
  secret: '비밀', market: '장터', info: '정보', promotion: '홍보'
};

export default function CategoryList() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPosts();
  }, [slug, sort, page]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts?category=${slug}&sort=${sort}&page=${page}`);
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}분 전`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

  return (
    <div className="category-page">
      <div className="sub-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <span className="sub-title">{CATEGORY_NAMES[slug] || slug} 게시판</span>
      </div>

      {/* 오늘의 판결 배너 */}
      <div className="verdict-banner" onClick={() => navigate('/')}>
        <div className="verdict-banner-inner">
          <span className="verdict-icon">⚖️</span>
          <div>
            <h3>오늘의 판결 (오판)</h3>
            <p>이번 주 가장 뜨거운 사연을 확인하세요!</p>
          </div>
          <span className="verdict-arrow">→</span>
        </div>
      </div>

      {/* 정렬 탭 */}
      <div className="tabs">
        {SORT_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab ${sort === tab.key ? 'active' : ''}`}
            onClick={() => { setSort(tab.key); setPage(1); }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 게시글 목록 */}
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>아직 게시글이 없습니다.</p>
        </div>
      ) : (
        <div className="cat-post-list">
          {posts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="cat-post-item">
              <div className="cat-post-header">
                <span className="badge badge-category">{post.category_name}</span>
                {post.is_popular === 1 && <span className="badge badge-hot">HOT</span>}
              </div>
              <h4 className="cat-post-title">{post.title}</h4>
              <p className="cat-post-excerpt">
                {post.content?.substring(0, 80)}{post.content?.length > 80 ? '...' : ''}
              </p>
              <div className="cat-post-meta">
                <span>{post.display_name}</span>
                <span>{timeAgo(post.created_at)}</span>
                <span>👁 {post.view_count}</span>
                <span>❤️ {post.like_count}</span>
                <span>💬 {post.comment_count}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? 'active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
