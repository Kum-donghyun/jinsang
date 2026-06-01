import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './RelationshipInteractive.css';

// ── 질문 데이터 ────────────────────────────────────────────────────
const QUESTIONS = [
  // E vs I
  { id: 1, axis: 'EI', text: '카페에서 주문한 음료가 너무 늦게 나온다. 나의 행동은?', options: [{ text: '알바생! 내 거 언제 나와요?! 매장 전체가 울리게 소리친다.', type: 'E' }, { text: '팔짱을 끼고 카운터 앞을 서성거리며 알바생을 뚫어지게 노려본다.', type: 'I' }] },
  { id: 2, axis: 'EI', text: '옷가게에서 직원이 내 사이즈를 잘못 가져왔다.', options: [{ text: '아니, 사이즈 똑바로 확인 안 해요? 바로 따진다.', type: 'E' }, { text: '한숨을 푹 쉬며 굳은 표정으로 옷을 다시 건넨다.', type: 'I' }] },
  { id: 3, axis: 'EI', text: '식당 테이블이 덜 닦여서 끈적거린다.', options: [{ text: '여기요! 테이블 좀 똑바로 닦아주세요! 큰 소리로 부른다.', type: 'E' }, { text: '물티슈를 달라고 한 뒤, 보란 듯이 빡빡 닦아댄다.', type: 'I' }] },
  // T vs F
  { id: 4, axis: 'TF', text: '밥을 먹다 머리카락이 나왔다. 내가 원하는 조치는?', options: [{ text: '음식값 빼주시고, 죄송하면 서비스라도 하나 줘야 하는 거 아니에요?', type: 'T' }, { text: '사장 나오라고 해! 손님한테 이딴 걸 먹여?! 똑바로 사과해!', type: 'F' }] },
  { id: 5, axis: 'TF', text: '배달 음식이 완전히 식어서 도착했다.', options: [{ text: '식어서 못 먹겠으니까 전액 환불해 주세요.', type: 'T' }, { text: '배달이 늦었으면 미리 전화를 줬어야지! 기분이 확 상하네요.', type: 'F' }] },
  { id: 6, axis: 'TF', text: '예약한 호텔 뷰가 사진과 너무 다르다.', options: [{ text: '사진이랑 다르니 룸 업그레이드 해주거나 조식권이라도 주세요.', type: 'T' }, { text: '내 소중한 기념일을 다 망쳤잖아요! 어떻게 책임질 거예요?!', type: 'F' }] },
  // J vs P
  { id: 7, axis: 'JP', text: '환불/반품 기한이 하루 지났지만 꼭 환불을 받고 싶다.', options: [{ text: '소비자 기본법 17조에 따르면~ 스마트폰 조항을 들이밀며 따진다.', type: 'J' }, { text: '아 하루밖에 안 지났는데 유도리가 없네! 그냥 좀 해줘요!', type: 'P' }] },
  { id: 8, axis: 'JP', text: '이벤트 쿠폰 사용 조건에 아슬아슬하게 부합하지 않는다.', options: [{ text: '안내문에 폰트가 너무 작아서 못 봤잖아요. 이건 고지 의무 위반이에요.', type: 'J' }, { text: '단골인데 이것도 못 해줘요? 사장님한테 말할까요?', type: 'P' }] },
  { id: 9, axis: 'JP', text: '마감 시간 5분 전, 식당에 꼭 들어가고 싶다.', options: [{ text: '아직 영업시간 5분 남았잖아요? 손님 거부하면 불법 아닌가요?', type: 'J' }, { text: '아 금방 먹고 나갈게요! 진짜 딱 10분이면 돼요 네?!', type: 'P' }] },
  // S vs L
  { id: 10, axis: 'SL', text: '매장 직원과 말다툼을 했다. 그 후 나의 행동은?', options: [{ text: '그 자리에서 시원하게 화를 내고 가게 문을 쾅 닫고 나가면 끝이다.', type: 'S' }, { text: '집에 돌아와 분노를 삭이며 영수증 리뷰 1점과 장문의 글을 남긴다.', type: 'L' }] },
  { id: 11, axis: 'SL', text: '원하던 보상을 결국 받지 못했다.', options: [{ text: '아 재수없어! 하고 침 한번 뱉고 다신 안 간다.', type: 'S' }, { text: '본사 고객센터, 맘카페, 구청 위생과... 올릴 수 있는 모든 곳에 올린다.', type: 'L' }] },
  { id: 12, axis: 'SL', text: '점장으로부터 진심 어린 사과를 받았다.', options: [{ text: '알았으면 됐어요. 쿨하게 돌아서서 잊어버린다.', type: 'S' }, { text: '사과는 사과고, 내 기분 상한 거에 대한 보상 절차는 어떻게 되죠?', type: 'L' }] },
];

// ── 결과 데이터 ────────────────────────────────────────────────────
const RESULT_DATA = {
  ETPS: { isBoss: true,  name: '불도저형 진상',      title: '🚨 현장의 파괴자',      quote: '당장 사장 나오라 그래! 이거 당장 환불해 주고 차비도 물어내!', desc: "'목소리 큰 사람이 이긴다!' 현장에서 즉각적으로 소리를 지르며 물질적 보상을 막무가내로 요구합니다.", solution: '감정적으로 대응하지 말고, 주변 고객의 시선을 분산시킨 뒤 매뉴얼대로 단호하게 끊어내는 것이 중요합니다.' },
  IFJL: { isBoss: true,  name: '지능형 스나이퍼',     title: '🕵️‍♂️ 침묵의 암살자',  quote: '(현장) 아.. 네.. → (본사 게시판) 해당 직원의 규정 위반에 대해 엄중 징계를 요구합니다.', desc: '현장에선 조용히 미소 짓지만, 돌아가서 조목조목 규정을 따지며 본사에 장문의 컴플레인을 넣는 무서운 유형입니다.', solution: '모든 응대 과정을 원칙대로 처리하고, 꼬투리를 잡히지 않도록 CCTV 사각지대나 사적인 대화를 조심해야 합니다.' },
  EFPS: { isBoss: true,  name: '감정폭발 막무가내',   title: '🎭 분노의 화신',          quote: '너 내가 누군지 알아?! 어디서 감히 손님을 가르치려 들어!', desc: "보상보다 '자신이 무시당했다는 사실'에 꽂혀 현장에서 감정을 주체하지 못하고 억지를 부리는 유형입니다.", solution: "억지 논리를 반박하려 하지 말고, '그렇게 느끼셨다니 유감입니다' 수준의 기계적인 공감으로 분노 게이지를 낮춰야 합니다." },
  ITPL: { isBoss: true,  name: '리뷰 테러리스트',     title: '⌨️ 음습한 키보드 워리어', quote: '별점 1점 ⭐ 태어나서 가본 곳 중 최악입니다. 다신 안 가요. (사진 첨부)', desc: '대면해서는 한마디도 못 하면서, 원하는 보상을 얻지 못하면 배달 앱이나 지도 리뷰에 악의적인 허위 사실을 섞어 테러를 가합니다.', solution: '팩트 기반으로 정중하고 객관적인 사장님 답글을 달아 다른 고객들이 상황을 판단할 수 있게 해야 합니다.' },
  ETJL: { isBoss: true,  name: '합의금 헌터',          title: '📜 법무팀의 악몽',         quote: '이거 위생법 위반인 거 아시죠? 내가 구청에 신고하면 여기 영업정지야.', desc: '돈을 목적으로 치밀하게 관련 법과 규정을 들먹이며 본사나 관련 기관 고발을 무기로 협박합니다.', solution: '상대가 내미는 법적 근거에 위축되지 말고, 상급자나 본사 법무팀으로 빠르게 상황을 이관하는 것이 안전합니다.' },
  ETPL: { isBoss: false, name: '집요한 보상 집착광',   title: '끝을 보는 징수원',       quote: '환불해줄 때까지 여기서 한 발자국도 안 나갈거야!', desc: '막무가내로 화를 내며, 보상을 받을 때까지 수단과 방법을 가리지 않고 늘어집니다.' },
  ETJS: { isBoss: false, name: '원칙주의 팩트폭격기', title: '법전 들고 다니는 손님',  quote: '소비자 보호법에 의거해서 당장 보상하세요!', desc: '법과 규정을 들이밀며 현장에서 큰 소리로 물질적 보상을 단숨에 받아냅니다.' },
  EFPL: { isBoss: false, name: '동네방네 확성기',       title: '걸어다니는 방송국',      quote: '아이고 동네사람들! 내 말 좀 들어보소!', desc: '자신의 억울함을 온 동네 사람들과 커뮤니티에 소문내며 감정적 동요를 일으킵니다.' },
  EFJS: { isBoss: false, name: '깐깐한 훈장님',         title: '서비스 예절 강사',       quote: '요즘 사람들은 서비스 마인드가 안 되어 있어. 다시 인사해봐요.', desc: '대놓고 훈계를 두며 직원의 태도를 지적하고 그 자리에서 사과를 받아냅니다.' },
  EFJL: { isBoss: false, name: '피곤한 프로불편러',     title: '불만의 연금술사',        quote: '이건 내 기분 문제야! 본사 담당자 당장 연결해!', desc: '작은 일에도 크게 화를 내며, 본사에까지 그 감정을 전달해야 직성이 풀립니다.' },
  ITPS: { isBoss: false, name: '소심한 본전치기',       title: '조용한 밀당러',          quote: '저기... 이거 환불... 안되나요...?', desc: '현장에선 쭈뼛거리지만 끝까지 본전(환불/서비스)을 요구하고, 안되면 조용히 떠납니다.' },
  ITJS: { isBoss: false, name: '논리적 짠돌이',         title: '걸어다니는 계산기',      quote: '여기 영수증에 이렇게 적혀있는데요. 100원 빼주세요.', desc: '조용히 규정을 읊으며 자신의 금전적 권리를 칼같이 찾고 떠납니다.' },
  IFPS: { isBoss: false, name: '뒤끝없는 눈물샘',       title: '감정 과몰입러',          quote: '(글썽이며) 너무 속상하네요... 정말 실망이에요.', desc: '조용히 상처받고 슬퍼하며, 직원의 무리한 감정적 위로와 굽힘을 바랍니다.' },
  IFPL: { isBoss: false, name: '집요한 피해자',          title: '비련의 주인공',          quote: '오늘 OOO 매장에서 너무 수치스러운 일을 겪었어요...', desc: '겉으론 조용하지만, 커뮤니티에 자신이 얼마나 끔찍한 상처를 받았는지 장문으로 호소합니다.' },
  IFJS: { isBoss: false, name: '조용한 손절러',          title: '침묵의 판사',            quote: '(속으로) 다신 안 온다. 지인들에게도 다 말해야지.', desc: '마음에 안 드는 점을 조목조목 기억해 두었다가, 아무 말 없이 블랙리스트에 올립니다.' },
  ITJL: { isBoss: false, name: '기록의 암살자',          title: '숨은 파파라치',          quote: '(말 없이 휴대폰 카메라를 켠다)', desc: '아무 말 없이 모든 상황을 녹음/촬영하여 본사에 금전적 요구와 함께 조용히 보냅니다.' },
};

const BOSS_KEYS    = Object.keys(RESULT_DATA).filter(k => RESULT_DATA[k].isBoss);
const MONSTER_KEYS = Object.keys(RESULT_DATA).filter(k => !RESULT_DATA[k].isBoss);

// ── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function RelationshipInteractive() {
  const navigate = useNavigate();
  const [screen, setScreen]   = useState('intro');   // intro | quiz | loading | result | encyclopedia
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores]   = useState(initScores());
  const [finalType, setFinalType] = useState('');
  const [loadPct, setLoadPct] = useState(0);
  const timerRef = useRef(null);

  function initScores() {
    return { E: 0, I: 0, T: 0, F: 0, J: 0, P: 0, S: 0, L: 0 };
  }

  const handleStart = () => {
    setScores(initScores());
    setCurrentQ(0);
    setScreen('quiz');
  };

  const handleAnswer = (type) => {
    const nextScores = { ...scores, [type]: scores[type] + 1 };
    setScores(nextScores);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      // 마지막 문제
      const EI = nextScores.E >= nextScores.I ? 'E' : 'I';
      const TF = nextScores.T >= nextScores.F ? 'T' : 'F';
      const JP = nextScores.J >= nextScores.P ? 'J' : 'P';
      const SL = nextScores.S >= nextScores.L ? 'S' : 'L';
      const type4 = `${EI}${TF}${JP}${SL}`;
      setFinalType(type4);
      setLoadPct(0);
      setScreen('loading');
    }
  };

  // 로딩 프로그레스
  useEffect(() => {
    if (screen !== 'loading') return;
    setLoadPct(0);
    let pct = 0;
    timerRef.current = setInterval(() => {
      pct += 2;
      setLoadPct(pct);
      if (pct >= 100) {
        clearInterval(timerRef.current);
        setScreen('result');
      }
    }, 40); // 2초 (40ms × 50 = 2000ms)
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const result = RESULT_DATA[finalType];

  return (
    <div className="ri-root">
      <button className="ri-back" onClick={() => navigate(-1)}>← 나가기</button>

      <div className="ri-wrap">

        {/* ── 인트로 ── */}
        {screen === 'intro' && (
          <div className="ri-center">
            <h2 className="ri-subtitle-yellow">&lt; 16BTI 몬스터즈 &gt;</h2>
            <h1 className="ri-main-title">내 안의<br/>진상 고객<br/>유형 테스트</h1>
            <div className="ri-pixel-box ri-dark-box">
              <p className="ri-intro-text">
                "어이 알바생! 내가 누군지 알아?"<br/>
                야생의 진상 몬스터가 나타났다!<br/>
                당신이 만약 분노의 진상이 된다면<br/>
                어떤 보스로 군림하게 될까?
              </p>
            </div>
            <button className="ri-btn ri-btn-red ri-blink" onClick={handleStart}>
              &gt; PRESS START &lt;
            </button>
            <p className="ri-hint">소리, 환불, 규정... 당신의 무기는?</p>
          </div>
        )}

        {/* ── 퀴즈 ── */}
        {screen === 'quiz' && (
          <div className="ri-quiz-wrap">
            <div className="ri-stage-row">
              <span className="ri-stage-text">STAGE {currentQ + 1} / {QUESTIONS.length}</span>
              <span className="ri-hp-label">HP</span>
            </div>
            <div className="ri-hp-track">
              <div className="ri-hp-fill" style={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }} />
            </div>
            <div className="ri-pixel-box ri-q-box">
              <p className="ri-q-text">{QUESTIONS[currentQ].text}</p>
            </div>
            <div className="ri-answers">
              {QUESTIONS[currentQ].options.map((opt, i) => (
                <button key={i} className="ri-btn ri-btn-answer" onClick={() => handleAnswer(opt.type)}>
                  &gt; {opt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 로딩 ── */}
        {screen === 'loading' && (
          <div className="ri-center ri-loading">
            <h2 className="ri-subtitle-yellow ri-blink">전투 데이터 분석 중...</h2>
            <div className="ri-pixel-box ri-dark-box ri-load-box">
              <p className="ri-typewriter">
                행동 패턴 스캔 중...<br/>
                분노 게이지 측정 중...<br/>
                무기(논리/목소리) 분석 중...<br/>
                삐빅- 몬스터 식별 완료!
              </p>
            </div>
            <div className="ri-hp-track">
              <div className="ri-hp-fill" style={{ width: `${loadPct}%` }} />
            </div>
          </div>
        )}

        {/* ── 결과 ── */}
        {screen === 'result' && result && (
          <div className="ri-result-wrap">
            <div className="ri-result-header">
              <span className="ri-result-label">당신이 각성한 몬스터는...</span>
              <h2 className="ri-subtitle-yellow">{result.title}</h2>
              <h1 className="ri-result-name">{result.name}</h1>
              <span className="ri-type-badge">TYPE : {finalType}</span>
            </div>
            <div className={`ri-pixel-box ${result.isBoss ? 'ri-boss-box' : 'ri-dark-box'} ri-result-card`}>
              <div className="ri-quote-box">
                <p className="ri-quote-text">"{result.quote}"</p>
              </div>
              <p className="ri-result-desc">{result.desc}</p>
              {result.solution && (
                <div className="ri-solution">
                  <h3 className="ri-solution-title">🛡️ 공략법 (대처 매뉴얼)</h3>
                  <p className="ri-solution-text">{result.solution}</p>
                </div>
              )}
            </div>
            <div className="ri-result-btns">
              <button className="ri-btn ri-btn-blue" onClick={() => setScreen('encyclopedia')}>
                &gt; 전체 몬스터 도감 보기
              </button>
              <button className="ri-btn" onClick={handleStart}>
                &gt; 다시 테스트하기
              </button>
            </div>
          </div>
        )}

        {/* ── 몬스터 도감 ── */}
        {screen === 'encyclopedia' && (
          <div className="ri-enc-wrap">
            <div className="ri-enc-header">
              <h1 className="ri-subtitle-yellow">📖 진상 몬스터 도감</h1>
              <p className="ri-hint">총 16종의 몬스터가 발견되었습니다.</p>
              <button className="ri-btn ri-btn-sm" onClick={() => setScreen('result')}>
                &lt; 내 결과로 돌아가기
              </button>
            </div>

            <h2 className="ri-sec-title ri-red">🔥 전설의 네임드 보스 (5종)</h2>
            {BOSS_KEYS.map(key => (
              <div key={key} className={`ri-pixel-box ri-boss-box ri-enc-card ${finalType === key ? 'ri-my-type' : ''}`}>
                {finalType === key && <span className="ri-my-badge">MY TYPE!</span>}
                <div className="ri-enc-top">
                  <strong className="ri-enc-name">{RESULT_DATA[key].name}</strong>
                  <span className="ri-enc-key ri-red-bg">{key}</span>
                </div>
                <p className="ri-enc-ttl">{RESULT_DATA[key].title}</p>
                <p className="ri-enc-quote">"{RESULT_DATA[key].quote}"</p>
              </div>
            ))}

            <h2 className="ri-sec-title ri-green">👾 일반 몬스터 (11종)</h2>
            {MONSTER_KEYS.map(key => (
              <div key={key} className={`ri-pixel-box ri-dark-box ri-enc-card ${finalType === key ? 'ri-my-type' : ''}`}>
                {finalType === key && <span className="ri-my-badge">MY TYPE!</span>}
                <div className="ri-enc-top">
                  <strong className="ri-enc-name">{RESULT_DATA[key].name}</strong>
                  <span className="ri-enc-key ri-gray-bg">{key}</span>
                </div>
                <p className="ri-enc-quote">"{RESULT_DATA[key].quote}"</p>
              </div>
            ))}

            <button className="ri-btn ri-btn-red ri-full-btn" onClick={() => { setScreen('intro'); }}>
              &gt; 메인 화면으로 (다시하기)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
