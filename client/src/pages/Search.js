import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../api';
import './Search.css';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(keyword)}`);
      setResults(res.data.posts);
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
    <div className="search-page">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-btn" onClick={handleSearch}>검색</button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : searched && results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>'{keyword}'에 대한 검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="search-results">
          {searched && <p className="result-count">검색 결과 {results.length}건</p>}
          {results.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="search-item">
              <span className="badge badge-category">{post.category_name}</span>
              <h4>{post.title}</h4>
              <p className="search-excerpt">{post.content?.substring(0, 60)}...</p>
              <div className="search-meta">
                <span>{post.display_name}</span>
                <span>{timeAgo(post.created_at)}</span>
                <span>❤️ {post.like_count}</span>
                <span>💬 {post.comment_count}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
