import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import api from '../api';
import './Ranking.css';

export default function Ranking() {
  const [posts, setPosts] = useState([]);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, [period]);

  const loadRanking = async () => {
    setLoading(true);
    try {
      const endpoint = period === 'weekly' ? '/posts/weekly-best' : '/posts/trending';
      const res = await api.get(endpoint);
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy style={{ color: '#FFD700', fontSize: 20 }} />;
    if (index === 1) return <FaMedal style={{ color: '#C0C0C0', fontSize: 18 }} />;
    if (index === 2) return <FaMedal style={{ color: '#CD7F32', fontSize: 18 }} />;
    return <span className="rank-num">{index + 1}</span>;
  };

  return (
    <div className="ranking-page">
      <div className="ranking-tabs">
        <button
          className={`ranking-tab ${period === 'weekly' ? 'active' : ''}`}
          onClick={() => setPeriod('weekly')}
        >
          🏆 주간 베스트
        </button>
        <button
          className={`ranking-tab ${period === 'trending' ? 'active' : ''}`}
          onClick={() => setPeriod('trending')}
        >
          🔥 인기 급상승
        </button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <p>아직 랭킹 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="ranking-list">
          {posts.map((post, i) => (
            <Link to={`/post/${post.id}`} key={post.id} className="ranking-item">
              <div className="ranking-rank">{getRankIcon(i)}</div>
              <div className="ranking-body">
                <span className="ranking-category">{post.category_name}</span>
                <h4 className="ranking-title">{post.title}</h4>
                <div className="ranking-meta">
                  <span>{post.display_name}</span>
                  <span>❤️ {post.like_count}</span>
                  <span>💬 {post.comment_count}</span>
                  <span>👁 {post.view_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
