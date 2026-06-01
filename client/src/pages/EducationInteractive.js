import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaPhone,
  FaPhoneSlash,
  FaPhoneVolume,
  FaArrowRight,
  FaSkull,
  FaShareAlt,
  FaChalkboardTeacher,
} from 'react-icons/fa';
import './EducationInteractive.css';

// ── 시나리오 데이터 ─────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 0,
    stageBadge: '1교시 : 등교 직후의 공습',
    title: '등교 시간, 빗발치는 무리수',
    desc: "아침 일찍부터 민우 어머니에게 장문의 문자가 날아옵니다. '우리 민우는 햇빛을 많이 보면 아토피가 올라오니 교실 안에서도 무조건 커튼을 다 치고 있게 해주시고, 짝꿍 민호가 좀 과격한데 자리도 오늘 1교시 시작하자마자 맨 뒤 구석으로 이동시켜주세요. 만약 안 해주시면 오늘 오후에 교육청에 전화 넣겠습니다.'",
    caller: '민우 어머니',
    status: '부재중 및 문자 4통',
    chatHistory: [
      { time: '08:35 AM', sender: '학부모', msg: '선생님, 우리 애 짝꿍 행동이 너무 거칠던데 옮겨 주시는 거죠? 오늘 수업 전에 꼭 확인 피드백 문자 주세요.' },
    ],
    options: [
      {
        text: '아이들이 정한 학급 규칙이 있어 당장 자리 교체는 곤란하다고 정중히 타협을 시도한다.',
        mentalImpact: -15,
        reply: '어머니, 학기 초 자리 배치는 아이들이 직접 토론해서 정한 규칙이라 임의로 즉시 변경하기가 조금 어렵습니다. 민우가 혹시 소외감을 느끼지 않도록 관찰하며 다음 조율 기간에 최우선적으로 반영하겠습니다.',
        parentReaction: '규칙이 중요해요, 우리 아이 피부 뒤집어지는 게 중요해요? 참 유도리 없으시네. 교장실로 전화하겠습니다.',
        nextStage: 1,
      },
      {
        text: '마찰을 피하기 위해 우선 임의로 조치하겠다고 말하며 한 걸음 물러선다.',
        mentalImpact: -30,
        reply: '아, 네 어머니. 민우가 힘들어할 수 있으니 오늘 즉시 구석 자리로 이동 조치하겠습니다. 걱정 끼쳐드려 죄송합니다.',
        parentReaction: '그래요 진작 그러셨어야죠. 그리고 이따 오후 과학 실험 시간에 저희 애 안전하게 맨 뒷자리에 그대로 놔두시는 거죠?',
        nextStage: 1,
      },
    ],
  },
  {
    id: 1,
    stageBadge: '4교시 : 급식 지도 중의 폭탄',
    title: '급식 시간에 걸려온 극단적 유선 전화',
    desc: '한바탕 정신없는 급식 배급이 끝났습니다. 흘린 밥을 닦고 있는 당신에게 교무실 내선 전화로 행정실 직원이 소리칩니다. "민우 어머니 전화인데, 당장 안 바꾸면 난리치겠다고 하십니다!" 전화를 연결하자마자 수화기 너머로 비명에 가까운 호통이 들립니다.',
    caller: '민우 어머니 (내선 연결)',
    status: '고성 유선 통화 중',
    chatHistory: [
      { time: '12:40 PM', sender: '학부모', msg: '선생님!! 우리 애 오늘 급식 반찬에 당근이 들어갔는데 제가 미리 안 먹는다고 알림장에 썼잖아요! 아동학대로 신고당하고 싶어요?!' },
    ],
    options: [
      {
        text: '급식은 일괄 배식이며 영양 관리를 위한 것임을 논리적이고 차분하게 설명한다.',
        mentalImpact: -25,
        reply: '어머니, 급식실에서 한 조리기구로 조리하는 과정이라 당근을 원천 제거하기는 힘듭니다. 다만 민우가 당근을 안 먹도록 지도 중이며 아동학대라는 표현은 삼가 주셨으면 좋겠습니다.',
        parentReaction: '어머, 지금 저를 예민한 극성 엄마로 모시는 건가요? 말투가 왜 그래요? 당신 자식이어도 그따위로 말할래요? 당신 이름이랑 직위 똑바로 대 봐요!',
        nextStage: 2,
      },
      {
        text: '격양된 감정에 맞서지 않고 일단 거듭 사과하며 무릎을 굽힌다.',
        mentalImpact: -40,
        reply: '죄송합니다 어머니, 배식 지도 과정에서 누락이 있었습니다. 다음부터는 민우 식판에 일절 야채나 다른 성분이 닿지 않도록 제가 직접 식판을 확인하여 건져내어 주겠습니다.',
        parentReaction: '대답은 잘 하네. 두고 볼 겁니다. 내일 또 나오면 인터넷 지역 맘카페에 이름이랑 다 올릴 줄 아세요.',
        nextStage: 2,
      },
    ],
  },
  {
    id: 2,
    stageBadge: '방과 후 : 끊임없는 족쇄',
    title: '퇴근 후 밤 10시의 메신저 폭발',
    desc: '퇴근 후 겨우 한숨을 돌리고 따뜻한 차 한 잔을 마시려는 밤 10시. 조용하던 휴대폰 단체 톡방과 개인 메시지가 불이 나기 시작합니다. "선생님, 우리 민우 가방에 연필깎이가 없어졌대요. 다른 반 애가 훔쳐 간 거 아닌가요? 지금 당장 그 반 선생님이랑 통화하셔서 찾아주시거나 반 전체 가방 검사라도 해주세요."',
    caller: '민우 어머니 (야간)',
    status: '수신 거부 불가 시간',
    chatHistory: [
      { time: '22:15 PM', sender: '학부모', msg: '밤늦게 죄송한데요, 애가 지금 연필깎이 없어졌다고 울고불고 잠을 안 자요. 교실 CCTV라도 돌려보세요.' },
    ],
    options: [
      {
        text: '공적인 연락 한계를 지키며, 내일 아침 출근 후 교실을 샅샅이 찾아보겠다고 알린다.',
        mentalImpact: -20,
        reply: '어머니, 야간이라 연락이 늦었습니다. 내일 아침에 출근하자마자 민우 책상 서랍과 교실 사물함 주변을 자세히 확인 후 연락드리겠습니다. 늦은 밤 가방 검사는 현실적으로 다른 학생들에게 실례가 될 수 있습니다.',
        parentReaction: '다른 애들 가방보다 우리 애 마음에 상처받는 게 먼저 아닌가요? 교사 편하자고 일을 미루시네. 이래서 젊은 여교사는 책임감이 없다니까.',
        nextStage: 3,
      },
      {
        text: '두려운 마음에 당장 밤중에 동료 교사에게 전화하여 분실물 수배를 돌린다.',
        mentalImpact: -35,
        reply: '아, 잠시만요 어머니! 제가 지금 바로 어제 주번이었던 아이 부모님들께 다 전화해서 혹시 잘못 들고 갔는지 수소문해 보겠습니다. 조금만 기다려주세요.',
        parentReaction: '네, 결과 나오는 대로 새벽이라도 좋으니 제 카톡으로 바로 보고 주세요.',
        nextStage: 3,
      },
    ],
  },
];

// ── 컴포넌트 ────────────────────────────────────────────────────────
export default function EducationInteractive() {
  const navigate = useNavigate();

  // 화면 상태: 'intro' | 'game' | 'result'
  const [screen, setScreen] = useState('intro');
  const [mentalScore, setMentalScore] = useState(100);
  const [currentStage, setCurrentStage] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [waitingReply, setWaitingReply] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [nextStageIdx, setNextStageIdx] = useState(null);
  const [isLastStage, setIsLastStage] = useState(false);
  const [phoneShake, setPhoneShake] = useState(false);

  const chatEndRef = useRef(null);

  // 채팅 스크롤 자동 아래로
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // 게임 시작 시 초기 채팅 로드
  useEffect(() => {
    if (screen === 'game') {
      const data = SCENARIOS[currentStage];
      setChatMessages(data.chatHistory.map((c) => ({ ...c, key: Date.now() + Math.random() })));
      setShowNext(false);
      setWaitingReply(false);
    }
  }, [screen, currentStage]);

  // ── 멘탈 게이지 색상 ──
  const gaugeColor =
    mentalScore > 60 ? '#22c55e' : mentalScore > 30 ? '#f97316' : '#ef4444';
  const gaugePulse = mentalScore <= 30;

  // ── 선택지 클릭 ──
  const handleOption = (option) => {
    if (waitingReply) return;
    setWaitingReply(true);

    // 교사 답변 추가
    setChatMessages((prev) => [
      ...prev,
      { time: '실시간 대응', sender: '교사', msg: option.reply, key: Date.now() },
    ]);

    setTimeout(() => {
      // 학부모 반응 추가
      setChatMessages((prev) => [
        ...prev,
        { time: '즉시 반발', sender: '학부모', msg: option.parentReaction, key: Date.now() + 1 },
      ]);

      // 폰 진동
      setPhoneShake(true);
      setTimeout(() => setPhoneShake(false), 500);

      // 멘탈 감소
      setMentalScore((prev) => Math.max(0, prev + option.mentalImpact));

      // 다음 버튼 표시
      setNextStageIdx(option.nextStage);
      setIsLastStage(option.nextStage >= SCENARIOS.length);
      setShowNext(true);
    }, 1000);
  };

  // ── 다음 스테이지 / 결과 ──
  const handleNext = () => {
    if (isLastStage) {
      setScreen('result');
    } else {
      setCurrentStage(nextStageIdx);
    }
  };

  // ── 재시작 ──
  const handleRestart = () => {
    setMentalScore(100);
    setCurrentStage(0);
    setScreen('intro');
  };

  const stageData = SCENARIOS[currentStage] || SCENARIOS[0];

  // ────────────────────── INTRO ──────────────────────
  if (screen === 'intro') {
    return (
      <div className="edu-page edu-intro">
        <button className="edu-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>

        <div className="edu-intro-badge">INTERACTIVE REPORTAGE</div>
        <h1 className="edu-intro-title">
          시들지 않는 꽃을 위하여
          <span className="edu-intro-subtitle">어느 초등학교 교사의 무덤</span>
        </h1>
        <p className="edu-intro-desc">
          매일 아침 8시 30분, 교문이 열리고 아이들이 등교합니다.<br />
          사랑과 책임감으로 꽃피워야 할 교실.<br />
          하지만 교탁 위에 놓인 핸드폰이 진동하기 시작하면서,<br />
          교사의 하루는 전장이 됩니다.
        </p>

        <button className="edu-start-btn" onClick={() => setScreen('game')}>
          <FaChalkboardTeacher className="edu-btn-icon" />
          초임 교사로 출근하기
        </button>

        <p className="edu-intro-disclaimer">
          ※ 실제 교사들의 진술과 언론 보도된 실화를 각색한 잔혹한 현장 체험형 기획입니다.
        </p>
      </div>
    );
  }

  // ────────────────────── RESULT ──────────────────────
  if (screen === 'result') {
    const survived = mentalScore > 40;
    return (
      <div className="edu-page edu-result">
        <button className="edu-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>

        <div className="edu-result-label">DEMISE OF TEACHER RIGHTS</div>

        <h2 className="edu-result-title">
          {survived ? '상처투성이의 간신히 버틴 교탁' : '결국 바닥에 부러진 분필'}
        </h2>

        {/* 최종 멘탈 게이지 */}
        <div className="edu-result-gauge-wrap">
          <span className="edu-result-gauge-label">최종 감정 소모도</span>
          <div className="edu-gauge-track">
            <div
              className="edu-gauge-fill"
              style={{ width: `${mentalScore}%`, background: gaugeColor }}
            />
          </div>
          <span className="edu-result-gauge-val" style={{ color: gaugeColor }}>
            {mentalScore}%
          </span>
        </div>

        <p className="edu-result-desc">
          {survived
            ? '선생님은 어찌어찌 버텨냈지만 이미 심장은 깊은 내상을 입었습니다. 밤마다 걸려오는 기습 민원 전화 소리가 환청처럼 귓전을 맴돕니다. 언제 무너질지 모르는 외줄 타기가 매일 반복됩니다.'
            : '아무런 보호 장치가 없는 교실에서 당신은 완전히 연소해 버렸습니다. 학부모의 일방적인 분풀이, 누구도 구해주지 않는 밀폐된 공간에서 교사라는 꿈은 악몽으로 뒤바뀐 채 마침표를 찍었습니다.'}
        </p>

        {/* 통계 카드 */}
        <div className="edu-stat-grid">
          <div className="edu-stat-card">
            <div className="edu-stat-tag">교사 실태 조사</div>
            <div className="edu-stat-num">95.8%</div>
            <p className="edu-stat-desc">교사 95.8%가 "학부모로 인한 정신적 고통과 민원에 시달리고 있다"고 대답했습니다.</p>
          </div>
          <div className="edu-stat-card">
            <div className="edu-stat-tag">이직/사직 고민</div>
            <div className="edu-stat-num">87%</div>
            <p className="edu-stat-desc">최근 악성 민원 증가로 교직을 떠나거나 이직을 고민한 경험이 있는 교사의 비율입니다.</p>
          </div>
          <div className="edu-stat-card">
            <div className="edu-stat-tag">심리 치료 경험</div>
            <div className="edu-stat-num">1/4</div>
            <p className="edu-stat-desc">대한민국 교사 4명 중 1명은 무리한 민원 등으로 인해 정신과 상담이나 심리 치료를 받은 적이 있습니다.</p>
          </div>
        </div>

        {/* 사회적 촉구 */}
        <div className="edu-appeal-box">
          <h3 className="edu-appeal-title">"교육의 무덤을 막는 것은 우리 모두의 관심입니다"</h3>
          <p className="edu-appeal-desc">
            선생님이 존중받지 못하는 공간에서 아이들 역시 건강하게 자라날 수 없습니다.<br />
            악성 민원에 대한 즉각적인 분리 조치, 법적 분쟁 지원 체계, 무엇보다 교사를 정당한 교육의 주체로 대하는 사회적 약속이 필요합니다.
          </p>
          <div className="edu-result-btns">
            <button className="edu-btn-secondary" onClick={handleRestart}>
              다른 선택으로 다시 시작하기
            </button>
            <button
              className="edu-btn-share"
              onClick={() => alert('링크가 복사되었습니다. 교권 보호를 위한 가치를 공유해 주세요.')}
            >
              <FaShareAlt /> 이 이야기 공유하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────── GAME ──────────────────────
  return (
    <div className="edu-page edu-game">

      {/* 상단 헤더: 뒤로가기 + 멘탈 게이지 */}
      <div className="edu-game-header">
        <button className="edu-back-btn-sm" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <div className="edu-gauge-wrap">
          <span className="edu-gauge-label">감정 소모도</span>
          <div className="edu-gauge-track">
            <div
              className={`edu-gauge-fill${gaugePulse ? ' edu-gauge-pulse' : ''}`}
              style={{ width: `${mentalScore}%`, background: gaugeColor }}
            />
          </div>
          <span className="edu-gauge-val" style={{ color: gaugeColor }}>
            {mentalScore}%
          </span>
        </div>
      </div>

      {/* 스테이지 배지 */}
      <div className="edu-stage-badge">{stageData.stageBadge}</div>

      {/* ─ 시나리오 설명 + 폰 비주얼 ─ */}
      <div className="edu-scenario-card">
        <h2 className="edu-scenario-title">{stageData.title}</h2>
        <p className="edu-scenario-desc">{stageData.desc}</p>

        {/* 폰 목업 */}
        <div className={`edu-phone${phoneShake ? ' edu-phone-shake' : ''}`}>
          <div className="edu-phone-notch" />
          <div className="edu-phone-screen">
            <div className="edu-phone-incoming">
              <FaPhoneVolume className="edu-phone-icon-pulse" /> 수신 중...
            </div>
            <div className="edu-phone-caller">{stageData.caller}</div>
            <div className="edu-phone-status">{stageData.status}</div>
            <div className="edu-phone-btns">
              <div className="edu-phone-btn-red"><FaPhoneSlash /></div>
              <div className="edu-phone-btn-green edu-btn-bounce"><FaPhone /></div>
            </div>
          </div>
        </div>
      </div>

      {/* ─ 채팅 스레드 ─ */}
      <div className="edu-chat-thread">
        {chatMessages.map((msg) =>
          msg.sender === '학부모' ? (
            <div key={msg.key} className="edu-chat-row edu-chat-left">
              <div className="edu-chat-time">{msg.time} [학부모]</div>
              <div className="edu-chat-bubble edu-bubble-parent">{msg.msg}</div>
            </div>
          ) : (
            <div key={msg.key} className="edu-chat-row edu-chat-right">
              <div className="edu-chat-time">{msg.time} [나 (교사)]</div>
              <div className="edu-chat-bubble edu-bubble-teacher">{msg.msg}</div>
            </div>
          )
        )}
        <div ref={chatEndRef} />
      </div>

      {/* ─ 선택지 / 다음 버튼 ─ */}
      <div className="edu-options">
        {!showNext ? (
          stageData.options.map((opt, i) => (
            <button
              key={i}
              className="edu-option-btn"
              onClick={() => handleOption(opt)}
              disabled={waitingReply}
            >
              <span className="edu-option-num">선택 {i + 1}.</span> {opt.text}
            </button>
          ))
        ) : (
          <button className="edu-next-btn" onClick={handleNext}>
            {isLastStage ? (
              <>
                <FaSkull /> 정신적 한계 도달 — 결과 확인
              </>
            ) : (
              <>
                다음 고비 마주하기 <FaArrowRight />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
