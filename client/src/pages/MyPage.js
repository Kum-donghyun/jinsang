import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight, FaPen, FaHeart, FaVoteYea, FaComment, FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import './MyPage.css';

export default function MyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [tabData, setTabData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleTab = async (tab) => {
    if (activeTab === tab) { setActiveTab(null); return; }
    setActiveTab(tab);
    setLoading(true);
    try {
      const endpoints = {
        posts: '/users/my-posts',
        liked: '/users/liked-posts',
        voted: '/users/voted-posts',
        comments: '/users/my-comments'
      };
      const res = await api.get(endpoints[tab]);
      setTabData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      toast.success('로그아웃되었습니다.');
      navigate('/');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return;
    try {
      await api.delete('/users/account');
      logout();
      toast.success('탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (err) {
      toast.error('오류가 발생했습니다.');
    }
  };

  if (!user) return null;

  return (
    <div className="mypage">
      {/* 프로필 */}
      <div className="profile-section">
        <div className="profile-avatar">
          <FaUserCircle size={60} color="var(--gray-300)" />
        </div>
        <h2 className="profile-nickname">{user.nickname}</h2>
        <p className="profile-username">@{user.username}</p>
        <button className="btn btn-outline" onClick={() => navigate('/edit-profile')}>
          프로필 수정
        </button>
      </div>

      {/* 메뉴 */}
      <div className="mypage-menu">
        <button className={`menu-item ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => handleTab('posts')}>
          <FaPen className="menu-icon" />
          <span>내가 쓴 글</span>
          <FaChevronRight className="menu-arrow" />
        </button>

        <button className={`menu-item ${activeTab === 'liked' ? 'active' : ''}`} onClick={() => handleTab('liked')}>
          <FaHeart className="menu-icon" style={{ color: '#FF6B6B' }} />
          <span>좋아요한 글</span>
          <FaChevronRight className="menu-arrow" />
        </button>

        <button className={`menu-item ${activeTab === 'voted' ? 'active' : ''}`} onClick={() => handleTab('voted')}>
          <FaVoteYea className="menu-icon" style={{ color: '#2C5282' }} />
          <span>투표한 글</span>
          <FaChevronRight className="menu-arrow" />
        </button>

        <button className={`menu-item ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => handleTab('comments')}>
          <FaComment className="menu-icon" style={{ color: '#4CAF50' }} />
          <span>내가 쓴 댓글</span>
          <FaChevronRight className="menu-arrow" />
        </button>
      </div>

      {/* 탭 데이터 */}
      {activeTab && (
        <div className="tab-data-section">
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : tabData.length === 0 ? (
            <div className="empty-state" style={{ padding: '20px' }}>
              <p>데이터가 없습니다.</p>
            </div>
          ) : (
            <div className="tab-data-list">
              {tabData.map((item, i) => (
                <Link
                  to={`/post/${activeTab === 'comments' ? item.post_id : item.id}`}
                  key={i}
                  className="tab-data-item"
                >
                  <h4>{activeTab === 'comments' ? item.post_title : item.title}</h4>
                  {activeTab === 'comments' && (
                    <p className="tab-comment-text">"{item.content}"</p>
                  )}
                  <div className="tab-data-meta">
                    {item.category_name && <span className="badge badge-category">{item.category_name}</span>}
                    {item.vote_option && <span className="badge badge-hot">{item.vote_option} 선택</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 계정 관리 */}
      <div className="mypage-menu" style={{ marginTop: '16px' }}>
        <div className="menu-section-title">계정관리</div>
        <button className="menu-item" onClick={() => navigate('/edit-profile')}>
          <FaCog className="menu-icon" />
          <span>비밀번호 변경</span>
          <FaChevronRight className="menu-arrow" />
        </button>
        <button className="menu-item" onClick={handleLogout}>
          <FaSignOutAlt className="menu-icon" />
          <span>로그아웃</span>
          <FaChevronRight className="menu-arrow" />
        </button>
        <button className="menu-item danger" onClick={handleDeleteAccount}>
          <span>회원 탈퇴</span>
          <FaChevronRight className="menu-arrow" />
        </button>
      </div>
    </div>
  );
}
