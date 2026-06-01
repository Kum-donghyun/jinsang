import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !nickname) return toast.warning('모든 항목을 입력하세요.');
    if (password !== passwordConfirm) return toast.warning('비밀번호가 일치하지 않습니다.');
    if (password.length < 4) return toast.warning('비밀번호는 4자 이상이어야 합니다.');

    setLoading(true);
    try {
      await register(username, password, nickname);
      toast.success('회원가입 성공!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1 className="auth-logo">진상도감</h1>
        <p className="auth-desc">회원가입</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>아이디</label>
          <input
            className="input-field"
            placeholder="사용할 아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label>닉네임</label>
          <input
            className="input-field"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label>비밀번호</label>
          <input
            className="input-field"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label>비밀번호 확인</label>
          <input
            className="input-field"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-full auth-submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <div className="auth-links">
        <span>이미 계정이 있으신가요?</span>
        <Link to="/login" className="auth-link">로그인</Link>
      </div>
    </div>
  );
}
