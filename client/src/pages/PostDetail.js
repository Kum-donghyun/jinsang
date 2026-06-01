import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaRegHeart, FaShareAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import './PostDetail.css';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isAnonComment, setIsAnonComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [voteStatus, setVoteStatus] = useState({ voted: false, myVote: null, vote_options: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
    loadComments();
    if (user) {
      checkLikeStatus();
      checkVoteStatus();
    }
  }, [id, user]);

  const loadPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      toast.error('게시글을 불러올 수 없습니다.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await api.get(`/comments/post/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkLikeStatus = async () => {
    try {
      const res = await api.get(`/posts/${id}/like-status`);
      setLiked(res.data.liked);
    } catch (err) {}
  };

  const checkVoteStatus = async () => {
    try {
      const res = await api.get(`/votes/status/${id}`);
      setVoteStatus(res.data);
    } catch (err) {}
  };

  const handleLike = async () => {
    if (!user) return toast.info('로그인이 필요합니다.');
    try {
      const res = await api.post(`/posts/${id}/like`);
      setLiked(res.data.liked);
      setPost((prev) => ({
        ...prev,
        like_count: prev.like_count + (res.data.liked ? 1 : -1)
      }));
    } catch (err) {
      toast.error('오류가 발생했습니다.');
    }
  };

  const handleVote = async (option) => {
    if (!user) return toast.info('로그인이 필요합니다.');
    if (voteStatus.voted) return toast.info('이미 투표하셨습니다.');
    try {
      const res = await api.post('/votes', { post_id: id, vote_option: option });
      setVoteStatus({ voted: true, myVote: option, vote_options: res.data.vote_options });
      toast.success('투표 완료! 🗳️');
    } catch (err) {
      toast.error(err.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  const handleComment = async () => {
    if (!user) return toast.info('로그인이 필요합니다.');
    if (!newComment.trim()) return;
    try {
      await api.post('/comments', {
        post_id: id,
        content: newComment,
        is_anonymous: isAnonComment
      });
      setNewComment('');
      loadComments();
      setPost((prev) => ({ ...prev, comment_count: prev.comment_count + 1 }));
      toast.success('댓글이 작성되었습니다.');
    } catch (err) {
      toast.error('오류가 발생했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      loadComments();
      setPost((prev) => ({ ...prev, comment_count: prev.comment_count - 1 }));
    } catch (err) {
      toast.error('삭제 권한이 없습니다.');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success('링크가 복사되었습니다!');
    }
  };

  const getVotePercent = (optionLabel) => {
    const options = voteStatus.vote_options || post?.vote_options || [];
    const total = options.reduce((sum, o) => sum + o.vote_count, 0);
    if (total === 0) return 50;
    const opt = options.find((o) => o.option_label === optionLabel);
    return Math.round((opt?.vote_count || 0) / total * 100);
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}분 전`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!post) return null;

  const percentA = getVotePercent('A');
  const percentB = getVotePercent('B');
  const voteOptions = voteStatus.vote_options.length > 0 ? voteStatus.vote_options : (post.vote_options || []);
  const optA = voteOptions.find(o => o.option_label === 'A');
  const optB = voteOptions.find(o => o.option_label === 'B');

  return (
    <div className="post-detail">
      {/* 헤더 */}
      <div className="sub-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <span className="sub-title">{post.category_name}</span>
        <button className="share-btn" onClick={handleShare}><FaShareAlt /></button>
      </div>

      {/* 본문 */}
      <div className="post-body">
        <div className="post-author-row">
          <div className="post-avatar">
            {post.display_name?.[0] || '?'}
          </div>
          <div>
            <span className="post-author-name">{post.display_name}</span>
            <span className="post-time">{timeAgo(post.created_at)} · 조회 {post.view_count}</span>
          </div>
        </div>

        <h2 className="post-title">{post.title}</h2>
        <div className="post-content">{post.content}</div>

        {post.image_url && (
          <img src={`http://localhost:5000${post.image_url}`} alt="" className="post-image" />
        )}

        {/* 투표 영역 */}
        <div className="vote-section">
          <h3 className="vote-title">⚖️ 누가 더 잘못했나?</h3>
          
          {!voteStatus.voted ? (
            <div className="vote-buttons">
              <button className="vote-btn vote-btn-a" onClick={() => handleVote('A')}>
                <span className="vote-label">A</span>
                <span>{optA?.option_text || '선택지 A'}</span>
              </button>
              <div className="vs-badge">VS</div>
              <button className="vote-btn vote-btn-b" onClick={() => handleVote('B')}>
                <span className="vote-label">B</span>
                <span>{optB?.option_text || '선택지 B'}</span>
              </button>
            </div>
          ) : (
            <div className="vote-result">
              <div className="vote-bar">
                <div className="vote-bar-a" style={{ width: `${percentA}%` }}>
                  {optA?.option_text} {percentA}%
                </div>
                <div className="vote-bar-b" style={{ width: `${percentB}%` }}>
                  {optB?.option_text} {percentB}%
                </div>
              </div>
              <p className="vote-my">
                내 투표: <strong>{voteStatus.myVote === 'A' ? optA?.option_text : optB?.option_text}</strong>
              </p>
            </div>
          )}
        </div>

        {/* 좋아요 & 공유 */}
        <div className="post-actions">
          <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span>{post.like_count}</span>
          </button>
          <button className="action-btn" onClick={handleShare}>
            <FaShareAlt />
            <span>공유</span>
          </button>
        </div>
      </div>

      {/* 댓글 */}
      <div className="comments-section">
        <h3 className="comments-title">💬 댓글 {post.comment_count}</h3>
        
        <div className="comment-list">
          {comments.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>아직 댓글이 없습니다.</p>
            </div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment-item">
                <div className="comment-header">
                  <div className="comment-avatar">{c.display_name?.[0]}</div>
                  <span className="comment-name">{c.display_name}</span>
                  <span className="comment-time">{timeAgo(c.created_at)}</span>
                  {user && user.id === c.user_id && (
                    <button className="comment-delete" onClick={() => handleDeleteComment(c.id)}>
                      <FaTrash size={11} />
                    </button>
                  )}
                </div>
                <p className="comment-content">{c.content}</p>
              </div>
            ))
          )}
        </div>

        {/* 댓글 입력 */}
        <div className="comment-input-area">
          <div className="comment-input-row">
            <label className="anon-check">
              <input type="checkbox" checked={isAnonComment} onChange={(e) => setIsAnonComment(e.target.checked)} />
              <span>익명</span>
            </label>
          </div>
          <div className="comment-input-box">
            <input
              className="input-field"
              placeholder={user ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              disabled={!user}
            />
            <button className="comment-submit" onClick={handleComment} disabled={!user}>
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
