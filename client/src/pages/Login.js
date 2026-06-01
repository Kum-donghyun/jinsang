import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.warning('아이디와 비밀번호를 입력하세요.');
    setLoading(true);
    try {
      await login(username, password);
      toast.success('로그인 성공!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1 className="auth-logo">진상도감</h1>
        <p className="auth-desc">참여형 갈등 판단 플랫폼</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label>아이디</label>
          <input
            className="input-field"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button className="btn btn-primary btn-full auth-submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="auth-links">
        <span>계정이 없으신가요?</span>
        <Link to="/register" className="auth-link">회원가입</Link>
      </div>

      <div className="auth-test-info">
        <p>테스트 계정: <strong>testuser</strong> / <strong>test1234</strong></p>
      </div>
    </div>
  );
}
