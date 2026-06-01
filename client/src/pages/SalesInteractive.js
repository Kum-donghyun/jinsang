import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SalesInteractive.css';

// ── 이미지 에셋 ─────────────────────────────────────────────────────
const IMG = {
  bg:       'https://cdn.phototourl.com/free/2026-05-21-95ca7e63-ffac-4e02-87f1-0a609be64c0e.png',
  customer: 'https://cdn.phototourl.com/free/2026-05-21-5679d91e-eb33-494d-a915-91471d01f38d.png',
  customerAngry: 'https://cdn.phototourl.com/free/2026-05-21-394d0860-94f6-49de-995e-e83331825dcf.png',
  clerk:    'https://cdn.phototourl.com/free/2026-05-21-122c957e-bf6a-4862-9f07-656fdaeb2f42.png',
  clerkFear:'https://cdn.phototourl.com/free/2026-05-21-f6a86900-6f45-4048-8ced-e380beb13963.png',
  boss:     'https://cdn.phototourl.com/free/2026-05-21-334af78d-812a-4473-98a3-44067649ed90.png',
  colaCup:  'https://cdn.phototourl.com/free/2026-05-21-721432e8-6654-442b-b639-811fbd85300d.png',
  woodTable:'https://cdn.phototourl.com/free/2026-05-21-55ded45d-f1b4-44f1-8fb6-fbd33801c7e5.png',
};

// ── 스토리 데이터 ───────────────────────────────────────────────────
const STORY_STEPS = [
  { id: 0,  text: '(나는 햄버거 매장에서 일하고 있는 박점원이다.)',            speaker: '나(점원)', bg: 'store',     chars: [] },
  { id: 1,  text: '(평소와 다름없던 평범한 어느 날이었다.)',                   speaker: '나(점원)', bg: 'store',     chars: [] },
  { id: 2,  text: '진도버거세트 하나 주세요.\n콜라는 먼저 받아가도 되죠?',    speaker: '고객',     bg: 'store_dim', chars: ['customer'] },
  { id: 3,  text: '네, 콜라 먼저 드리겠습니다!',                               speaker: '점원',     bg: 'store_dim', chars: ['customer', 'clerk'] },
  { id: 4,  type: 'game1_intro' },
  { id: 5,  text: '콜라 먼저 드리겠습니다.',                                   speaker: '점원',     bg: 'store',     chars: ['customer', 'clerk'] },
  { id: 6,  text: '(콜라를 받고 자리로 간다.)',                                speaker: '고객',     bg: 'store',     chars: ['customer', 'clerk'] },
  { id: 7,  type: 'time_lapse' },
  { id: 8,  text: '17번 고객님~ 주문하신 메뉴 나왔습니다~',                    speaker: '점원',     bg: 'store',     chars: ['clerk'] },
  { id: 9,  text: '실수로 콜라를 쏟았어요. 치워주세요.',                        speaker: '고객',     bg: 'store',     chars: ['customer', 'clerk'] },
  { id: 10, text: '콜라요? 네 잠시만요.',                                       speaker: '점원',     bg: 'store',     chars: ['customer', 'clerk'] },
  { id: 11, type: 'game2_intro' },
  { id: 12, text: '콜라 리필 해줘요.',                                          speaker: '고객',     bg: 'store',     chars: ['customer', 'clerk'] },
  { id: 13, text: '네?',                                                         speaker: '점원',     bg: 'store',     chars: ['customer', 'clerk'] },
  { id: 14, text: '다 못먹고 쏟았다고요! 그니까 리필해줘요!',                  speaker: '고객',     bg: 'store',     chars: ['customer', 'clerk'], angry: true },
  { id: 15, text: '죄송하지만 규정상 리필이 안됩니다 고객님.',                 speaker: '점원',     bg: 'store',     chars: ['customer', 'clerk'], clerkFear: true },
  { id: 16, text: '해달라면 해줄 것이지, 말이 많아!!',                          speaker: '고객',     bg: 'store',     chars: ['customer', 'clerk'], angry: true },
  { id: 17, text: '죄송합니다. 규정상 어쩔 수 없습니다.',                      speaker: '점원',     bg: 'store',     chars: ['customer', 'clerk'], clerkFear: true },
  { id: 18, text: '규정은 무슨 규정? 손님한테 이러게 되어 있어?!',             speaker: '고객',     bg: 'shake1',    chars: ['customer', 'clerk'], angry: true },
  { id: 19, text: '이러시면 곤란합니다!',                                        speaker: '점원',     bg: 'store',     chars: ['customer', 'clerk'], clerkFear: true },
  { id: 20, text: '야 이 !@#$아!! 어쩔건데!',                                   speaker: '고객',     bg: 'shake2',    chars: ['customer', 'clerk'], angry: true },
  { id: 21, text: '이 @#$!@#들아!! 사람 무시하냐? 너 이 $#$@%아!!',           speaker: '고객',     bg: 'shake2',    chars: ['customer', 'clerk'], angry: true },
  { id: 22, text: '뭐하는 거야?!',                                               speaker: '사장님',   bg: 'store',     chars: ['customer', 'clerk', 'boss'] },
  { id: 23, text: '뭐 어쩌라고!',                                                speaker: '고객',     bg: 'shake2',    chars: ['customer', 'clerk', 'boss'], angry: true },
  { id: 24, text: '무슨 짓이야 이게!',                                           speaker: '사장님',   bg: 'shake2',    chars: ['customer', 'clerk', 'boss'] },
  { id: 25, text: '그 날 고객의 폭행과 폭언으로 인해 나는 큰 충격을 받았고,\n한동안 출근하지 못하였다.', speaker: '나(점원)', bg: 'black', chars: [] },
  { id: 26, text: '과연 나는 그 때 어떤 대처를 했어야 했던걸까?',              speaker: '나(점원)', bg: 'black',  chars: [] },
  { id: 27, type: 'verdict' },
];

const VOTE_OPTIONS = [
  { id: 1, text: '매니저를 즉시 호출하고 "고객님, 저희 매니저가 도와드릴 겁니다"라며 상황을 이관한다.' },
  { id: 2, text: '감사합니다. 단 1회에 한해 특별히 서비스로 드리겠습니다 — 라며 갈등을 피한다.' },
  { id: 3, text: '규정을 분명히 재설명하되, 음성을 낮추고 정중하게 마지막으로 한 번 더 이야기한다.' },
  { id: 4, text: '법적 조치를 안내하고 즉시 112 신고 절차를 밟는다.' },
];

// ── 메인 컴포넌트 ───────────────────────────────────────────────────
export default function SalesInteractive() {
  const navigate = useNavigate();
  const [screen, setScreen]   = useState('novel'); // novel | game1_intro | game1_play | game1_result | time_lapse | game2_intro | game2_play | game2_result | verdict
  const [stepIdx, setStepIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping]       = useState(false);
  const [shake, setShake]             = useState(0); // 0 off | 1 light | 2 heavy
  const [vignetteOpacity, setVignetteOpacity] = useState(0);
  const [fade, setFade]               = useState(false);
  const [lapseVisible, setLapseVisible] = useState(false);
  const [game1Score, setGame1Score]   = useState(0);
  const [game1Result, setGame1Result] = useState(null); // null | 'success' | 'fail'
  const [game2Result, setGame2Result] = useState(null);
  const [myVoteId, setMyVoteId]       = useState(null);
  const [voteCounts, setVoteCounts]   = useState({ 1: 312, 2: 187, 3: 453, 4: 98 });
  const [liked, setLiked]             = useState(false);
  const [likeCount, setLikeCount]     = useState(342);
  const [opinions, setOpinions]       = useState([
    { author: '현장목격자_7749', content: '매니저 호출이 정답이죠. 본인이 혼자 감당하려다 더 커지는 경우가 많아요.', time: '3시간 전' },
    { author: '감정노동연구소', content: '규정 설명을 몇 번 해도 안 들으면 그건 이미 본인 문제입니다.', time: '5시간 전' },
  ]);
  const [opinionInput, setOpinionInput] = useState('');

  const typeTimerRef  = useRef(null);
  const shakeTimerRef = useRef(null);

  const currentStep = STORY_STEPS[stepIdx] || STORY_STEPS[0];

  // ── 타이프라이터 ──
  const typeText = useCallback((text) => {
    clearInterval(typeTimerRef.current);
    setDisplayText('');
    setIsTyping(true);
    let i = 0;
    typeTimerRef.current = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(typeTimerRef.current);
        setIsTyping(false);
      }
    }, 35);
  }, []);

  // ── 스텝 실행 ──
  const runStep = useCallback((idx) => {
    if (idx >= STORY_STEPS.length) return;
    const step = STORY_STEPS[idx];

    // 화면 흔들기
    if (step.bg === 'shake1') { setShake(1); setVignetteOpacity(0.35); }
    else if (step.bg === 'shake2') { setShake(2); setVignetteOpacity(0.75); }
    else { setShake(0); setVignetteOpacity(0); }

    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
    if (step.bg && step.bg.includes('shake')) {
      shakeTimerRef.current = setTimeout(() => setShake(0), 1000);
    }

    if (step.type) {
      if (step.type === 'game1_intro') { setScreen('game1_intro'); return; }
      if (step.type === 'time_lapse')  { runTimeLapse(idx); return; }
      if (step.type === 'game2_intro') { setScreen('game2_intro'); return; }
      if (step.type === 'verdict')     { setScreen('verdict'); return; }
    }

    setScreen('novel');
    if (step.text) typeText(step.text);
  }, [typeText]);

  useEffect(() => { runStep(stepIdx); }, [stepIdx]); // eslint-disable-line

  // ── 화면 클릭 진행 ──
  const handleClick = () => {
    if (screen !== 'novel') return;
    if (isTyping) {
      clearInterval(typeTimerRef.current);
      setDisplayText(currentStep.text || '');
      setIsTyping(false);
    } else {
      setStepIdx(p => p + 1);
    }
  };

  // ── 타임랩스 ──
  const runTimeLapse = (idx) => {
    setFade(true);
    setLapseVisible(false);
    setTimeout(() => {
      setLapseVisible(true);
      setTimeout(() => {
        setFade(false);
        setLapseVisible(false);
        setStepIdx(idx + 1);
      }, 2000);
    }, 500);
  };

  // ── 게임 진행 후 다음 스텝 ──
  const proceedAfterMinigame = () => {
    setFade(true);
    setTimeout(() => {
      setFade(false);
      setStepIdx(p => p + 1);
      setScreen('novel');
    }, 800);
  };

  // ── 배경 렌더 ──
  const bgClass = (() => {
    const bg = currentStep.bg || 'store';
    if (bg === 'black') return 'bg-black';
    return 'bg-slate-900';
  })();

  const showBgImg = currentStep.bg !== 'black';
  const bgDim     = currentStep.bg === 'store_dim';

  // ── 캐릭터 선택 ──
  const customerSrc = (currentStep.angry)     ? IMG.customerAngry : IMG.customer;
  const clerkSrc    = (currentStep.clerkFear) ? IMG.clerkFear     : IMG.clerk;

  // ──────────────────────────────────────────────
  //  RENDER
  // ──────────────────────────────────────────────
  return (
    <div className={`si-root ${shake === 1 ? 'si-shake1' : shake === 2 ? 'si-shake2' : ''}`}>

      {/* 비네트 경고 오버레이 */}
      <div className="si-vignette" style={{ opacity: vignetteOpacity }} />

      {/* 페이드 레이어 */}
      <div className={`si-fade-layer ${fade ? 'si-fade-in' : ''}`}>
        {lapseVisible && <p className="si-lapse-text">...5분 뒤...</p>}
      </div>

      {/* ── 탑 바 ── */}
      <div className="si-topbar">
        <button className="si-exit-btn" onClick={() => navigate(-1)}>✕ 나가기</button>
        <span className="si-topbar-badge">진상도감 오늘의 판결</span>
      </div>

      {/* ══════════ 비주얼 노벨 ══════════ */}
      {screen === 'novel' && (
        <>
          {/* 배경 */}
          <div className="si-bg-wrap">
            {showBgImg && (
              <img src={IMG.bg} alt="매장 배경" className={`si-bg-img ${bgDim ? 'si-bg-dim' : ''}`} />
            )}
            {bgDim && <div className="si-bg-overlay" />}
          </div>

          {/* 캐릭터 */}
          <div className="si-chars">
            {currentStep.chars?.includes('customer') && (
              <img src={customerSrc} alt="고객" className="si-char si-char-left si-char-enter" />
            )}
            {currentStep.chars?.includes('boss') && (
              <img src={IMG.boss} alt="사장님" className="si-char si-char-center si-char-enter" />
            )}
            {currentStep.chars?.includes('clerk') && (
              <img src={clerkSrc} alt="점원" className="si-char si-char-right si-char-enter" />
            )}
          </div>

          {/* 대화창 */}
          {currentStep.text && (
            <div className="si-dialogue" onClick={handleClick}>
              <div className="si-speaker">{currentStep.speaker}</div>
              <p className="si-dialogue-text">{displayText}</p>
              <span className="si-cue">클릭하여 진행 ▶</span>
            </div>
          )}
        </>
      )}

      {/* ══════════ 미니게임 1 인트로 ══════════ */}
      {screen === 'game1_intro' && (
        <div className="si-overlay-screen">
          <div className="si-mg-card">
            <div className="si-mg-icon">🥤</div>
            <h3 className="si-mg-title">화면을 눌러 콜라를 채워주세요!</h3>
            <p className="si-mg-desc">마우스 또는 터치를 꾹 누르면 콜라가 컵에 떨어집니다.<br />점선 범위 내에 완벽하게 맞추세요!</p>
            <button className="si-btn-primary" onClick={() => { setGame1Score(0); setGame1Result(null); setScreen('game1_play'); }}>시작!</button>
          </div>
        </div>
      )}

      {/* ══════════ 미니게임 1 플레이 ══════════ */}
      {screen === 'game1_play' && (
        <Game1Cola
          bgImg={IMG.colaCup}
          onComplete={(score) => {
            setGame1Score(score);
            setGame1Result(score >= 75 && score <= 85 ? 'success' : 'fail');
            setScreen('game1_result');
          }}
        />
      )}

      {/* ══════════ 미니게임 1 결과 ══════════ */}
      {screen === 'game1_result' && (
        <div className="si-overlay-screen">
          <div className="si-mg-card">
            <div className="si-mg-icon">{game1Result === 'success' ? '✅' : '⚠️'}</div>
            <h3 className="si-mg-title" style={{ color: game1Result === 'success' ? '#16a34a' : '#dc2626' }}>
              {game1Result === 'success' ? '성공!' : '실패!'}
            </h3>
            <p className="si-mg-desc">
              {game1Result === 'success'
                ? '규정 수위에 부합하게 정밀 조준 하였습니다.'
                : `컵의 점선 범위(75%~85%)를 빗나갔습니다. (현재: ${Math.round(game1Score)}%)`}
            </p>
            {game1Result === 'success' ? (
              <button className="si-btn-primary" onClick={proceedAfterMinigame}>계속 진행하기</button>
            ) : (
              <button className="si-btn-secondary" onClick={() => { setGame1Score(0); setGame1Result(null); setScreen('game1_play'); }}>다시 도전하기</button>
            )}
          </div>
        </div>
      )}

      {/* ══════════ 미니게임 2 인트로 ══════════ */}
      {screen === 'game2_intro' && (
        <div className="si-overlay-screen">
          <div className="si-mg-card">
            <div className="si-mg-icon">✨</div>
            <h3 className="si-mg-title">제한시간 안에 콜라를 닦으세요!</h3>
            <p className="si-mg-desc">여러 번 터치하면 얼룩이 지워집니다.<br />10초 이내에 3개의 얼룩을 청소하세요!</p>
            <button className="si-btn-primary" onClick={() => { setGame2Result(null); setScreen('game2_play'); }}>시작!</button>
          </div>
        </div>
      )}

      {/* ══════════ 미니게임 2 플레이 ══════════ */}
      {screen === 'game2_play' && (
        <Game2Stain
          bgImg={IMG.woodTable}
          onSuccess={() => { setGame2Result('success'); setScreen('game2_result'); }}
          onFail={() => { setGame2Result('fail'); setScreen('game2_result'); }}
        />
      )}

      {/* ══════════ 미니게임 2 결과 ══════════ */}
      {screen === 'game2_result' && (
        <div className="si-overlay-screen">
          <div className="si-mg-card">
            <div className="si-mg-icon">{game2Result === 'success' ? '🎉' : '⏰'}</div>
            <h3 className="si-mg-title" style={{ color: game2Result === 'success' ? '#16a34a' : '#dc2626' }}>
              {game2Result === 'success' ? '성공! (청소 완료)' : '타임오버!'}
            </h3>
            <p className="si-mg-desc">
              {game2Result === 'success'
                ? '테이블이 번쩍거리게 완벽 세척 되었습니다!'
                : '제한시간 내에 테이블을 모두 청소하지 못했습니다.'}
            </p>
            {game2Result === 'success' ? (
              <button className="si-btn-primary" onClick={proceedAfterMinigame}>계속 진행하기</button>
            ) : (
              <button className="si-btn-secondary" onClick={() => { setGame2Result(null); setScreen('game2_play'); }}>다시 청소하기</button>
            )}
          </div>
        </div>
      )}

      {/* ══════════ 최종 판결 투표 ══════════ */}
      {screen === 'verdict' && (
        <VerdictScreen
          myVoteId={myVoteId}
          voteCounts={voteCounts}
          liked={liked}
          likeCount={likeCount}
          opinions={opinions}
          opinionInput={opinionInput}
          onVote={(id) => {
            if (myVoteId !== null) return;
            setMyVoteId(id);
            setVoteCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));
          }}
          onLike={() => {
            setLiked(p => !p);
            setLikeCount(p => liked ? p - 1 : p + 1);
          }}
          onRefresh={() => {
            setVoteCounts(prev => {
              const next = { ...prev };
              Object.keys(next).forEach(k => { next[k] += Math.floor(Math.random() * 5); });
              return next;
            });
          }}
          onOpinionChange={setOpinionInput}
          onOpinionSubmit={() => {
            if (!opinionInput.trim()) return;
            setOpinions(prev => [{ author: '익명_배심원', content: opinionInput.trim(), time: '방금 전' }, ...prev]);
            setOpinionInput('');
          }}
          onHome={() => navigate('/')}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  미니게임 1 — 콜라 채우기 (Canvas Physics)
// ══════════════════════════════════════════════════════
function Game1Cola({ bgImg, onComplete }) {
  const canvasRef   = useRef(null);
  const stateRef    = useRef({
    active: true,
    pressing: false,
    waterLevel: 0,
    streamY: 0,
    settled: false,
    bubbles: [],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;

    const onDown = (e) => { if (e.cancelable) e.preventDefault(); if (!s.settled) s.pressing = true; };
    const onUp   = ()  => { s.pressing = false; };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);

    let raf;
    function tick() {
      if (!s.active) return;
      const W = canvas.width, H = canvas.height;
      const cupX = 64, cupY = 100, cupW = 128, cupH = 180;
      const surfaceY = (cupY + cupH) - (cupH * (s.waterLevel / 100));

      if (s.pressing) {
        if (s.streamY < surfaceY) { s.streamY = Math.min(s.streamY + 20, surfaceY); }
        else { s.streamY = surfaceY; s.waterLevel = Math.min(s.waterLevel + 0.8, 100); }
      } else {
        if (s.streamY > 0) {
          s.streamY += 24;
          if (s.streamY >= surfaceY) s.streamY = 0;
        }
      }

      if (s.waterLevel > 0 && Math.random() < 0.35) {
        s.bubbles.push({ x: cupX + 20 + Math.random() * (cupW - 40), y: (cupY + cupH) - Math.random() * (cupH * (s.waterLevel / 100)), r: 1 + Math.random() * 2.5, vy: 0.6 + Math.random() * 1.5 });
      }
      s.bubbles = s.bubbles.filter(b => { b.y -= b.vy; return b.y >= surfaceY - 5; });

      ctx.clearRect(0, 0, W, H);

      // 노즐
      ctx.fillStyle = 'rgba(203,213,225,0.8)'; ctx.fillRect(118, 0, 20, 30);
      ctx.fillStyle = '#475569'; ctx.fillRect(123, 25, 10, 8);

      // 컵 몸통 (반투명)
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.moveTo(cupX, cupY); ctx.lineTo(cupX + 15, cupY + cupH);
      ctx.lineTo(cupX + cupW - 15, cupY + cupH); ctx.lineTo(cupX + cupW, cupY);
      ctx.closePath(); ctx.fill();

      // 목표 점선
      const targetFillY = (cupY + cupH) - (cupH * 0.8);
      ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 3; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(cupX + 5, targetFillY); ctx.lineTo(cupX + cupW - 5, targetFillY);
      ctx.stroke(); ctx.setLineDash([]);

      // 콜라 액체
      if (s.waterLevel > 0) {
        const fillH    = cupH * (s.waterLevel / 100);
        const sY       = (cupY + cupH) - fillH;
        const t        = Date.now() * 0.006;
        const wAmp     = s.pressing ? 3.5 : 1.2;
        const leftX    = cupX + 15 - 15 * (s.waterLevel / 100);
        const rightX   = cupX + cupW - 15 + 15 * (s.waterLevel / 100);

        ctx.fillStyle = 'rgba(59,30,16,0.9)';
        ctx.beginPath();
        ctx.moveTo(cupX + 15, cupY + cupH);
        ctx.lineTo(leftX, sY);
        for (let wx = leftX; wx <= rightX; wx += 10) ctx.lineTo(wx, sY + Math.sin((wx * 0.05) + t) * wAmp);
        ctx.lineTo(rightX, sY);
        ctx.lineTo(cupX + cupW - 15, cupY + cupH);
        ctx.closePath(); ctx.fill();

        ctx.fillStyle = 'rgba(253,224,71,0.75)';
        s.bubbles.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); });
      }

      // 스트림
      if (s.streamY > 0) {
        const sw = 6 + Math.sin(Date.now() * 0.05) * 1.5;
        ctx.fillStyle = '#451a03'; ctx.fillRect(128 - sw / 2, 30, sw, s.streamY - 30);
        ctx.fillStyle = '#fde047';
        ctx.beginPath(); ctx.arc(128, s.streamY, 5 + Math.random() * 5, 0, Math.PI * 2); ctx.fill();
      }

      // 컵 테두리
      ctx.strokeStyle = 'rgba(71,85,105,0.85)'; ctx.lineWidth = 3.5; ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(cupX, cupY); ctx.lineTo(cupX + 15, cupY + cupH);
      ctx.lineTo(cupX + cupW - 15, cupY + cupH); ctx.lineTo(cupX + cupW, cupY);
      ctx.stroke();

      // 완료 판정
      if (!s.pressing && s.waterLevel > 0 && s.streamY === 0 && !s.settled) {
        s.settled = true;
        setTimeout(() => { s.active = false; onComplete(s.waterLevel); }, 1500);
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      s.active = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('touchstart', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []); // eslint-disable-line

  return (
    <div className="si-overlay-screen">
      <div className="si-game1-wrap">
        <div className="si-mg-badge">MINI-GAME 1</div>
        <h4 className="si-mg-sub-title">콜라 전용 정밀 주입기</h4>
        <div className="si-game1-canvas-wrap" style={{ backgroundImage: `url(${bgImg})` }}>
          <canvas ref={canvasRef} width={256} height={320} className="si-game1-canvas" />
        </div>
        <p className="si-mg-hint">화면을 꾹 누르면 콜라가 떨어집니다.</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  미니게임 2 — 얼룩 닦기
// ══════════════════════════════════════════════════════
const STAIN_POSITIONS = [
  { id: 1, top: '25%', left: '28%', svgIdx: 0 },
  { id: 2, top: '65%', left: '68%', svgIdx: 1 },
  { id: 3, top: '48%', left: '46%', svgIdx: 2 },
];

const STAIN_SVGS = [
  <svg viewBox="0 0 100 100" className="w-full h-full" key="s0">
    <defs><radialGradient id="cg1" cx="35%" cy="35%" r="65%"><stop offset="0%" stopColor="#b45309" stopOpacity="0.8"/><stop offset="65%" stopColor="#451a03" stopOpacity="0.9"/><stop offset="100%" stopColor="#140a05" stopOpacity="0.95"/></radialGradient></defs>
    <circle cx="22" cy="24" r="5" fill="url(#cg1)" stroke="#140a05" strokeWidth="1.2"/>
    <path d="M35 45 C30 28,52 22,68 28 C82 32,86 52,78 68 C68 82,48 78,36 72 C24 66,42 58,35 45Z" fill="url(#cg1)" stroke="#140a05" strokeWidth="1.5"/>
    <path d="M38 38 Q48 29 60 32" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
  </svg>,
  <svg viewBox="0 0 100 100" className="w-full h-full" key="s1">
    <defs><radialGradient id="cg2" cx="30%" cy="30%" r="65%"><stop offset="0%" stopColor="#b45309" stopOpacity="0.8"/><stop offset="65%" stopColor="#451a03" stopOpacity="0.9"/><stop offset="100%" stopColor="#140a05" stopOpacity="0.95"/></radialGradient></defs>
    <path d="M24 38 C18 22,46 18,58 32 C70 46,88 40,82 58 C76 74,52 78,42 68 C32 58,30 52,24 38Z" fill="url(#cg2)" stroke="#140a05" strokeWidth="1.5"/>
    <path d="M31 31 Q45 20 54 27" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.75"/>
  </svg>,
  <svg viewBox="0 0 100 100" className="w-full h-full" key="s2">
    <defs><radialGradient id="cg3" cx="40%" cy="40%" r="65%"><stop offset="0%" stopColor="#b45309" stopOpacity="0.8"/><stop offset="65%" stopColor="#451a03" stopOpacity="0.9"/><stop offset="100%" stopColor="#140a05" stopOpacity="0.95"/></radialGradient></defs>
    <path d="M38 28 C48 18,66 26,62 42 C58 58,76 62,72 74 C66 84,46 78,36 82 C24 86,22 68,32 58 C42 48,28 38,38 28Z" fill="url(#cg3)" stroke="#140a05" strokeWidth="1.5"/>
    <path d="M42 30 Q52 20 60 30" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
  </svg>,
];

function Game2Stain({ bgImg, onSuccess, onFail }) {
  const TOTAL_CLICKS = 15;
  const [timer, setTimer]       = useState(10.0);
  const [stains, setStains]     = useState(() => STAIN_POSITIONS.map(s => ({ ...s, remaining: TOTAL_CLICKS })));
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(null);
  const doneRef  = useRef(false);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        const next = parseFloat((prev - 0.1).toFixed(1));
        if (next <= 0 && !doneRef.current) { doneRef.current = true; clearInterval(timerRef.current); onFail(); }
        return next;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line

  const handleStainClick = (id) => {
    if (doneRef.current) return;
    setStains(prev => {
      const next = prev.map(s => s.id === id ? { ...s, remaining: Math.max(0, s.remaining - 1) } : s);
      const cleaned = next.filter(s => s.remaining === 0).length;
      if (cleaned === 3 && !doneRef.current) {
        doneRef.current = true;
        clearInterval(timerRef.current);
        setTimeout(onSuccess, 400);
      }
      // 별 파티클
      const pid = Date.now() + Math.random();
      setParticles(pp => [...pp, { id: pid, stainId: id }]);
      setTimeout(() => setParticles(pp => pp.filter(p => p.id !== pid)), 600);
      return next;
    });
  };

  return (
    <div className="si-overlay-screen">
      <div className="si-game2-wrap">
        <div className="si-game2-top">
          <div>
            <div className="si-mg-badge">MINI-GAME 2</div>
            <h4 className="si-mg-sub-title">테이블 오염 세척 작전</h4>
          </div>
          <div className={`si-timer ${timer <= 3 ? 'si-timer-danger' : ''}`}>⏱ {timer.toFixed(1)}초</div>
        </div>

        <div className="si-game2-board" style={{ backgroundImage: `url(${bgImg})` }}>
          {stains.map(s => {
            if (s.remaining === 0) return null;
            const scale = 0.4 + (s.remaining / TOTAL_CLICKS) * 0.6;
            return (
              <div
                key={s.id}
                className="si-stain"
                style={{ top: s.top, left: s.left, transform: `translate(-50%,-50%) scale(${scale})` }}
                onMouseDown={() => handleStainClick(s.id)}
                onTouchStart={(e) => { e.preventDefault(); handleStainClick(s.id); }}
              >
                {STAIN_SVGS[s.svgIdx]}
                <span className="si-stain-count">{s.remaining}</span>
              </div>
            );
          })}
          {/* 파티클 */}
          {particles.map(p => {
            const stain = stains.find(s => s.id === p.stainId);
            if (!stain) return null;
            return (
              <div key={p.id} className="si-particle-wrap" style={{ top: stain.top, left: stain.left, pointerEvents: 'none' }}>
                {[...Array(3)].map((_, i) => (
                  <span key={i} className="si-particle" style={{ '--tx': `${Math.random() * 80 - 40}px`, '--ty': `${Math.random() * -80 - 10}px` }}>★</span>
                ))}
              </div>
            );
          })}
        </div>
        <p className="si-mg-hint">어두운 얼룩을 빠르게 여러 번 탭하세요!</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  최종 투표 화면
// ══════════════════════════════════════════════════════
function VerdictScreen({ myVoteId, voteCounts, liked, likeCount, opinions, opinionInput, onVote, onLike, onRefresh, onOpinionChange, onOpinionSubmit, onHome }) {
  const total = Object.values(voteCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="si-verdict-page">
      <div className="si-verdict-header">
        <button className="si-verdict-home-btn" onClick={onHome}>🏠</button>
        <h2 className="si-verdict-title">최종 대배심 판결 선고</h2>
        <button className="si-verdict-refresh-btn" onClick={onRefresh} title="새로고침">↻</button>
      </div>

      <div className="si-verdict-card">
        <div className="si-verdict-live-badge">LIVE VOTE PERCENTAGE</div>
        <h3 className="si-verdict-subtitle">현재 배심원 실시간 판결 수치</h3>

        <div className="si-vote-options">
          {VOTE_OPTIONS.map(opt => {
            const pct = total > 0 ? Math.round((voteCounts[opt.id] / total) * 100) : 0;
            const isMyVote = myVoteId === opt.id;
            return (
              <div key={opt.id} className={`si-vote-opt ${isMyVote ? 'si-vote-opt-mine' : ''}`}>
                <p className="si-vote-opt-text">{opt.text}</p>
                {myVoteId !== null ? (
                  <div className="si-vote-result">
                    <div className="si-vote-result-top">
                      {isMyVote && <span className="si-voted-badge">✓ 선고함</span>}
                      <span className="si-vote-count">{voteCounts[opt.id].toLocaleString()}명 투표</span>
                      <span className="si-vote-pct">{pct}%</span>
                    </div>
                    <div className="si-vote-bar-track">
                      <div className="si-vote-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ) : (
                  <button className="si-vote-btn" onClick={() => onVote(opt.id)}>⚖️ 이 선택지로 판결하기</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 공감 / 공유 */}
      <div className="si-verdict-meta">
        <button className={`si-meta-btn ${liked ? 'si-meta-btn-liked' : ''}`} onClick={onLike}>
          {liked ? '❤️' : '🤍'} 콘텐츠 공감 ({likeCount})
        </button>
        <button className="si-meta-btn" onClick={() => alert('링크가 복사되었습니다!')}>
          📤 친구에게 물어보기
        </button>
      </div>

      {/* 의견 댓글 */}
      <div className="si-opinions">
        <h4 className="si-opinions-title">💬 배심원들의 생각교차로 ({opinions.length})</h4>
        <div className="si-opinion-input-row">
          <input
            value={opinionInput}
            onChange={e => onOpinionChange(e.target.value)}
            placeholder="고품격 훈수를 남겨주세요."
            className="si-opinion-input"
            onKeyDown={e => e.key === 'Enter' && onOpinionSubmit()}
          />
          <button className="si-opinion-submit" onClick={onOpinionSubmit}>등록</button>
        </div>
        {opinions.map((op, i) => (
          <div key={i} className="si-opinion-item">
            <div className="si-opinion-meta">
              <span>🕵️ {op.author}</span><span>{op.time}</span>
            </div>
            <p className="si-opinion-text">{op.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
