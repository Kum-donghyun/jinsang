import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaGavel } from 'react-icons/fa';
import EducationInteractive from './EducationInteractive';
import SalesInteractive from './SalesInteractive';
import CsInteractive from './CsInteractive';
import RelationshipInteractive from './RelationshipInteractive';
import ManhwaHub from './ManhwaHub';
import ShortformPage from './ShortformPage';
import './InteractiveContent.css';

export const INTERACTIVE_ITEMS = [
  {
    slug: 'cs',
    name: '서비스업 진상',
    emoji: '🛎️',
    subtitle: '"손님은 왕이다" 이게 맞나요?',
    description: '서비스업 종사자라면 한 번쯤 겪어봤을 황당한 진상 손님 상황. 여러분의 판결은?',
    bgGradient: 'linear-gradient(135deg, #FFE8E8 0%, #FFF0F0 100%)',
    accentColor: '#FF6B6B',
    borderColor: '#FFCCCC',
    vsA: '🤬',
    vsB: '😤',
  },
  {
    slug: 'work',
    name: '영상으로 보는 진상',
    emoji: '🎬',
    subtitle: '역대급 진상 사연, 영상으로 만나다',
    description: '매주 선정된 역대급 진상 사연을 생생한 숏폼 영상으로 만나보세요! 댓글로 여러분의 생각을 남겨주세요.',
    bgGradient: 'linear-gradient(135deg, #FFF0F0 0%, #FFF5F0 100%)',
    accentColor: '#E53E3E',
    borderColor: '#FED7D7',
    vsA: '🎥',
    vsB: '😤',
  },
  {
    slug: 'drive',
    name: '진상 스토리 만화',
    emoji: '📖',
    subtitle: '주점 진상 에피소드를 만화로!',
    description: '실제 있을 법한 주점 진상 사연을 4컷 만화로 만나보세요. 3편의 에피소드가 준비되어 있습니다.',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #F8FDF9 100%)',
    accentColor: '#16a34a',
    borderColor: '#dcfce7',
    vsA: '📚',
    vsB: '🖼️',
  },
  {
    slug: 'sales',
    name: '판매직 진상',
    emoji: '🏪',
    subtitle: '이 고객, 진상 맞죠?',
    description: '환불 요구, 터무니없는 클레임, 갑질 고객. 판매직 종사자의 억울한 사연을 판결해 주세요!',
    bgGradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFF8F0 100%)',
    accentColor: '#F39C12',
    borderColor: '#FFE0B2',
    vsA: '🏷️',
    vsB: '💸',
  },
  {
    slug: 'education',
    name: '학부모 진상',
    emoji: '📚',
    subtitle: '오늘 하루, 선생님으로 출근했습니다.',
    description: '학교에서 벌어지는 교사와 학부모, 학생 간의 갈등. 여러분의 공정한 판결을 내려주세요!',
    bgGradient: 'linear-gradient(135deg, #F3E5F5 0%, #F8F0FF 100%)',
    accentColor: '#8E44AD',
    borderColor: '#E1BEE7',
    vsA: '👩‍🏫',
    vsB: '👪',
  },
  {
    slug: 'relationship',
    name: '내 안의 진상 유형 테스트',
    emoji: '👾',
    subtitle: '나는 어떤 진상 몬스터일까?',
    description: '16BTI 몬스터즈! 내가 분노한 진상이 된다면 어떤 보스로 각성할까? 12문항으로 알아보는 나의 진상 유형.',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F5 100%)',
    accentColor: '#ef4444',
    borderColor: '#fee2e2',
    vsA: '🔥',
    vsB: '👾',
  },
];

export default function InteractiveContent() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // slug별 완성된 인터랙티브 페이지 분기
  if (slug === 'education') return <EducationInteractive />;
  if (slug === 'sales')     return <SalesInteractive />;
  if (slug === 'cs')        return <CsInteractive />;
  if (slug === 'drive')     return <ManhwaHub />;
  if (slug === 'relationship') return <RelationshipInteractive />;
  if (slug === 'work')         return <ShortformPage />;

  const item = INTERACTIVE_ITEMS.find((i) => i.slug === slug);

  if (!item) {
    return (
      <div className="ic-not-found">
        <p>콘텐츠를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')}>홈으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="ic-page" style={{ background: item.bgGradient }}>
      {/* 헤더 */}
      <div className="ic-header">
        <button className="ic-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h2 className="ic-title" style={{ color: item.accentColor }}>
          {item.emoji} {item.name}
        </h2>
      </div>

      {/* 메인 카드 */}
      <div className="ic-card" style={{ borderColor: item.borderColor }}>
        <div className="ic-vs-area">
          <span className="ic-char">{item.vsA}</span>
          <span className="ic-vs" style={{ color: item.accentColor }}>VS</span>
          <span className="ic-char">{item.vsB}</span>
        </div>
        <h3 className="ic-subtitle">{item.subtitle}</h3>
        <p className="ic-desc">{item.description}</p>
      </div>

      {/* 준비 중 안내 */}
      <div className="ic-coming-soon">
        <FaGavel className="ic-gavel" style={{ color: item.accentColor }} />
        <h3>콘텐츠 준비 중</h3>
        <p>
          <b>{item.name}</b> 인터랙티브 콘텐츠가 곧 오픈됩니다!
          <br />여러분의 판결을 기다리고 있어요.
        </p>
        <button
          className="ic-notify-btn"
          style={{ background: item.accentColor }}
          onClick={() => navigate(`/category/${item.slug}`)}
        >
          {item.emoji} 관련 게시판 보러가기
        </button>
      </div>
    </div>
  );
}
