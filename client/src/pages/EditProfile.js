import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async () => {
    if (!nickname.trim()) return toast.warning('닉네임을 입력하세요.');
    setLoading(true);
    try {
      await api.put('/users/profile', { nickname });
      const updated = { ...user, nickname };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      toast.success('프로필이 수정되었습니다!');
    } catch (err) {
      toast.error('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPw || !newPw) return toast.warning('비밀번호를 입력하세요.');
    if (newPw.length < 4) return toast.warning('새 비밀번호는 4자 이상이어야 합니다.');
    try {
      await api.put('/users/password', { currentPassword: currentPw, newPassword: newPw });
      toast.success('비밀번호가 변경되었습니다!');
      setCurrentPw('');
      setNewPw('');
    } catch (err) {
      toast.error(err.response?.data?.message || '오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ background: 'var(--white)', minHeight: '100vh' }}>
      <div className="sub-header">
        <button className="back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <span className="sub-title">프로필 수정</span>
      </div>

      <div style={{ padding: '20px 16px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>닉네임 변경</h3>
        <input
          className="input-field"
          placeholder="새 닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <button className="btn btn-primary btn-full" onClick={handleProfileUpdate} disabled={loading}>
          {loading ? '저장 중...' : '닉네임 변경'}
        </button>

        <hr style={{ margin: '28px 0', border: 'none', borderTop: '1px solid var(--gray-200)' }} />

        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>비밀번호 변경</h3>
        <input
          className="input-field"
          type="password"
          placeholder="현재 비밀번호"
          value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <input
          className="input-field"
          type="password"
          placeholder="새 비밀번호"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <button className="btn btn-coral btn-full" onClick={handlePasswordChange}>
          비밀번호 변경
        </button>
      </div>
    </div>
  );
}
