import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CsInteractive.css';

// ── 결과 타입 ──────────────────────────────────────────────────────
const RESULT_TYPES = {
  FACT_BOMBER: {
    title: '프로 팩트폭격기',
    subtitle: '이성적인 원칙주의자',
    img: '/assets/cs/result_fact.png',
    desc: [
      '💡 <strong>나의 알바 성향은?</strong><br/>감정에 쉽게 휘둘리지 않고 매뉴얼과 규정을 칼같이 지키는 냉철한 원칙주의자입니다. 억지 부리는 진상 손님을 마주해도 당황하지 않고, 조목조목 팩트를 짚어내며 이성적으로 대처하는 능력이 탁월합니다.',
      '🧠 <strong>멘탈 관리 팁</strong><br/>내 말이 정답이더라도 손님에게 너무 차갑게 느껴지면 오히려 2차 트러블이 생길 수 있어요. \'아, 그러셨군요 손님! 다만 저희 규정상~\' 처럼 부드러운 쿠션어를 한 스푼 섞어주면 감정 소모를 훨씬 줄일 수 있습니다.',
      '🤝 <strong>찰떡궁합 동료</strong><br/>내가 이성을 담당할 때 옆에서 손님의 감정을 사르르 녹여줄 <strong>\'공감능력 만렙형\'</strong> 동료와 함께일 때 완벽한 시너지를 발휘합니다.',
    ],
  },
  ANGEL: {
    title: '공감능력 만렙형',
    subtitle: '친절한 평화주의자',
    img: '/assets/cs/result_angel.png',
    desc: [
      '💡 <strong>나의 알바 성향은?</strong><br/>매장의 평화를 최우선으로 생각하는 따뜻한 천사표 알바생입니다. 손님이 조금 무례하게 굴어도 그럴 만한 사정이 있겠거니 이해하려 노력하며, 항상 밝은 미소와 최고의 서비스 정신으로 무장하여 컴플레인을 부드럽게 넘기는 능력이 있습니다.',
      '🧠 <strong>멘탈 관리 팁</strong><br/>모든 손님에게 천사일 필요는 없습니다. 감당하기 힘든 무리한 요구를 하거나 선을 넘는 진상을 만났을 때는 혼자 끙끙 앓지 말고, 즉시 매니저님이나 사장님 찬스를 써서 자신을 보호하세요.',
      '🤝 <strong>찰떡궁합 동료</strong><br/>내가 뒤에서 마음 다치고 있을 때, 진상 앞에 서서 단호하게 방어막을 쳐줄 수 있는 <strong>\'프로 팩트폭격기\'</strong>형 동료가 등 뒤에 있으면 세상 든든합니다.',
    ],
  },
  SWEET_BITTER: {
    title: '겉바속촉 속앓이형',
    subtitle: '참고 넘기는 인내주의자',
    img: '/assets/cs/result_bitter.png',
    desc: [
      '💡 <strong>나의 알바 성향은?</strong><br/>겉으로는 활짝 웃으며 상냥하게 손님을 대하지만, 속으로는 스트레스를 쌓아두는 타입입니다. 트러블을 크게 만들고 싶지 않아 웬만한 무례함은 꾹 참고 넘기지만, 집에 가면 당시 상황이 계속 머릿속에 맴도는 스타일입니다.',
      '🧠 <strong>멘탈 관리 팁</strong><br/>참는 것이 미덕은 아닙니다. 스트레스가 임계점을 넘기 전에 친한 동료와 수다를 떨거나 맛있는 음식을 먹으며 풀어야 해요. 퇴근 도장을 찍는 순간 매장의 나쁜 기억은 전부 매장에 던져두고 오는 훈련이 필요합니다.',
      '🤝 <strong>찰떡궁합 동료</strong><br/>답답한 내 속을 대신해서 무례한 손님에게 시원하게 한 방 질러줄 수 있는 화끈한 <strong>\'눈눈이이 맞불형\'</strong> 동료가 곁에 있으면 가슴이 뻥 뚫립니다.',
    ],
  },
  MAD_DOG: {
    title: '눈눈이이 맞불형',
    subtitle: '확실하게 선을 긋는 행동파',
    img: '/assets/cs/result_maddog.png',
    desc: [
      '💡 <strong>나의 알바 성향은?</strong><br/>호의가 계속되면 권리인 줄 아는 무례한 손님에게는 참지 않고 단호하게 선을 그을 줄 아는 강단 있는 행동파입니다. 부당한 대우를 받으면 표정이나 목소리에 바로 드러나며, 손님의 기에 눌리지 않고 매장의 자존심을 지키는 타입입니다.',
      '🧠 <strong>멘탈 관리 팁</strong><br/>정의로운 대처는 좋지만 감정이 앞서서 같이 욱해버리면 큰 싸움으로 번져 내가 독박을 쓸 위험이 있습니다. 화가 치밀어 오를 때는 속으로 딱 3초만 숨을 고르고, 차분하면서도 뼈가 있는 말투로 응대하는 법을 연습해 보세요.',
      '🤝 <strong>찰떡궁합 동료</strong><br/>내가 너무 과열되었을 때 중간에서 영리하게 브레이크를 걸고 상황을 합의로 이끌어 줄 <strong>\'솔로몬식 딜러형\'</strong> 동료와 궁합이 잘 맞습니다.',
    ],
  },
  DEALER: {
    title: '솔로몬식 딜러형',
    subtitle: '현실적인 실리주의자',
    img: '/assets/cs/result_dealer.png',
    desc: [
      '💡 <strong>나의 알바 성향은?</strong><br/>진상 손님과 쓸데없이 감정 싸움을 하느라 시간과 에너지를 낭비하는 것을 극도로 싫어하는 실리주의자입니다. \'음료수 하나 주고 빨리 보내자\'라는 마인드로 적절한 서비스나 타협안을 제시해 상황을 조용하고 매끄럽게 정리하는 노련한 협상가입니다.',
      '🧠 <strong>멘탈 관리 팁</strong><br/>상황을 빨리 무마하려는 서비스 남발은 오히려 매장의 나쁜 선례를 만들거나 사장님의 눈총을 받을 수 있습니다. 서비스를 건넬 때도 \'이번만 특별히 제공해 드리는 것\'임을 명확히 짚고 넘어가는 스킬이 필요합니다.',
      '🤝 <strong>찰떡궁합 동료</strong><br/>손님이 억지를 부리며 감정적인 소모전을 걸어올 때, 흔들림 없는 태도로 상황의 중심을 잡아주는 <strong>\'자아분리 AI형\'</strong> 동료와 최고의 파트너가 될 수 있습니다.',
    ],
  },
  ROBOT: {
    title: '자아분리 AI형',
    subtitle: '영혼 없는 서빙 머신',
    img: '/assets/cs/result_robot.png',
    desc: [
      '💡 <strong>나의 알바 성향은?</strong><br/>유니폼을 입는 순간 영혼과 자아를 집어던지고 철저하게 기계 모드로 변신하는 프로 자아분리러입니다. 손님이 아무리 화를 내고 억지를 부려도 \'그저 일하는 인형일 뿐\'이라 생각하며 대미지를 전혀 입지 않는, 무적의 정신승리 멘탈 방어막을 가졌습니다.',
      '🧠 <strong>멘탈 관리 팁</strong><br/>멘탈 방어에는 최고지만 너무 영혼 없는 눈빛과 매크로 같은 답변 반복은 손님의 화를 오히려 돋우는 촉매제가 될 수 있습니다. 형식적인 답변을 하더라도 목소리 톤을 한 옥타브 높이거나 고개를 끄덕이는 액션을 섞어 오해를 방지하세요.',
      '🤝 <strong>찰떡궁합 동료</strong><br/>말없이 눈빛만 보내도 각자 맡은 포지션에서 묵묵히 기계처럼 서빙과 불판 교체를 클리어해 내는 또 다른 <strong>\'자아분리 AI형\'</strong> 동료와 만났을 때 무적의 효율을 자랑합니다.',
    ],
  },
};

// ── 퀴즈 데이터 ────────────────────────────────────────────────────
const QUIZ_DATA = [
  {
    q: '테이블 치우는데 손님이 기름진 자리에 냅다 앉을 때',
    a: [
      { text: '"덜 닦여서 기름져요. 옆자리로 안내해 드릴게요."', type: 'FACT_BOMBER' },
      { text: '"앗, 금방 깨끗이 닦아 드릴게요!"', type: 'ANGEL' },
      { text: '조용히 자리에서 벗어난다.', type: 'ROBOT' },
      { text: '"거기 아직 안 닦였습니다 손님." 하고 정색한다.', type: 'MAD_DOG' },
    ],
  },
  {
    q: '밑반찬 깔자마자 "고기 왜 안 나와요?"라며 재촉할 때',
    a: [
      { text: '"주문 들어오면 썰어서 5분 정도 걸립니다."', type: 'FACT_BOMBER' },
      { text: '"고기 준비되는 대로 바로 가져올게요!"', type: 'ANGEL' },
      { text: '"준비되는 대로 가져다드리겠습니다."', type: 'ROBOT' },
      { text: '"지금 준비 중이니 금방 나옵니다!" 하며 웃는다.', type: 'DEALER' },
    ],
  },
  {
    q: '"야, 상추 좀 더 가져와"라며 반말하는 손님',
    a: [
      { text: '"네, 가져다드릴게요 \'손님\'." 하며 호칭 강조', type: 'FACT_BOMBER' },
      { text: '"네~ 상추 가득 채워드릴게요!"', type: 'ANGEL' },
      { text: '대꾸 없이 상추 갖다 주며 속으로 욕함', type: 'SWEET_BITTER' },
      { text: '표정 굳히고 낮은 목소리로 "네. 잠시만요."', type: 'MAD_DOG' },
    ],
  },
  {
    q: '세트 시켜놓고 "단품으로 바꾸고 찌개 빼줘" 억지 쓸 때',
    a: [
      { text: '"이미 고기가 썰려 나가서 변경 불가합니다."', type: 'FACT_BOMBER' },
      { text: '"주방에 확인해 볼게요!"', type: 'ANGEL' },
      { text: '"네, 말해볼게요." 하고 영혼 없이 퇴장', type: 'ROBOT' },
      { text: '"단품으로 하면 세트 할인 안 돼서 더 비싸집니다."', type: 'DEALER' },
    ],
  },
  {
    q: '펄펄 끓는 찌개 옆에서 애가 장난칠 때',
    a: [
      { text: '부모에게 "찌개가 위험하니 먼 쪽으로 옮길까요?"', type: 'FACT_BOMBER' },
      { text: '애한테 "이거 뜨거우니까 치워둘까~?"', type: 'ANGEL' },
      { text: '불판 가림막만 슬쩍 쳐준다.', type: 'SWEET_BITTER' },
      { text: '부모 쳐다보며 "찌개 뜨거우니 애 좀 봐주세요."', type: 'MAD_DOG' },
    ],
  },
  {
    q: '수다 떠느라 알바생 한참 세워둘 때',
    a: [
      { text: '"벨 누르셨는데 어떤 거 주문하시겠어요?"', type: 'FACT_BOMBER' },
      { text: '어색하게 웃으며 대화가 끊길 때까지 대기', type: 'ANGEL' },
      { text: '3초 서 있다가 "결정되면 벨 눌러주세요."', type: 'ROBOT' },
      { text: '째려보며 속으로 \'왜 불렀어?\' 짜증냄', type: 'SWEET_BITTER' },
    ],
  },
  {
    q: '"술 잘못 넣은 거 아냐? 확인해 봐" 의심할 때',
    a: [
      { text: '"빈 병 확인해 보세요. 다 계산된 겁니다."', type: 'FACT_BOMBER' },
      { text: '"실수가 있는지 다시 꼼꼼히 봐드릴게요!"', type: 'ANGEL' },
      { text: '"술 6병 맞습니다. 결제 도와드릴게요."', type: 'ROBOT' },
      { text: '"주문 시마다 확인합니다. 몇 병 드셨는데요?"', type: 'MAD_DOG' },
    ],
  },
  {
    q: '"페브리즈 어딨어? 센스 없게" 툴툴댈 때',
    a: [
      { text: '"카운터 옆에 있으니 직접 쓰시면 됩니다."', type: 'FACT_BOMBER' },
      { text: '"앗 죄송합니다! 여기 있습니다!"', type: 'ANGEL' },
      { text: '속으로 욕하며 똥 씹은 표정 짓기', type: 'SWEET_BITTER' },
      { text: '"저기 있어요." 턱짓하고 쳐다봄', type: 'ROBOT' },
    ],
  },
];

// ── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function CsInteractive() {
  const navigate = useNavigate();

  // screen: 'intro' | 'quiz' | 'loading' | 'result'
  const [screen, setScreen]     = useState('intro');
  const [step, setStep]         = useState(0);
  const [scores, setScores]     = useState(initScores());
  const [resultType, setResultType] = useState(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  function initScores() {
    return { FACT_BOMBER: 0, ANGEL: 0, SWEET_BITTER: 0, MAD_DOG: 0, DEALER: 0, ROBOT: 0 };
  }

  // 퀴즈 시작
  const startTest = () => {
    setStep(0);
    setScores(initScores());
    setScreen('quiz');
  };

  // 답변 선택
  const selectAnswer = (type) => {
    const nextScores = { ...scores, [type]: scores[type] + 1 };
    const nextStep   = step + 1;

    if (nextStep >= QUIZ_DATA.length) {
      setScores(nextScores);
      // 결과 계산
      const maxType = Object.entries(nextScores).reduce((a, b) => b[1] > a[1] ? b : a)[0];
      setResultType(maxType);
      setProgress(0);
      setScreen('loading');
    } else {
      setScores(nextScores);
      setStep(nextStep);
    }
  };

  // 로딩 프로그레스바
  useEffect(() => {
    if (screen !== 'loading') return;
    setProgress(0);
    let w = 0;
    progressRef.current = setInterval(() => {
      w++;
      setProgress(w);
      if (w >= 100) {
        clearInterval(progressRef.current);
        setScreen('result');
      }
    }, 20);
    return () => clearInterval(progressRef.current);
  }, [screen]);

  const result = resultType ? RESULT_TYPES[resultType] : null;
  const quiz   = QUIZ_DATA[step];

  return (
    <div className="cs-root">
      {/* 뒤로가기 */}
      <button className="cs-back-btn" onClick={() => navigate(-1)}>← 나가기</button>

      <div className="cs-container">

        {/* ── 인트로 ── */}
        {screen === 'intro' && (
          <div className="cs-box">
            <span className="cs-badge">진상 대처 유형 테스트</span>
            <h2 className="cs-title">내가 고깃집 알바라면?</h2>
            <p className="cs-sub">
              익명A 님의 사연으로 알아보는 나의 진상 대처 유형<br />
              <span className="cs-sub-small">(진상 대처로 보는 나의 멘탈 성격 유형)</span>
            </p>
            <div className="cs-img-box">
              <img src="/assets/cs/character.png" alt="알바생 캐릭터들" />
            </div>
            <button className="cs-main-btn" onClick={startTest}>시작하기</button>
          </div>
        )}

        {/* ── 퀴즈 ── */}
        {screen === 'quiz' && quiz && (
          <div className="cs-box">
            <div className="cs-badge">Q{step + 1} / {QUIZ_DATA.length}</div>
            <div className="cs-question-box">
              <h3 className="cs-question-text">{quiz.q}</h3>
            </div>
            <div className="cs-answers">
              {quiz.a.map((ans, i) => (
                <button key={i} className="cs-quiz-btn" onClick={() => selectAnswer(ans.type)}>
                  {ans.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 로딩 ── */}
        {screen === 'loading' && (
          <div className="cs-box cs-loading-box">
            <h3 className="cs-title">알바 멘탈 분석 중...</h3>
            <div className="cs-progress-track">
              <div className="cs-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── 결과 ── */}
        {screen === 'result' && result && (
          <div className="cs-box">
            <p className="cs-result-sub">{result.subtitle}</p>
            <h1 className="cs-result-title">{result.title}</h1>
            <div className="cs-result-img-box">
              <img src={result.img} alt={result.title} />
            </div>
            <div className="cs-result-desc-box">
              {result.desc.map((text, i) => (
                <p key={i} className="cs-result-desc-p" dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </div>
            <button className="cs-main-btn" onClick={() => setScreen('intro')}>처음으로</button>
          </div>
        )}

      </div>
    </div>
  );
}
