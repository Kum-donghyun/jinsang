import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFire, FaClock, FaChevronRight } from 'react-icons/fa';
import api from '../api';
import { INTERACTIVE_ITEMS } from './InteractiveContent';
import './Home.css';

const CATEGORY_ITEMS = [
  { slug: 'cs', name: '서비스게시판', emoji: '🛎️' },
  { slug: 'work', name: '직장게시판', emoji: '💼' },
  { slug: 'drive', name: '운전게시판', emoji: '🚗' },
  { slug: 'sales', name: '판매직게시판', emoji: '🏪' },
  { slug: 'education', name: '교직게시판', emoji: '📚' },
  { slug: 'relationship', name: '인간관계게시판', emoji: '👥' },
  { slug: 'free', name: '자유게시판', emoji: '✏️' },
  { slug: 'secret', name: '비밀게시판', emoji: '🔒' },
  { slug: 'market', name: '장터게시판', emoji: '🛒' },
  { slug: 'info', name: '정보게시판', emoji: 'ℹ️' },
  { slug: 'promotion', name: '홍보게시판', emoji: '📢' },
];

export default function Home() {
  const navigate = useNavigate();
  const [trending, setTrending] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDir, setSlideDir] = useState('left'); // 'left' | 'right'
  const autoTimerRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  // 배너 자동 슬라이드 (4초마다)
  useEffect(() => {
    startAutoTimer();
    return () => clearAutoTimer();
  }, [bannerIndex]);

  const startAutoTimer = () => {
    clearAutoTimer();
    autoTimerRef.current = setTimeout(() => {
      goTo((bannerIndex + 1) % INTERACTIVE_ITEMS.length, 'left');
    }, 4000);
  };

  const clearAutoTimer = () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
  };

  const goTo = (idx, dir = 'left') => {
    if (isAnimating || idx === bannerIndex) return;
    setSlideDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setBannerIndex(idx);
      setIsAnimating(false);
    }, 320);
  };

  const loadData = async () => {
    try {
      const [trendRes, latestRes] = await Promise.all([
        api.get('/posts/trending'),
        api.get('/posts?sort=latest&limit=10'),
      ]);
      setTrending(trendRes.data);
      setLatestPosts(latestRes.data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentItem = INTERACTIVE_ITEMS[bannerIndex];

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}분 전`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="home">
      {/* 인터랙티브 콘텐츠 슬라이더 배너 */}
      <div
        className={`interactive-banner ${isAnimating ? `slide-out-${slideDir}` : 'slide-in'}`}
        style={{ background: currentItem.bgGradient, borderColor: currentItem.borderColor }}
        onClick={() => navigate(`/interactive/${currentItem.slug}`)}
      >
        <div className="banner-content">
          <div className="banner-left">
            <span className="banner-tag" style={{ background: currentItem.accentColor }}>인터랙티브</span>
            <h2 style={{ color: currentItem.accentColor }}>{currentItem.emoji} {currentItem.name}</h2>
            <p className="banner-subtitle">{currentItem.subtitle}</p>
            <span className="banner-counter" style={{ color: currentItem.accentColor }}>
              {bannerIndex + 1} / {INTERACTIVE_ITEMS.length}
            </span>
          </div>
          <div className="banner-right">
            <div className="vs-characters">
              <span className="character-a">{currentItem.vsA}</span>
              <span className="vs-text" style={{ color: currentItem.accentColor }}>VS</span>
              <span className="character-b">{currentItem.vsB}</span>
            </div>
            <button
              className="vote-cta-btn"
              style={{ background: currentItem.accentColor }}
              onClick={(e) => { e.stopPropagation(); navigate(`/interactive/${currentItem.slug}`); }}
            >
              판결하러 가기
            </button>
          </div>
        </div>
        {/* 인디케이터 */}
        <div className="banner-dots">
          {INTERACTIVE_ITEMS.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === bannerIndex ? 'active' : ''}`}
              style={i === bannerIndex ? { background: currentItem.accentColor, width: 32 } : {}}
              onClick={(e) => { e.stopPropagation(); goTo(i, i > bannerIndex ? 'left' : 'right'); }}
            />
          ))}
        </div>
      </div>

      {/* 카테고리 섹션 */}
      <div className="section">
        <h3 className="section-title">카테고리</h3>
        <div className="category-list">
          {CATEGORY_ITEMS.map((cat) => (
            <Link to={`/category/${cat.slug}`} key={cat.slug} className="category-row">
              <div className="category-row-left">
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name"><b>{cat.name}</b></span>
              </div>
              <div className="category-row-right">
                <span className="badge badge-new">N</span>
                <FaChevronRight className="chevron" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 인기 급상승 섹션 */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title"><FaFire style={{ color: '#FF6B6B' }} /> 인기 급상승</h3>
        </div>
        <div className="post-list">
          {trending.slice(0, 5).map((post, i) => (
            <Link to={`/post/${post.id}`} key={post.id} className="post-item">
              <span className="post-rank">{i + 1}</span>
              <div className="post-item-body">
                <span className="post-item-category">{post.category_name}</span>
                <p className="post-item-title">{post.title}</p>
                <div className="post-item-meta">
                  <span>{post.display_name}</span>
                  <span>❤️ {post.like_count}</span>
                  <span>💬 {post.comment_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 최신글 섹션 */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title"><FaClock style={{ color: 'var(--primary)' }} /> 최신글</h3>
        </div>
        <div className="post-list">
          {latestPosts.slice(0, 5).map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="post-item">
              <div className="post-item-body">
                <span className="post-item-category">{post.category_name}</span>
                <p className="post-item-title">{post.title}</p>
                <div className="post-item-meta">
                  <span>{post.display_name}</span>
                  <span>{timeAgo(post.created_at)}</span>
                  <span>❤️ {post.like_count}</span>
                  <span>💬 {post.comment_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
