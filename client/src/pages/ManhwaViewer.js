import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ManhwaViewer.css';

const EPISODES = {
  '1': {
    title: '주점 진상 스토리 1편',
    images: [
      '/assets/manhwa/jinsang_story_1-1.png',
      '/assets/manhwa/jinsang_story_1-2.png',
      '/assets/manhwa/jinsang_story_1-3.png',
      '/assets/manhwa/jinsang_story_1-4.png',
    ],
  },
  '2': {
    title: '주점 진상 스토리 2편',
    images: [
      '/assets/manhwa/jinsang_story_2-1.png',
      '/assets/manhwa/jinsang_story_2-2.png',
      '/assets/manhwa/jinsang_story_2-3.png',
      '/assets/manhwa/jinsang_story_2-4.png',
    ],
  },
  '3': {
    title: '주점 진상 스토리 3편',
    images: [
      '/assets/manhwa/jinsang_story_3-1.png',
      '/assets/manhwa/jinsang_story_3-2.png',
      '/assets/manhwa/jinsang_story_3-3.png',
      '/assets/manhwa/jinsang_story_3-4.png',
    ],
  },
};

export default function ManhwaViewer() {
  const { episode } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const ep = EPISODES[episode];
  if (!ep) {
    return (
      <div className="mv-not-found">
        <p>존재하지 않는 에피소드입니다.</p>
        <button onClick={() => navigate('/interactive/drive')}>목록으로</button>
      </div>
    );
  }

  const total = ep.images.length;

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setPage(idx);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      goTo(page - 1);
    } else {
      goTo(page + 1);
    }
  };

  return (
    <div className="mv-root">
      {/* 상단 헤더 */}
      <div className="mv-header">
        <button className="mv-back-btn" onClick={() => navigate('/interactive/drive')}>
          ← 목록
        </button>
        <h2 className="mv-title">{ep.title}</h2>
        <span className="mv-page-badge">{page + 1} / {total}</span>
      </div>

      {/* 만화 이미지 */}
      <div className="mv-img-wrap">
        <img
          src={ep.images[page]}
          alt={`${ep.title} ${page + 1}페이지`}
          className="mv-img"
          onClick={handleImageClick}
        />
        {/* 이전/다음 오버레이 힌트 */}
        <div className="mv-hint-left"  onClick={() => goTo(page - 1)}>
          {page > 0 && '‹'}
        </div>
        <div className="mv-hint-right" onClick={() => goTo(page + 1)}>
          {page < total - 1 && '›'}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="mv-nav">
        <button
          className="mv-nav-btn"
          onClick={() => goTo(page - 1)}
          disabled={page === 0}
        >
          ◀ 이전
        </button>
        <div className="mv-dots">
          {ep.images.map((_, i) => (
            <button
              key={i}
              className={`mv-dot ${i === page ? 'mv-dot-active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          className="mv-nav-btn"
          onClick={() => goTo(page + 1)}
          disabled={page === total - 1}
        >
          다음 ▶
        </button>
      </div>

      {/* 마지막 페이지일 때 목록으로 버튼 */}
      {page === total - 1 && (
        <button className="mv-finish-btn" onClick={() => navigate('/interactive/drive')}>
          📚 목록으로 돌아가기
        </button>
      )}
    </div>
  );
}
