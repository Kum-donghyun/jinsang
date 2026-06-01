import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaPhone, FaPhoneSlash, FaPhoneVolume,
  FaArrowRight, FaSkull, FaShareAlt, FaChalkboardTeacher,
  FaUserTie, FaUserFriends, FaChild, FaFileAlt, FaHeart,
  FaTrophy, FaMedal, FaExclamationTriangle, FaShieldAlt, FaBolt,
} from 'react-icons/fa';
import './EducationInteractive.css';

// ── 진동 헬퍼
const vibrateDevice = (pattern) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// ── 초기 상태값
const INITIAL_STATS = {
  mental: 100,
  admin: 30,
  stability: 80,
  evidence: 0,
};

// ── 스테이지 데이터 (분기형)
const STAGES = {

  ch1_main: {
    chapterBadge: 'CHAPTER 1',
    stageBadge: '1교시 · 등교 직후의 공습',
    title: '아침 8시 35분, 이미 전장이 열렸다',
    desc: '교실 문을 열기도 전에 핸드폰이 불을 뿜습니다. 민우 어머니로부터 문자 5통과 부재중 전화 2통. 짝꿍 자리 교체와 커튼 강제 차단, 이 두 가지를 1교시 내로 이행하지 않으면 교육청에 민원을 넣겠다는 내용입니다. 뒤에서는 동료 박 선생이 조용히 다가옵니다.',
    caller: '민우 어머니',
    callerStatus: '부재중 2회 · 문자 5통',
    messages: [
      { sender: '민우 어머니', role: 'parent',    time: '08:22', msg: '선생님, 우리 민우 오늘 자리 문제 어떻게 되는 건가요? 짝꿍 민호가 어제 또 팔꿈치로 툭 쳤다고 하던데. 맨 뒤 구석 자리로 즉시 이동시켜 주세요.' },
      { sender: '민우 어머니', role: 'parent',    time: '08:31', msg: '그리고 창가 햇빛이 아토피 자극한다고 지난주에도 말씀드렸잖아요. 커튼 하루 종일 다 닫아 주시고, 안 하시면 오전 중에 교육청 민원 넣겠습니다.' },
      { sender: '박선생 (동료)', role: 'colleague', time: '08:38', msg: '선생님, 저도 저번에 그 어머니한테 연락 받은 적 있어요. 무조건 들어주지 말고 기록부터 남기세요. 나중에 꼭 필요해요.' },
    ],
    choices: [
      {
        text: '학급 자리 배치는 아이들이 합의한 규칙이며, 의료적 필요가 있다면 학교 보건 절차를 통한 공식 요청을 안내한다. 이 문자 대화를 기록으로 저장한다.',
        effects: { mental: -15, admin: 5, stability: 0, evidence: 25 },
        reply: '어머니, 현재 자리 배치는 학기 초 학급 회의를 통해 아이들이 직접 결정한 규칙입니다. 임의 변경은 다른 학생들에게도 영향을 주어 어렵습니다. 의료적 필요(아토피)가 있으시다면 학교 보건 선생님을 통한 공식 절차를 이용해 주시면 최대한 반영하겠습니다.',
        reactions: [
          { sender: '민우 어머니', role: 'parent', msg: '규칙이요? 지금 우리 애 피부 뒤집어지는 게 규칙보다 중요하지 않아요? 교사가 그렇게 유도리가 없으면 어떡해요. 교장실로 바로 전화할게요.' },
        ],
        commentary: {
          title: '✅ 올바른 대응 · 원칙 기반 정중한 거절',
          text: '교원 단체들은 "요구 즉시 이행 대신 공식 절차 안내"를 핵심 대응 원칙으로 권고합니다. 이 시점에 대화를 텍스트로 기록한 것은 이후 법적 분쟁 시 결정적 증거가 됩니다. 즉각 거절이 불편하더라도, 원칙 없는 수락은 더 큰 요구로 이어집니다.',
          changes: [
            { label: '기록 증거', val: 25, pos: true },
            { label: '감정 소모도', val: -15, pos: false },
          ],
        },
        nextStage: 'ch1_pressure_a',
      },
      {
        text: '마찰을 피하기 위해 "오늘 중으로 자리를 조정하고 커튼도 치겠습니다"라고 답변하며 한 발 뒤로 물러선다.',
        effects: { mental: -30, admin: -5, stability: -15, evidence: 0 },
        reply: '네 어머니, 말씀하신 대로 오늘 1교시 안에 민우 자리를 맨 뒤로 이동하고 커튼도 치도록 하겠습니다. 걱정 끼쳐드려 죄송합니다.',
        reactions: [
          { sender: '민우 어머니', role: 'parent',  msg: '그래야죠. 그리고 이따 오후 과학 실험 시간에도 실험대 맨 앞에 세우시면 안 됩니다. 화학물질 냄새도 아토피에 나쁘니까요.' },
          { sender: '민우 (학생)', role: 'student', msg: '선생님... 제가 맨 뒤로 가면 친구들이 이상하게 볼 것 같아요. 꼭 가야 해요?' },
        ],
        commentary: {
          title: '⚠️ 위험한 대응 · 무조건적 수용',
          text: '한 번의 수용은 다음 요구의 시작입니다. 악성 민원 학부모는 들어줄수록 요구를 늘립니다. 학급 규칙이 어른의 일방적 개입으로 깨지면 학급 전체의 신뢰가 흔들리고, 민우 학생 본인에게도 부정적 영향이 생깁니다.',
          changes: [
            { label: '감정 소모도', val: -30, pos: false },
            { label: '학급 안정도', val: -15, pos: false },
          ],
        },
        nextStage: 'ch1_pressure_b',
      },
    ],
  },

  ch1_pressure_a: {
    chapterBadge: 'CHAPTER 1 · 압박 라운드',
    stageBadge: '교장실 소환',
    title: '교감의 중재 압박: "좀 유연하게 하면 안 되겠어요?"',
    desc: '점심 직전, 교감이 당신을 조용히 부릅니다. "학부모 민원이 교장실까지 올라왔어요. 선생님이 너무 원칙적으로만 대응하는 것 아닌가요?" 합의를 권유하는 뉘앙스입니다. 동료 박 선생이 복도에서 귓속말을 건넵니다.',
    caller: '교감 선생님',
    callerStatus: '교장실 소환',
    messages: [
      { sender: '교감 선생님',    role: 'viceprincipal', time: '11:50', msg: '선생님, 그냥 조금만 맞춰주면 안 되나요? 어머니가 교장 선생님한테도 전화하셨어요. 학교 이미지도 있고… 선생님이 좀 더 적극적으로 나서주시면 좋겠어요.' },
      { sender: '박선생 (동료)', role: 'colleague',      time: '11:55', msg: '선생님, 그 어머니 알고 보니 지역 맘카페 운영자래요. 기록 꼭 계속 남기세요. 교감한테도 상황 공유해두면 나중에 학교가 선생님 편들어줄 가능성이 올라가요.' },
    ],
    choices: [
      {
        text: '지금까지 기록한 내용을 교감에게 보여주며, 요구 사항의 부당함을 설명하고 학교 차원의 공식 대응 지원을 요청한다.',
        effects: { mental: -10, admin: 20, stability: 5, evidence: 10 },
        reply: '교감 선생님, 이 건 관련하여 대화 기록과 요구 사항을 정리해왔습니다. 학부모의 요구가 학교 운영 규정 범위를 벗어난 사안입니다. 학교 차원에서 공식 답변을 주시거나, 교권보호위원회에 사전 상담을 요청하고 싶습니다.',
        reactions: [
          { sender: '교감 선생님', role: 'viceprincipal', msg: '음… 일단 알겠어요. 자료 검토해볼게요. 그래도 일단은 학부모 감정을 좀 누그러뜨릴 방법도 같이 생각해봅시다.' },
        ],
        commentary: {
          title: '✅ 전략적 대응 · 증거 기반 지원 요청',
          text: '교감을 적으로 만들지 않으면서 증거를 제시해 학교 조직이 자신을 보호하게 만드는 전략입니다. 전국교직원노동조합은 "교권 침해 초기부터 관리자에게 상황 공유"를 권고합니다. 기록이 없으면 나중에 "왜 참았냐"는 말을 듣게 됩니다.',
          changes: [
            { label: '행정 지원도', val: 20, pos: true },
            { label: '기록 증거',   val: 10, pos: true },
          ],
        },
        nextStage: 'ch2_main',
      },
      {
        text: '교감의 압박에 못 이겨 "제가 좀 더 유연하게 대처하겠습니다"라고 물러서며 사과한다.',
        effects: { mental: -20, admin: -10, stability: 0, evidence: 0 },
        reply: '네 교감 선생님, 제가 너무 딱딱하게 대응했던 것 같습니다. 앞으로는 좀 더 유연하게 대처하겠습니다.',
        reactions: [
          { sender: '교감 선생님',    role: 'viceprincipal', msg: '그래요, 학부모 민원은 초기에 잘 풀어야 해요. 경험 쌓다 보면 노하우 생기죠.' },
          { sender: '민우 어머니', role: 'parent',          msg: '교감 선생님한테 들었어요. 오후에 다시 연락 주시면 자리 배치 어떻게 할지 상의해봐요.' },
        ],
        commentary: {
          title: '⚠️ 위험 신호 · 관리자 압박에 굴복',
          text: '상급자도 때로는 "갈등 최소화"를 위해 교사를 압박합니다. 이 시점에 굴복하면 학부모는 "교감을 거치면 선생님이 들어준다"는 것을 학습하게 됩니다. 이후 민원의 빈도와 강도가 높아질 수 있습니다.',
          changes: [
            { label: '행정 지원도', val: -10, pos: false },
            { label: '감정 소모도', val: -20, pos: false },
          ],
        },
        nextStage: 'ch2_main',
      },
    ],
  },

  ch1_pressure_b: {
    chapterBadge: 'CHAPTER 1 · 압박 라운드',
    stageBadge: '요구의 연쇄',
    title: '첫 양보 후, 새로운 요구가 줄을 잇는다',
    desc: '첫 요구를 들어준 직후 민우 어머니의 메시지가 또 날아옵니다. 이번엔 민호 학생과의 완전한 분리와 "다른 학부모들에게 민우 상황을 알려달라"는 요구까지 포함되어 있습니다. 뒤에서 민우가 눈치를 보며 서 있습니다.',
    caller: '민우 어머니',
    callerStatus: '추가 문자 3통',
    messages: [
      { sender: '민우 어머니', role: 'parent',  time: '09:15', msg: '아까 자리 옮겨주셔서 감사해요. 그런데 체육 시간에도 민호랑 같은 팀 안 되게 해주세요. 다른 학부모들한테도 우리 민우가 예민한 아이라는 거 알려주면 좋겠어요.' },
      { sender: '민우 (학생)', role: 'student', time: '09:20', msg: '선생님... 저 때문에 친구들이 다 수군거리는 것 같아요. 그냥 원래 자리로 돌아가도 돼요?' },
    ],
    choices: [
      {
        text: '이제라도 선을 긋는다. 추가 요구는 수용이 어렵고, 다른 학생 정보를 공유하는 것은 개인정보 침해임을 정중히 안내하고 기록으로 남긴다.',
        effects: { mental: -15, admin: 5, stability: 10, evidence: 15 },
        reply: '어머니, 아이들의 팀 배정은 체육 교사와 협의하여 교육 목적에 따라 결정됩니다. 임의 배정 변경은 어렵습니다. 또한 다른 학생의 개인 정보를 다른 학부모와 공유하는 것은 개인정보보호법 위반이 될 수 있어 불가합니다.',
        reactions: [
          { sender: '민우 어머니', role: 'parent', msg: '개인정보요? 지금 제가 우리 아이 걱정해서 부탁하는 건데 법을 들이미는 거예요? 당신 교사 자격 있어요?' },
        ],
        commentary: {
          title: '✅ 늦었지만 유효한 선긋기',
          text: '이미 한 번 들어줬더라도 늦지 않았습니다. 일관된 경계를 재설정하는 것이 계속 수용하는 것보다 낫습니다. 특히 개인정보 침해 요청을 서면으로 거절한 것은 중요한 기록이 됩니다.',
          changes: [
            { label: '학급 안정도', val: 10, pos: true },
            { label: '기록 증거',   val: 15, pos: true },
          ],
        },
        nextStage: 'ch2_main',
      },
      {
        text: '민우가 불쌍하고 어머니가 무서워 요구를 또 수락한다. 체육 팀도 조정하고, 학부모 단톡에 민우 상황을 알린다.',
        effects: { mental: -35, admin: -10, stability: -25, evidence: 0 },
        reply: '알겠습니다 어머니. 체육 시간 팀 배정 시 민호와 분리하겠습니다. 학부모 단톡에도 아이 상황을 배려 차원에서 말씀드리겠습니다.',
        reactions: [
          { sender: '민우 어머니',     role: 'parent',    msg: '그렇죠, 그 정도는 해주셔야죠. 역시 선생님이 이해심이 있으시네요.' },
          { sender: '학부모 A (단톡)', role: 'parent',    msg: '저희 아이 얘기는 왜 안 해주세요? 우리 애도 예민한 편인데…' },
          { sender: '박선생 (동료)',   role: 'colleague', msg: '선생님, 학부모 개인정보 단톡에 공유하시면 나중에 큰 문제 생길 수 있어요. 조심하세요...' },
        ],
        commentary: {
          title: '🚨 심각한 오류 · 개인정보 공유',
          text: '타인의 개인 정보(건강 상태 등)를 동의 없이 제3자에게 공개하는 것은 개인정보보호법 위반입니다. 선의에서 비롯됐을지라도 법적 책임이 교사에게 돌아올 수 있으며, 다른 학부모들의 추가 요구를 촉발하는 부작용도 생겼습니다.',
          changes: [
            { label: '학급 안정도', val: -25, pos: false },
            { label: '행정 지원도', val: -10, pos: false },
          ],
        },
        nextStage: 'ch2_main',
      },
    ],
  },

  ch2_main: {
    chapterBadge: 'CHAPTER 2',
    stageBadge: '4교시 · 급식 시간의 폭탄',
    title: '식판에 당근 한 조각, 국가적 재난이 되다',
    desc: '분주한 급식 시간. 아이들이 식판을 받아 자리를 잡을 때, 내선 전화기가 울립니다. "민우 어머니인데 당장 안 바꾸면 교무실 난리치겠다고 하세요." 수화기 너머로 이미 고성이 새어 나옵니다. 민우는 식판을 내려다보며 굳어 있습니다.',
    caller: '민우 어머니 (내선 연결)',
    callerStatus: '고성 통화 중',
    messages: [
      { sender: '민우 어머니', role: 'parent',    time: '12:42', msg: '선생님!! 당근이 뭐예요 당근이!! 제가 알림장에 안 먹는다고 썼잖아요! 아동학대로 신고하면 선생님 어떻게 될 것 같아요?!' },
      { sender: '민우 (학생)', role: 'student',   time: '12:44', msg: '(엄마한테 전화 왔어요? 저 괜찮아요 선생님, 당근 그냥 옆에 뒀어요...)' },
      { sender: '행정실장',    role: 'colleague', time: '12:45', msg: '선생님, 상황 기록해두세요. 학부모 민원 접수 대장에 오늘 통화 내용 남겨드릴게요.' },
    ],
    choices: [
      {
        text: '"아동학대" 발언에 차분하게 반론하고, 급식은 학교 영양사 관할임을 설명하며, 이 대화를 공식 민원 기록으로 남기겠다고 고지한다.',
        effects: { mental: -20, admin: 5, stability: 0, evidence: 25 },
        reply: '어머니, 아동학대라는 표현은 매우 심각한 발언입니다. 급식 메뉴는 학교 영양사가 전체 학생을 대상으로 관리하며, 개별 식품 제거는 의사 진단서와 함께 공식 신청이 필요합니다. 오늘 통화 내용은 학교 민원 기록부에 공식 등록하겠습니다.',
        reactions: [
          { sender: '민우 어머니', role: 'parent',    msg: '기록이요? 녹음이요? 그렇게 나오겠다는 거예요? 저도 녹음할게요. 교육청이랑 맘카페에 다 올릴 거예요.' },
          { sender: '행정실장',    role: 'colleague', msg: '선생님, 잘 하셨어요. 저도 접수 대장에 12시 42분 고성 통화로 기록 남겼어요.' },
        ],
        commentary: {
          title: '✅ 핵심 대응 · "아동학대" 발언에 단호히',
          text: '"아동학대" 발언은 교사를 위축시키기 위한 전형적인 압박 수단입니다. 이에 굴복하지 않고 공식 기록 절차를 안내한 것은 정확한 대응입니다. 실제로 교권 침해 사안의 78%가 초기 기록 부재로 인해 교사가 불리해집니다 (교원단체 실태조사).',
          changes: [
            { label: '기록 증거',   val: 25, pos: true },
            { label: '감정 소모도', val: -20, pos: false },
          ],
        },
        nextStage: 'ch2_followup_a',
      },
      {
        text: '"죄송합니다, 다음부터는 제가 직접 민우 식판에서 당근을 골라내겠습니다"라고 사과하며 무릎을 굽힌다.',
        effects: { mental: -40, admin: -5, stability: -10, evidence: 0 },
        reply: '어머니, 정말 죄송합니다. 오늘 급식 지도에서 제가 더 신경 쓰지 못했습니다. 앞으로는 민우 식판을 제가 직접 확인하여 당근을 제거하겠습니다.',
        reactions: [
          { sender: '민우 어머니', role: 'parent',  msg: '그러세요. 그리고 이따 오후 간식 먹을 때도 성분표 확인해서 알레르기 성분 있으면 못 먹이세요. 당연한 거 아닌가요?' },
          { sender: '민우 (학생)', role: 'student', msg: '선생님, 엄마 때문에 불편하시죠? 저 그냥 집에서 도시락 싸와도 될 것 같아요...' },
        ],
        commentary: {
          title: '🚨 위험한 전례 · 물리적 편의 제공 약속',
          text: '교사가 급식 식판의 특정 식재료를 개인적으로 제거하겠다고 약속하는 것은 현실적으로 불가능할 뿐만 아니라 다른 학생들과의 형평성 문제를 야기합니다. 이 발언은 이후 "약속 불이행"으로 또 다른 민원의 빌미가 됩니다.',
          changes: [
            { label: '감정 소모도', val: -40, pos: false },
            { label: '학급 안정도', val: -10, pos: false },
          ],
        },
        nextStage: 'ch2_followup_b',
      },
    ],
  },

  ch2_followup_a: {
    chapterBadge: 'CHAPTER 2 · 후속',
    stageBadge: '맘카페 글 등장',
    title: '온라인이 전선이 되다: 지역 맘카페에 올라온 글',
    desc: '오후 수업 중, 동료 교사로부터 긴급 메시지가 옵니다. 지역 맘카페에 민우 어머니로 추정되는 아이디가 "특정 초등학교 교사 무능 사례"라는 제목의 글을 올렸다는 내용입니다. 학교 이름과 학년까지 특정된 내용입니다.',
    caller: '박선생 (동료)',
    callerStatus: '긴급 문자',
    messages: [
      { sender: '박선생 (동료)', role: 'colleague',      time: '14:20', msg: '선생님, 지역 맘카페에 우리 학교 2학년 담임이라고 글 올라왔어요. 구체적인 내용이 있어서 아마 민우 어머니 같은데요. 스크린샷 지금 당장 찍어두세요!' },
      { sender: '교감 선생님',    role: 'viceprincipal', time: '14:35', msg: '선생님, 저도 봤어요. 학교 측에서 공식 대응 검토하겠습니다. 지금까지 기록하신 자료 오늘 퇴근 전에 저한테 보내주실 수 있어요?' },
    ],
    choices: [
      {
        text: '맘카페 글을 즉시 캡처하여 증거로 저장하고, 교감에게 지금까지의 기록 전체를 제출하며 명예훼손 법적 대응 가능성을 학교 측에 요청한다.',
        effects: { mental: -15, admin: 20, stability: 5, evidence: 30 },
        reply: '교감 선생님, 오늘 학부모의 모든 연락 내역과 맘카페 게시물 캡처를 첨부합니다. 이 게시물은 허위 사실을 포함하고 있으며 학교와 교사의 명예를 훼손하고 있습니다. 법적 대응 여부를 학교 측에서 검토해 주시면 감사하겠습니다.',
        reactions: [
          { sender: '교감 선생님', role: 'viceprincipal', msg: '잘 하셨어요 선생님. 법률 자문팀에 바로 연결해드리겠습니다. 교사가 이렇게 자료 잘 챙겨오면 학교도 움직일 수 있어요.' },
        ],
        commentary: {
          title: '✅ 전략적 승수 · 증거의 체계화',
          text: '온라인 게시물은 캡처 즉시 증거 효력이 발생합니다. 삭제 후에는 복원이 어렵습니다. 2023년 교원지위법 개정으로 학교장이 직접 수사기관에 고발 의뢰를 할 수 있게 되었습니다. 교원의 명예훼손 사안은 학교 법률 지원 서비스를 통해 무료로 자문받을 수 있습니다.',
          changes: [
            { label: '행정 지원도', val: 20, pos: true },
            { label: '기록 증거',   val: 30, pos: true },
          ],
        },
        nextStage: 'ch3_main',
      },
      {
        text: '큰일로 만들고 싶지 않아 맘카페 글은 무시하고 조용히 넘기려 한다.',
        effects: { mental: -20, admin: -5, stability: -10, evidence: 0 },
        reply: '(아무 대응도 하지 않는다. 사람들이 알게 될까 봐 두렵다.)',
        reactions: [
          { sender: '박선생 (동료)', role: 'colleague', msg: '선생님… 그냥 넘기면 안 돼요. 저도 그랬다가 나중에 후회했어요. 일단 캡처라도 해두세요.' },
          { sender: '민우 어머니',   role: 'parent',    msg: '선생님 왜 교감 선생님한테 연락드렸어요? 제가 뭘 잘못했나요? 학교 측이 압박하는 거예요?' },
        ],
        commentary: {
          title: '⚠️ 기회 상실 · 침묵은 동의가 아니다',
          text: '명예훼손 게시물을 방치하면 내용이 사실로 굳어질 수 있습니다. 또한 이 시점에 캡처를 하지 않으면 삭제 후 증거 확보가 불가능합니다. "조용히 넘기는 것"이 교사를 보호하는 것처럼 느껴지지만, 실제로는 자신을 더 취약하게 만드는 선택입니다.',
          changes: [
            { label: '감정 소모도', val: -20, pos: false },
            { label: '학급 안정도', val: -10, pos: false },
          ],
        },
        nextStage: 'ch3_main',
      },
    ],
  },

  ch2_followup_b: {
    chapterBadge: 'CHAPTER 2 · 후속',
    stageBadge: '약점이 된 약속',
    title: '식판 약속이 새로운 족쇄가 되다',
    desc: '식판 직접 확인 약속 이후, 어머니는 이제 매일 급식 메뉴 사진을 보내달라고 요구합니다. 교실 내에서도 민우는 점점 다른 아이들과 분리된 채 교사에게만 의존하는 모습을 보입니다.',
    caller: '민우 어머니',
    callerStatus: '오후 추가 요구',
    messages: [
      { sender: '민우 어머니',    role: 'parent',    time: '14:10', msg: '선생님, 오늘 급식 식단표랑 식판 사진 보내주세요. 앞으로 매일 점심 전에 확인 문자 주시는 거 맞죠?' },
      { sender: '민우 (학생)',   role: 'student',   time: '14:15', msg: '(급식 다 먹은 후) 선생님, 저 오늘 급식 혼자 먹었어요. 애들이 저한테 말을 안 해요...' },
      { sender: '박선생 (동료)', role: 'colleague', time: '14:30', msg: '선생님, 매일 급식 사진 찍어 보내면 안 돼요. 그게 관행이 되면 학교 전체 문제가 돼요. 지금이라도 거절하세요.' },
    ],
    choices: [
      {
        text: '지금이라도 "매일 급식 사진 전송은 개인 업무 범위 외의 일이라 불가능하다"고 정중하게 거절하고 이 대화를 기록한다.',
        effects: { mental: -15, admin: 5, stability: 10, evidence: 20 },
        reply: '어머니, 매일 급식 사진을 개인적으로 전송하는 것은 교사의 업무 범위를 벗어납니다. 식단표는 학교 홈페이지에 매주 공지됩니다. 알레르기 대응이 필요하시다면 보건 선생님을 통한 공식 절차를 이용해 주세요.',
        reactions: [
          { sender: '민우 어머니', role: 'parent', msg: '이렇게 갑자기 입장이 바뀌면 어떡해요? 어제는 해준다고 했잖아요!' },
        ],
        commentary: {
          title: '✅ 늦었지만 필요한 재정립',
          text: '일관성 없는 대응은 불편하지만, 잘못된 약속을 계속 이행하는 것보다 낫습니다. 이 시점에서라도 명확한 경계를 설정하고 기록을 남기는 것이 중요합니다.',
          changes: [
            { label: '학급 안정도', val: 10, pos: true },
            { label: '기록 증거',   val: 20, pos: true },
          ],
        },
        nextStage: 'ch3_main',
      },
      {
        text: '어쩔 수 없이 매일 사진을 보내기 시작한다. 이미 약속했으니 어긴다는 생각이 두렵다.',
        effects: { mental: -30, admin: -10, stability: -20, evidence: 0 },
        reply: '(매일 점심 전 급식 식판 사진을 찍어 전송하기 시작한다. 다른 업무가 뒤로 밀린다.)',
        reactions: [
          { sender: '민우 어머니',    role: 'parent',    msg: '잘 하시네요. 그런데 오늘 식판에서 나물이랑 생선이 너무 붙어있던데, 내일은 분리해서 놔주세요.' },
          { sender: '박선생 (동료)', role: 'colleague', msg: '선생님… 매일 사진 보내고 있는 거 맞죠? 이러다 선생님 무너져요.' },
        ],
        commentary: {
          title: '🚨 소진의 시작 · 개인화된 서비스 함정',
          text: '학부모의 요구가 점점 세분화되는 것은 전형적인 패턴입니다. "한 번 해줬으니 계속해야 한다"는 압박감은 교사를 수렁으로 몰아넣습니다. 이 상태가 지속되면 민우 외 28명의 학생들에게 집중하는 것이 물리적으로 불가능해집니다.',
          changes: [
            { label: '감정 소모도', val: -30, pos: false },
            { label: '학급 안정도', val: -20, pos: false },
          ],
        },
        nextStage: 'ch3_main',
      },
    ],
  },

  ch3_main: {
    chapterBadge: 'CHAPTER 3',
    stageBadge: '밤 10시 · 퇴근 후의 습격',
    title: '연필깎이 하나, 그리고 밤을 무너뜨리는 문자들',
    desc: '밤 10시. 겨우 저녁을 먹고 내일 수업을 준비하고 있습니다. 핸드폰이 울립니다. 연필깎이 분실. 그런데 메시지는 그게 전부가 아닙니다. 같은 반 다른 학부모도 학급 분위기가 이상하다며 연락을 해왔습니다.',
    caller: '민우 어머니 외',
    callerStatus: '야간 문자 다수',
    messages: [
      { sender: '민우 어머니',    role: 'parent',    time: '22:10', msg: '선생님, 민우 가방에 연필깎이가 없어요. 누가 훔쳐간 것 같은데 CCTV 돌려보시고 내일 아침까지 찾아주세요.' },
      { sender: '학부모 B',       role: 'parent',    time: '22:25', msg: '선생님, 저는 이준 어머니인데요. 요즘 아이가 학교가 불안하다고 해서요. 학급 분위기가 좀 이상한 것 같던데 어떻게 된 건가요?' },
      { sender: '박선생 (동료)', role: 'colleague', time: '22:35', msg: '선생님, 야간 연락은 다음날 처리하는 거 맞아요. 교사에게도 쉴 권리가 있어요. 내일 차분히 대응하세요.' },
    ],
    choices: [
      {
        text: '야간 연락은 공적 업무 시간 외임을 정중히 고지하고, 내일 아침에 확인하겠다는 짧은 답변을 남기고 더 이상 응답하지 않는다.',
        effects: { mental: -10, admin: 5, stability: 5, evidence: 15 },
        reply: '안녕하세요, 늦은 시간 연락 주셨군요. 야간에는 공적 업무 처리가 어렵습니다. 내일 아침 출근 후 연필깎이 분실 건은 교실에서 먼저 확인하겠습니다. 학급 상담 요청은 상담 시간을 통해 연락드리겠습니다.',
        reactions: [
          { sender: '민우 어머니',    role: 'parent',    msg: '새벽이라도 좋으니 찾으면 바로 연락 주세요. 우리 민우가 잠을 못 자고 있어요.' },
          { sender: '박선생 (동료)', role: 'colleague', msg: '잘 하셨어요 선생님. 경계 설정이 결국 자신을 지킵니다.' },
        ],
        commentary: {
          title: '✅ 핵심 원칙 · 야간 연락 경계 설정',
          text: '교사의 업무 시간은 근로기준법상 보호받습니다. 야간·휴일의 민원 연락에 즉각 응답하는 것은 "항시 연락 가능한 교사"라는 잘못된 관행을 강화시킵니다. 짧은 "내일 처리" 안내는 예의 있는 동시에 경계를 명확히 하는 방법입니다.',
          changes: [
            { label: '기록 증거',   val: 15, pos: true },
            { label: '감정 소모도 절약', val: 10, pos: true },
          ],
        },
        nextStage: 'ch3_pressure_a',
      },
      {
        text: '"아이가 잠을 못 잔다"는 말에 마음이 약해져, 밤중에 동료 교사에게 연락하고 교실 수습에 나선다.',
        effects: { mental: -35, admin: -5, stability: -15, evidence: 0 },
        reply: '(박선생에게 전화) 선생님, 죄송해요. 민우 연필깎이가 없어졌다는데 혹시 교실에 남아있는 거 확인해 주실 수 있어요? 아이가 잠을 못 잔대서요...',
        reactions: [
          { sender: '박선생 (동료)', role: 'colleague', msg: '선생님, 저도 이제 잔다고요... 알겠어요, 잠깐 확인해볼게요. 그런데 이건 내일 해도 되는 일이에요.' },
          { sender: '민우 어머니',   role: 'parent',    msg: '결과 나오면 바로 연락 주세요. 못 찾으면 민호 어머니한테 직접 연락할 거예요.' },
        ],
        commentary: {
          title: '⚠️ 감정적 소진의 가속화',
          text: '"아이가 잠을 못 잔다"는 말은 교사의 감정을 자극하는 전형적인 표현입니다. 심야에 동료 교사를 깨우고 교실 수색을 부탁하는 것은 교사 간 관계도 해칩니다. 연필깎이 분실은 다음날 아침에 해결될 수 있는 문제입니다.',
          changes: [
            { label: '감정 소모도', val: -35, pos: false },
            { label: '학급 안정도', val: -15, pos: false },
          ],
        },
        nextStage: 'ch3_pressure_b',
      },
    ],
  },

  ch3_pressure_a: {
    chapterBadge: 'CHAPTER 3 · 압박 라운드',
    stageBadge: '다음날 아침 교장실 소환',
    title: '교권보호위원회, 선택의 갈림길',
    desc: '다음날 아침, 교감이 또 부릅니다. 학부모가 교장에게 직접 전화해 "교사가 야간에 답장도 안 하고 불성실하다"는 민원을 넣었습니다. 하지만 당신에게는 지금까지 모든 기록이 있습니다.',
    caller: '교감 선생님',
    callerStatus: '긴급 면담',
    messages: [
      { sender: '교감 선생님',    role: 'viceprincipal', time: '08:10', msg: '선생님, 어머니가 야간 연락 무시했다고 교장 선생님한테 전화했어요. 공식 민원이 됐어요. 어떻게 하실 건가요?' },
      { sender: '박선생 (동료)', role: 'colleague',      time: '08:15', msg: '선생님, 이게 오히려 기회예요. 기록이 다 있으니까 교권보호위원회 소집 요청하세요. 도망가면 질 수밖에 없어요.' },
    ],
    choices: [
      {
        text: '지금까지 정리한 모든 기록을 교감에게 제출하고, 이 사안을 교권보호위원회에 공식 회부해 줄 것을 서면으로 요청한다.',
        effects: { mental: -10, admin: 25, stability: 10, evidence: 20 },
        reply: '교감 선생님, 저는 오늘부터 이 사안을 교권보호위원회에 정식으로 회부해 주실 것을 요청드립니다. 지금까지의 모든 연락 기록과 요구 내용, 맘카페 게시물 캡처를 첨부합니다. 야간 비응답은 교사의 정당한 권리입니다.',
        reactions: [
          { sender: '교감 선생님', role: 'viceprincipal', msg: '...알겠습니다. 자료를 보니 학교 측에서도 입장을 정해야 할 것 같네요. 교권보호위 소집 검토해보겠습니다.' },
        ],
        commentary: {
          title: '✅ 결정적 전환점 · 교권보호위원회 요청',
          text: '2023년 교원지위법 개정으로 교권 침해 사안에 대해 학교장은 반드시 교권보호위원회를 소집해야 합니다. 교사 본인도 소집을 요청할 수 있습니다. 이 절차를 통해 학부모의 행동이 공식 기록되고 향후 민사·형사 대응의 기반이 됩니다.',
          changes: [
            { label: '행정 지원도', val: 25, pos: true },
            { label: '기록 증거',   val: 20, pos: true },
          ],
        },
        nextStage: 'ch4_final',
      },
      {
        text: '교감의 압박에 굴복하여 "제가 잘못 대응한 것 같습니다"라며 학부모에게 사과 문자를 보낸다.',
        effects: { mental: -25, admin: -15, stability: -5, evidence: -10 },
        reply: '어머니, 어제 늦은 시간 연락에 즉시 답하지 못해 정말 죄송합니다. 앞으로는 저도 더 빠르게 응대하겠습니다.',
        reactions: [
          { sender: '민우 어머니',    role: 'parent',    msg: '그러세요. 그리고 오늘 연필깎이 어떻게 됐는지 오전 중에 알려주세요. 못 찾으면 배상해야 할 수도 있어요.' },
          { sender: '박선생 (동료)', role: 'colleague', msg: '...선생님. (말을 잇지 못한다)' },
        ],
        commentary: {
          title: '🚨 최악의 신호 · 사과가 또 다른 요구를 낳다',
          text: '이 시점에서의 사과는 교사가 야간에도 응해야 한다는 것을 인정하는 행위로 받아들여집니다. 이후 응대하지 않을 때마다 "지난번엔 했잖아요"라는 압박이 가중됩니다. 사과는 진짜 잘못이 있을 때만 해야 합니다.',
          changes: [
            { label: '행정 지원도', val: -15, pos: false },
            { label: '기록 증거',   val: -10, pos: false },
          ],
        },
        nextStage: 'ch4_final',
      },
    ],
  },

  ch3_pressure_b: {
    chapterBadge: 'CHAPTER 3 · 압박 라운드',
    stageBadge: '새벽 2시의 역민원',
    title: '새벽 두 시, 연필깎이는 찾았다. 하지만 잃은 것이 더 많다.',
    desc: '새벽 2시에 연필깎이는 민우 책상 서랍에서 발견됐습니다. 어머니에게 연락했지만 답장이 없습니다. 다음날 아침, 교감이 부릅니다. 어머니가 "교사가 새벽에 전화질해서 잠을 못 잤다"고 역민원을 넣었습니다.',
    caller: '교감 선생님',
    callerStatus: '황당한 역민원',
    messages: [
      { sender: '교감 선생님',    role: 'viceprincipal', time: '08:05', msg: '선생님, 어머니가 새벽에 연락해서 불편했다고 역민원 넣으셨어요. 선생님이 왜 새벽에 학부모한테 연락하셨어요?' },
      { sender: '박선생 (동료)', role: 'colleague',      time: '08:20', msg: '선생님... 지금이라도 기록 정리 시작하세요. 이런 상황에서 아무 기록도 없으면 선생님이 불리해요.' },
    ],
    choices: [
      {
        text: '당혹스럽지만 지금부터라도 어제 있었던 모든 일을 시간순으로 정리하여 교감에게 제출하고, 교권보호위원회 소집을 요청한다.',
        effects: { mental: -15, admin: 10, stability: 0, evidence: 20 },
        reply: '교감 선생님, 어제 밤의 상황을 시간순으로 정리해왔습니다. 제가 연락한 것은 학부모의 야간 긴급 요청에 응한 것이었습니다. 이 상황은 역설적으로 교권 침해의 증거입니다. 교권보호위원회 소집을 요청합니다.',
        reactions: [
          { sender: '교감 선생님', role: 'viceprincipal', msg: '...일단 자료 검토해볼게요. 이 상황이 좀 복잡하게 됐네요.' },
        ],
        commentary: {
          title: '🔄 만회의 기회 · 역설적 기록 활용',
          text: '학부모가 역민원을 넣은 것은 오히려 "학부모가 야간에 긴급 연락을 요구했다"는 사실을 공식화하는 계기가 됩니다. 지금이라도 시간순 기록을 제출하면 이 사안이 교권 침해 사례로 전환될 수 있습니다.',
          changes: [
            { label: '행정 지원도', val: 10, pos: true },
            { label: '기록 증거',   val: 20, pos: true },
          ],
        },
        nextStage: 'ch4_final',
      },
      {
        text: '너무 지쳐서 그냥 "앞으로 조심하겠습니다"라고 교감에게 말하고 넘어간다.',
        effects: { mental: -40, admin: -15, stability: -20, evidence: 0 },
        reply: '교감 선생님, 제가 판단 미스였습니다. 앞으로는 야간에 연락하지 않겠습니다.',
        reactions: [
          { sender: '교감 선생님', role: 'viceprincipal', msg: '그래요, 앞으로는 조심해요. 학부모 민원은 초기에 잘 관리해야 해요.' },
          { sender: '민우 어머니',  role: 'parent',        msg: '오늘 연필깎이는 결국 어디서 나왔나요? 찾으셨으면 연락을 주셨어야죠.' },
        ],
        commentary: {
          title: '🚨 완전 소진 직전 · 이중 구속의 함정',
          text: '이 선택은 "야간에 학부모 요구에 응한 것"도, "요구에 응하지 않은 것"도 모두 교사의 잘못이 된 상황을 수용한 것입니다. 이런 이중 구속(double bind) 상황에서 자신을 보호하는 방법은 오직 공식 기록과 제도적 절차뿐입니다.',
          changes: [
            { label: '감정 소모도', val: -40, pos: false },
            { label: '행정 지원도', val: -15, pos: false },
          ],
        },
        nextStage: 'ch4_final',
      },
    ],
  },

  ch4_final: {
    chapterBadge: 'CHAPTER 4 · 최후의 선택',
    stageBadge: '교권의 마지막 갈림길',
    title: '이 상황을 어떻게 마무리할 것인가',
    desc: '일주일이 지났습니다. 학부모의 민원은 계속됐고, 교장도 당신에게 "적당히 마무리"를 종용합니다. 동료 박 선생이 손을 잡고 말합니다. "선생님, 선택할 수 있어요. 포기하거나, 싸우거나."',
    caller: '박선생 (동료)',
    callerStatus: '마지막 조언',
    messages: [
      { sender: '박선생 (동료)', role: 'colleague',      time: '금 16:30', msg: '선생님, 교원단체에서 법률 지원 해줄 수 있대요. 증거만 있으면 충분히 싸울 수 있어요. 포기하지 마세요.' },
      { sender: '민우 어머니',   role: 'parent',          time: '금 16:45', msg: '선생님, 우리 민우 2학기에 담임 바꿔달라고 학교에 요청했어요. 선생님이랑은 신뢰가 안 쌓이는 것 같아서요.' },
      { sender: '교감 선생님',    role: 'viceprincipal', time: '금 17:00', msg: '선생님, 학부모가 그러시는데 어떻게 할 생각이에요?' },
    ],
    choices: [
      {
        text: '교원단체 법률 지원을 받아 교권보호위원회를 정식 소집하고, 지금까지의 모든 기록을 증거로 제출해 이 사안을 제도적으로 해결한다.',
        effects: { mental: -5, admin: 20, stability: 15, evidence: 25 },
        reply: '저는 이 사안을 교권보호위원회에 공식 회부하겠습니다. 교원단체의 법률 지원을 받아 진행하겠습니다. 저는 지금까지 교사로서 원칙과 학생들을 위한 최선을 다했습니다.',
        reactions: [
          { sender: '박선생 (동료)', role: 'colleague',      msg: '잘 하셨어요 선생님. 같이 싸워봐요. 우리가 무너지면 다음 선생님도 같은 일 겪어요.' },
          { sender: '교감 선생님',    role: 'viceprincipal', msg: '...알겠습니다. 교권보호위원회 소집 공문 올리겠습니다.' },
        ],
        commentary: {
          title: '✅ 교권 보호의 완성 · 제도적 싸움',
          text: '개인이 아닌 제도로 싸우는 것이 교권 보호의 핵심입니다. 교원단체(교총, 전교조 등)는 법률 무료 지원을 제공합니다. 2023년 이후 교권보호 사례에서 기록이 충분한 교사의 승소율은 크게 높아졌습니다.',
          changes: [
            { label: '행정 지원도', val: 20, pos: true },
            { label: '기록 증거',   val: 25, pos: true },
          ],
        },
        nextStage: null,
      },
      {
        text: '너무 지쳐서 더 싸울 힘이 없다. 조용히 2학기 담임 교체를 수락하고 모든 것을 덮기로 한다.',
        effects: { mental: -20, admin: -10, stability: -15, evidence: 0 },
        reply: '(아무 말도 하지 않고 고개를 끄덕인다. 담임 교체를 수락한다.)',
        reactions: [
          { sender: '교감 선생님',    role: 'viceprincipal', msg: '이해해요 선생님. 이 학교에서 계속 열심히 해봐요.' },
          { sender: '박선생 (동료)', role: 'colleague',      msg: '선생님... 이러면 다음 담임도 같은 일 겪어요. 다시 한 번만 생각해봐요.' },
        ],
        commentary: {
          title: '⚠️ 포기의 대가 · 악순환은 계속된다',
          text: '담임 교체를 수락함으로써 "충분히 민원을 넣으면 담임을 바꿀 수 있다"는 전례가 생깁니다. 개인의 소진은 충분히 이해되지만, 이것이 교권 침해의 구조적 악순환을 심화시킵니다.',
          changes: [
            { label: '감정 소모도', val: -20, pos: false },
            { label: '행정 지원도', val: -10, pos: false },
          ],
        },
        nextStage: null,
      },
    ],
  },
};

// ── 결과 유형
const RESULT_TYPES = [
  {
    id: 'iron',
    title: '강철 교탁',
    subtitle: '원칙과 기록으로 끝까지 서 있는 교사',
    emoji: '🏆',
    color: '#22c55e',
    cond: (s) => s.mental >= 60 && s.evidence >= 50 && s.admin >= 45,
    desc: '당신은 수없이 흔들렸지만 무너지지 않았습니다. 원칙을 지키고 기록을 남기며 결국 제도를 활용해 자신을 보호했습니다. 이런 교사가 많아질수록 교실은 조금씩 더 안전해집니다.',
    advice: '당신의 경험은 후배 교사들에게 소중한 자산입니다. 교원 단체 활동이나 교권 보호 캠페인에 참여해보세요.',
    comment: '높은 기록 증거와 행정 지원도가 당신을 끝까지 지탱했습니다.',
  },
  {
    id: 'wounded',
    title: '상처받은 전문가',
    subtitle: '버텨냈지만 내상이 깊다',
    emoji: '🥈',
    color: '#f59e0b',
    cond: (s) => s.mental >= 40 && (s.evidence >= 30 || s.admin >= 35),
    desc: '당신은 살아남았습니다. 그 과정에서 마음에 적지 않은 상처가 생겼지만, 무너지지는 않았습니다. 이제 당신에게 필요한 것은 회복입니다.',
    advice: '교원 심리 지원은 교육부 Wee 센터에서 무료로 제공됩니다. 심리 상담 프로그램을 이용해보세요.',
    comment: '중간 수준의 증거와 행정 지원이 있었지만, 감정 소모가 컸습니다.',
  },
  {
    id: 'witness',
    title: '고독한 증인',
    subtitle: '기록했지만 아무도 보호해주지 않았다',
    emoji: '📄',
    color: '#6366f1',
    cond: (s) => s.mental < 40 && s.evidence >= 50,
    desc: '당신은 모든 것을 기록했습니다. 그러나 제도와 조직이 당신을 지켜주지 않았습니다. 기록이 있어도 싸울 힘이 소진됐다면, 그것은 당신의 실패가 아니라 시스템의 실패입니다.',
    advice: '교원단체의 집단 법률 지원을 통해 이 기록들을 사회적 증언으로 활용하는 방법을 찾아보세요.',
    comment: '기록 증거는 높지만 감정 소모가 극심하고 조직 지원이 부족했습니다.',
  },
  {
    id: 'scapegoat',
    title: '시스템의 희생양',
    subtitle: '혼자 싸우다 버려진 교사',
    emoji: '⚖️',
    color: '#ef4444',
    cond: (s) => s.admin < 25 && s.mental < 50,
    desc: '당신은 혼자였습니다. 교감도, 학교도 당신을 지켜주지 않았습니다. 개인의 역량보다 조직의 무관심이 당신을 이 자리까지 몰았습니다.',
    advice: '이것은 당신의 잘못이 아닙니다. 교원단체에 현재 상황을 알리고 조직적 지원을 요청하세요.',
    comment: '행정 지원도가 매우 낮고 감정 소모도 높습니다. 구조적 문제입니다.',
  },
  {
    id: 'burnout',
    title: '완전 소진',
    subtitle: '모든 것이 꺼져버린 교실',
    emoji: '💀',
    color: '#6b7280',
    cond: () => true,
    desc: '당신은 완전히 소진됐습니다. 기록도, 지원도, 힘도 남아있지 않습니다. 이 결과가 부끄러운 것이 아닙니다. 이것은 보호받지 못한 사람이 도달하는 종착지입니다.',
    advice: '지금 당장 학교를 쉬어야 합니다. 병가 또는 휴직 제도를 활용하고 전문 심리 상담을 받으세요. 회복이 먼저입니다.',
    comment: '모든 수치가 임계점을 넘었습니다.',
  },
];

const getResultType = (s) => RESULT_TYPES.find((r) => r.cond(s));

const STAT_META = [
  { key: 'mental',    label: '감정 소모도', icon: '💚' },
  { key: 'admin',     label: '행정 지원도', icon: '🏛️' },
  { key: 'stability', label: '학급 안정도', icon: '📚' },
  { key: 'evidence',  label: '기록 증거',   icon: '📄' },
];

const statColor = (v) => (v > 60 ? '#22c55e' : v > 30 ? '#f97316' : '#ef4444');

export default function EducationInteractive() {
  const navigate = useNavigate();

  const [screen, setScreen]           = useState('intro');
  const [stats, setStats]             = useState({ ...INITIAL_STATS });
  const [currentStageId, setStageId]  = useState('ch1_main');
  const [chatMessages, setChat]       = useState([]);
  const [gamePhase, setPhase]         = useState('choosing');
  const [lastChoice, setLastChoice]   = useState(null);
  const [phoneShake, setPhoneShake]   = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [statsFlash, setStatsFlash]   = useState({});

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (screen !== 'game') return;
    const stage = STAGES[currentStageId];
    setChat(stage.messages.map((m, i) => ({ ...m, id: `init_${i}` })));
    setPhase('choosing');
    setLastChoice(null);
  }, [screen, currentStageId]);

  const handleChoice = useCallback((choice) => {
    if (gamePhase !== 'choosing') return;
    setPhase('reacting');
    setLastChoice(choice);

    setChat((prev) => [...prev, {
      sender: '나 (교사)', role: 'teacher', time: '지금',
      msg: choice.reply, id: `teacher_${Date.now()}`,
    }]);

    const reactionDelay = 900;
    choice.reactions.forEach((r, i) => {
      setTimeout(() => {
        setChat((prev) => [...prev, { ...r, id: `reaction_${Date.now()}_${i}` }]);
      }, reactionDelay + i * 750);
    });

    const totalDelay = reactionDelay + choice.reactions.length * 750 + 400;
    setTimeout(() => {
      const newStats = {};
      const flash = {};
      STAT_META.forEach(({ key }) => {
        const delta = choice.effects[key] || 0;
        newStats[key] = Math.max(0, Math.min(100, stats[key] + delta));
        if (delta !== 0) flash[key] = delta > 0 ? 'up' : 'down';
      });

      const mentalDrop = stats.mental - newStats.mental;
      if (mentalDrop >= 20) {
        vibrateDevice([200, 80, 200, 80, 300]);
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 650);
      } else if (mentalDrop > 0) {
        vibrateDevice([80, 40, 80]);
      }

      setPhoneShake(true);
      setTimeout(() => setPhoneShake(false), 500);

      setStats(newStats);
      setStatsFlash(flash);
      setTimeout(() => setStatsFlash({}), 1200);
      setPhase('commentary');
    }, totalDelay);
  }, [gamePhase, stats]);

  const handleNext = () => {
    if (!lastChoice) return;
    if (lastChoice.nextStage === null) {
      setScreen('result');
    } else {
      setStageId(lastChoice.nextStage);
    }
  };

  const handleRestart = () => {
    setStats({ ...INITIAL_STATS });
    setStageId('ch1_main');
    setScreen('intro');
  };

  const stage = STAGES[currentStageId] || STAGES.ch1_main;

  if (screen === 'intro') {
    return (
      <div className="edu-page edu-intro">
        <button className="edu-back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <div className="edu-intro-badge">INTERACTIVE REPORTAGE</div>
        <h1 className="edu-intro-title">
          시들지 않는 꽃을 위하여
          <span className="edu-intro-subtitle">어느 초등학교 교사의 무덤</span>
        </h1>
        <p className="edu-intro-desc">
          매일 아침 8시 30분, 교문이 열리고 아이들이 등교합니다.<br />
          사랑과 책임감으로 꽃피워야 할 교실.<br />
          하지만 교탁 위에 놓인 핸드폰이 진동하기 시작하면서<br />
          교사의 하루는 전장이 됩니다.
        </p>
        <div className="edu-intro-features">
          <span>⚡ 분기형 스토리</span>
          <span>📊 4가지 상태 지표</span>
          <span>🏆 5종 결과 유형</span>
        </div>
        <button className="edu-start-btn" onClick={() => setScreen('game')}>
          <FaChalkboardTeacher className="edu-btn-icon" />
          초임 교사로 출근하기
        </button>
        <p className="edu-intro-disclaimer">
          ※ 실제 교사들의 진술과 언론 보도된 실화를 각색한 체험형 인터랙티브 기획입니다.
        </p>
      </div>
    );
  }

  if (screen === 'result') {
    const result = getResultType(stats);
    return (
      <div className="edu-page edu-result">
        <button className="edu-back-btn" onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <div className="edu-result-type-tag" style={{ color: result.color }}>
          FINAL REPORT · {result.id.toUpperCase()}
        </div>
        <div className="edu-result-emoji">{result.emoji}</div>
        <h2 className="edu-result-title" style={{ color: result.color }}>{result.title}</h2>
        <p className="edu-result-subtitle">{result.subtitle}</p>

        <div className="edu-report-card">
          <div className="edu-report-card-header">📋 최종 교권 리포트</div>
          {STAT_META.map(({ key, label, icon }) => (
            <div key={key} className="edu-report-row">
              <span className="edu-report-label">{icon} {label}</span>
              <div className="edu-gauge-track edu-report-track">
                <div className="edu-gauge-fill" style={{ width: `${stats[key]}%`, background: statColor(stats[key]) }} />
              </div>
              <span className="edu-report-val" style={{ color: statColor(stats[key]) }}>{stats[key]}</span>
            </div>
          ))}
          <p className="edu-report-comment">{result.comment}</p>
        </div>

        <p className="edu-result-desc">{result.desc}</p>

        <div className="edu-advice-box">
          <h4 className="edu-advice-title">💡 지금 할 수 있는 것</h4>
          <p className="edu-advice-text">{result.advice}</p>
        </div>

        <div className="edu-stat-grid">
          <div className="edu-stat-card">
            <div className="edu-stat-tag">교사 실태 조사</div>
            <div className="edu-stat-num">95.8%</div>
            <p className="edu-stat-desc">교사 95.8%가 "학부모 민원으로 인한 정신적 고통에 시달리고 있다"고 응답했습니다.</p>
          </div>
          <div className="edu-stat-card">
            <div className="edu-stat-tag">이직·사직 고민</div>
            <div className="edu-stat-num">87%</div>
            <p className="edu-stat-desc">악성 민원 증가로 교직을 떠나거나 이직을 고민한 경험이 있는 교사의 비율입니다.</p>
          </div>
          <div className="edu-stat-card">
            <div className="edu-stat-tag">심리 치료 경험</div>
            <div className="edu-stat-num">1/4</div>
            <p className="edu-stat-desc">대한민국 교사 4명 중 1명은 무리한 민원 등으로 인해 심리 치료를 받은 적이 있습니다.</p>
          </div>
        </div>

        <div className="edu-appeal-box">
          <h3 className="edu-appeal-title">"교육의 무덤을 막는 것은 우리 모두의 관심입니다"</h3>
          <p className="edu-appeal-desc">
            선생님이 존중받지 못하는 공간에서 아이들 역시 건강하게 자라날 수 없습니다.<br />
            악성 민원에 대한 즉각적인 분리 조치, 법적 분쟁 지원 체계, 무엇보다 교사를 정당한 교육의 주체로 대하는 사회적 약속이 필요합니다.
          </p>
          <div className="edu-result-btns">
            <button className="edu-btn-secondary" onClick={handleRestart}>다른 선택으로 다시 시작하기</button>
            <button className="edu-btn-share" onClick={() => {
              if (navigator.share) {
                navigator.share({ title: '진상도감 교사 체험기', url: window.location.href });
              } else {
                navigator.clipboard && navigator.clipboard.writeText(window.location.href);
                alert('링크가 복사되었습니다. 교권 보호를 위한 가치를 공유해 주세요.');
              }
            }}>
              <FaShareAlt /> 이 이야기 공유하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`edu-page edu-game${screenShake ? ' edu-screen-shake' : ''}`}>
      <div className="edu-game-header">
        <button className="edu-back-btn-sm" onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <div className="edu-stats-row">
          {STAT_META.map(({ key, label, icon }) => (
            <div key={key} className={`edu-stat-mini${statsFlash[key] ? ` edu-stat-flash-${statsFlash[key]}` : ''}`}>
              <span className="edu-stat-mini-icon">{icon}</span>
              <div className="edu-gauge-track edu-mini-track">
                <div
                  className={`edu-gauge-fill${key === 'mental' && stats.mental <= 30 ? ' edu-gauge-pulse' : ''}`}
                  style={{ width: `${stats[key]}%`, background: statColor(stats[key]) }}
                />
              </div>
              <span className="edu-stat-mini-val" style={{ color: statColor(stats[key]) }}>{stats[key]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="edu-chapter-badge">{stage.chapterBadge}</div>
      <div className="edu-stage-badge">{stage.stageBadge}</div>

      <div className="edu-scenario-card">
        <h2 className="edu-scenario-title">{stage.title}</h2>
        <p className="edu-scenario-desc">{stage.desc}</p>
        <div className={`edu-phone${phoneShake ? ' edu-phone-shake' : ''}`}>
          <div className="edu-phone-notch" />
          <div className="edu-phone-screen">
            <div className="edu-phone-incoming">
              <FaPhoneVolume className="edu-phone-icon-pulse" /> 수신 중...
            </div>
            <div className="edu-phone-caller">{stage.caller}</div>
            <div className="edu-phone-status">{stage.callerStatus}</div>
            <div className="edu-phone-btns">
              <div className="edu-phone-btn-red"><FaPhoneSlash /></div>
              <div className="edu-phone-btn-green edu-btn-bounce"><FaPhone /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="edu-chat-thread">
        {chatMessages.map((msg) => {
          const isRight = msg.role === 'teacher';
          return (
            <div key={msg.id} className={`edu-chat-row ${isRight ? 'edu-chat-right' : 'edu-chat-left'}`}>
              <div className="edu-chat-meta">
                {!isRight && <span className={`edu-chat-sender edu-role-${msg.role}`}>{msg.sender}</span>}
                <span className="edu-chat-time">{msg.time}</span>
                {isRight && <span className="edu-chat-sender edu-role-teacher">나 (교사)</span>}
              </div>
              <div className={`edu-chat-bubble edu-bubble-${msg.role}`}>{msg.msg}</div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="edu-options">
        {gamePhase === 'choosing' && stage.choices.map((opt, i) => (
          <button key={i} className="edu-option-btn" onClick={() => handleChoice(opt)}>
            <span className="edu-option-num">선택 {i + 1}</span>
            {opt.text}
          </button>
        ))}
        {gamePhase === 'reacting' && (
          <div className="edu-reacting-msg">
            <span className="edu-reacting-dot" />
            <span className="edu-reacting-dot" />
            <span className="edu-reacting-dot" />
            상대방이 반응하고 있습니다...
          </div>
        )}
        {gamePhase === 'commentary' && lastChoice && (
          <div className="edu-commentary">
            <div className="edu-commentary-header">{lastChoice.commentary.title}</div>
            <p className="edu-commentary-text">{lastChoice.commentary.text}</p>
            <div className="edu-commentary-changes">
              {lastChoice.commentary.changes.map((c, i) => (
                <span key={i} className={`edu-change-chip ${c.pos ? 'edu-change-pos' : 'edu-change-neg'}`}>
                  {c.label} {c.val > 0 ? `+${c.val}` : c.val}
                </span>
              ))}
            </div>
            <button className="edu-next-btn" onClick={handleNext}>
              {lastChoice.nextStage === null
                ? <><FaSkull /> 결과 확인하기</>
                : <>다음 고비 마주하기 <FaArrowRight /></>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
