import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManhwaHub.css';

const EPISODES = [
  {
    ep: '1',
    title: '주점 진상 스토리 1편',
    cover: '/assets/manhwa/jinsang_story_1-1.png',
    desc: '주점에서 벌어지는 황당한 진상 손님 이야기. 그 첫 번째 사건!',
  },
  {
    ep: '2',
    title: '주점 진상 스토리 2편',
    cover: '/assets/manhwa/jinsang_story_2-1.png',
    desc: '더 황당하고 더 억울한 두 번째 주점 진상 에피소드.',
  },
  {
    ep: '3',
    title: '주점 진상 스토리 3편',
    cover: '/assets/manhwa/jinsang_story_3-1.png',
    desc: '참고 또 참다가 터진 세 번째 이야기. 과연 결말은?',
  },
];

export default function ManhwaHub() {
  const navigate = useNavigate();

  return (
    <div className="mh-root">
      <button className="mh-back-btn" onClick={() => navigate('/')}>← 나가기</button>

      <div className="mh-hero">
        <span className="mh-badge">📖 진상 스토리 만화</span>
        <h1 className="mh-title">주점 진상<br/>웹툰 시리즈</h1>
        <p className="mh-sub">실제 있을 법한 주점 진상 에피소드를<br/>만화로 만나보세요!</p>
      </div>

      <div className="mh-list">
        {EPISODES.map((item) => (
          <button
            key={item.ep}
            className="mh-card"
            onClick={() => navigate(`/manhwa/${item.ep}`)}
          >
            <div className="mh-card-cover">
              <img src={item.cover} alt={item.title} />
              <span className="mh-ep-badge">EP.{item.ep}</span>
            </div>
            <div className="mh-card-body">
              <h3 className="mh-card-title">{item.title}</h3>
              <p className="mh-card-desc">{item.desc}</p>
              <span className="mh-read-btn">보러가기 →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
