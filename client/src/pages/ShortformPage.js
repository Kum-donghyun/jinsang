import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageSquare, PlayCircle, Star, ChevronDown } from 'lucide-react';

export default function ShortformPage() {
  const navigate = useNavigate();

  const [view, setView] = useState('category');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sortOrder, setSortOrder] = useState('recommend');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '이럴 땐 어떻게 해야해?',
      author: '영상쟁이',
      isOperator: true,
      views: '1.2만',
      time: '오늘',
      videoType: 'youtube',
      videoId: 'MKfsAVpXu_Q',
      content: '안녕하세요, 운영자입니다! 👋 \n이번 주 가장 핫했던 진상썰을 영상으로 재구성해 보았습니다.\n진짜 이런 상황 오면 멘붕 올 것 같은데, 여러분이라면 어떻게 대처하실 건가요?',
      bestStory: '"손님 한 분이 음식 거의 다 드시고 조용히 나 부르더라.\n확인해보니 진짜 머리카락 있었음. 근데 문제는...\n음식이 거의 다 비어있었다는 거임.\n(중략)\n다 먹어서 바꿔주기도 애매하고, 그냥 계산하고 나가니까 넘어가는게 맞는거 같기도 하고...\n이런 상황일 땐 어떻게 조치해야함?"',
      hashtags: ['#주간베스트', '#상황극', '#머리카락환불', '#애매하네'],
      comments: [
        {
          id: 11, author: 'cctv필수', time: '1시간 전', content: '저거 무조건 CCTV 돌려봐야됨. 거의 다 먹고 저러는 거면 일부러 넣었을 확률 99%임 ㅡㅡ', likes: 124, isLiked: false, isOperator: false,
          replies: [{ id: 111, author: '알바인생', time: '50분 전', content: '맞아요 진짜 저런 진상들 한둘이 아님;;', likes: 32, isLiked: false }]
        },
        { id: 12, author: '원칙주의자', time: '3시간 전', content: '그래도 음식에서 이물질 나온 건 팩트니까, 환불해주는 게 맞다고 봄.', likes: 85, isLiked: false, isOperator: false, replies: [] },
        { id: 13, author: '프로불편러', time: '30분 전', content: '손님 입장에서는 진짜 먹다가 마지막에 발견했을 수도 있잖아요.', likes: 12, isLiked: false, isOperator: false, replies: [] },
        { id: 14, author: '영상쟁이', time: '2시간 전', content: '다 먹었어도 환불 안해주면 나중에 리뷰 테러 당하더라고요. ㅠㅠ 여러분이라면 어떻게 하실 건가요?', likes: 215, isLiked: false, isOperator: true, replies: [] }
      ]
    },
    {
      id: 2,
      title: '개레전드 얼탱이 없는 진상 만남',
      author: '영상쟁이',
      isOperator: true,
      views: '8.5천',
      time: '어제',
      videoType: 'gdrive',
      videoId: '1inojxYYRsOfkorZwjrb5RSSRdUvyP6o-',
      content: '안녕하세요, 운영자입니다! 👋\n오늘은 햄버거 매장에서 일어난 역대급 폭행 진상썰을 가져왔습니다.\n진짜 저런 사람이 아직도 있다니 충격적이네요. 다들 이런 진상 만나본 적 있으신가요?',
      bestStory: '"카운터 보고 있는데 지팡이 들고 있는 할아버지 한 분이 오심.\n버거 세트 만원 넘는데 5천원 올려놓고 그냥 달라고 사자후 갈김 ㄷㄷ\n안된다고 하니까 매니저님 지팡이로 내려치려고 해서 내가 막다가 멍들었음...\n결국 경찰 부르고 고소 진행함. 나보다 더 레전드 진상 있음?"',
      hashtags: ['#레전드진상', '#알바생폭행', '#경찰출동', '#지팡이할배'],
      comments: [
        {
          id: 21, author: '알바노조', time: '2시간 전', content: '와 매니저님 대신 맞았다니 진짜 의인이시네요ㅠㅠ 팔 멍든 거 꼭 병원가서 진단서 끊고 폭행치상으로 고소하세요!!', likes: 452, isLiked: false, isOperator: false,
          replies: [{ id: 211, author: '법대로해', time: '1시간 전', content: '맞아요 절대 합의해주면 안 됩니다. 인실좆 가야함.', likes: 89, isLiked: false }]
        },
        { id: 22, author: '사이다원샷', time: '4시간 전', content: '경찰 부른 거 진짜 잘했습니다. 나이 먹고 부끄러운 줄 알아야지 ㅉㅉ', likes: 388, isLiked: false, isOperator: false, replies: [] },
        { id: 23, author: '편돌이10년차', time: '5시간 전', content: '나도 편의점에서 깎아달라고 떼쓰는 진상들 한트럭 봤는데 지팡이로 때리려는 건 선 넘었네 ㄷㄷ', likes: 215, isLiked: false, isOperator: false, replies: [] },
        { id: 24, author: '영상쟁이', time: '1시간 전', content: '다치신 분 너무 고생 많으셨습니다 ㅠㅠ 여러분들은 알바하다가 폭력적인 손님 만나면 어떻게 대처하시나요?', likes: 180, isLiked: false, isOperator: true, replies: [] },
        { id: 25, author: '안전제일', time: '30분 전', content: '일단 무조건 도망치거나 피해야 합니다. 다치면 나만 손해예요 ㅠㅠ 글쓴이분도 앞으로는 무조건 피하세요!', likes: 95, isLiked: false, isOperator: false, replies: [] },
        { id: 26, author: '국밥부장관', time: '10분 전', content: '요즘 물가에 5천원이면 국밥도 못 먹는데 어딜 세트를 먹으려고;;', likes: 42, isLiked: false, isOperator: false, replies: [] },
        { id: 27, author: '지나가던사람', time: '방금 전', content: '진짜 세상에 별의별 사람 다 있구나...', likes: 5, isLiked: false, isOperator: false, replies: [] }
      ]
    },
    {
      id: 3,
      title: '편의점을 지 집 주소로 쓰는 레전드 진상',
      author: '영상쟁이',
      isOperator: true,
      views: '2.5만',
      time: '1시간 전',
      videoType: 'gdrive',
      videoId: '1HTXDtpb5b66RFA8YmZ668aLBT6OiY6Xi',
      content: '안녕하세요, 운영자입니다! 👋\n오늘의 사연은 편의점 알바생/점주님들이라면 뒷목 잡을 역대급 진상입니다.\n편의점을 본인 집 앞마당처럼 쓰는 사람... 상상이 가시나요?',
      bestStory: '"아예 주소를 우리 편의점으로 지정 한거임.\n한 사람 이름으로 택배가 계속 와. 쿠팡, 마켓컬리, 배민까지...\n심지어 배달 음식 오면 냄비 들고 와서 편의점 전자레인지 돌리고 안 닦고 런함.\n(중략)\n어느 날 용달차가 오더니 편의점으로 침대랑 가구를 배송시킴ㅋㅋ\n빠꾸 치니까 그날 밤 와서 \'왜 내 택배 안 받아줘!!!\' 하고 히드라리스크 괴성 지름.\n나중에 반송비 달라는 거 화내서 쫓아냄. 진짜 레전드 아님?"',
      hashtags: ['#편의점진상', '#택배테러', '#침대배송', '#히드라리스크', '#사이다결말'],
      comments: [
        {
          id: 31, author: '편돌이경력직', time: '40분 전', content: '와 진짜 주작이라고 믿고 싶을 정도로 어질어질하네요;; 편의점 주소로 침대를 시킬 생각을 어떻게 하지?', likes: 842, isLiked: false, isOperator: false,
          replies: [{ id: 311, author: '나도당해봄', time: '15분 전', content: '저도 예전에 타이어 시킨 진상 본 적 있습니다... 세상은 넓고 ㅂㅅ은 많아요', likes: 125, isLiked: false }]
        },
        { id: 32, author: '스타크래프트', time: '1시간 전', content: '사람한테서 히드라리스크 소리가 난대 ㅋㅋㅋㅋㅋ 표현력 미쳤네 ㅋㅋㅋ 캬악!!! 퉤!!!', likes: 523, isLiked: false, isOperator: false, replies: [] },
        { id: 33, author: '법대로하자', time: '20분 전', content: '저거 영업방해죄로 무조건 고소 가능한 사안입니다. 반송비 달라고 할 때 뺨 안 때리신 보살님께 경의를 표합니다.', likes: 312, isLiked: false, isOperator: false, replies: [] },
        { id: 34, author: '전자레인지빌런', time: '50분 전', content: '음식물 튀고 안 닦고 런하는 거 진짜 개빡치는데... 그거 굳으면 닦이지도 않음 ㅡㅡ', likes: 189, isLiked: false, isOperator: false, replies: [] },
        { id: 35, author: '배달기사', time: '30분 전', content: '저희도 저런 주소 걸리면 진짜 난감해요. 알바생 분들이 안 받아주면 저희가 다 책임져야 하거든요 ㅠㅠ', likes: 145, isLiked: false, isOperator: false, replies: [] },
        { id: 36, author: '어이없음', time: '10분 전', content: '반송비를 왜 점주한테 달라고 해 뇌가 없나 진짜 ㅋㅋㅋㅋㅋ 지가 잘못시켜놓고', likes: 76, isLiked: false, isOperator: false, replies: [] },
        { id: 37, author: '영상쟁이', time: '방금 전', content: '점주님의 사이다 대처가 아니었다면 계속 택배가 왔을 텐데 정말 다행입니다 😱 다들 이런 신박한(?) 진상 만나보신 적 있나요?', likes: 215, isLiked: false, isOperator: true, replies: [] }
      ]
    }
  ]);

  const activePost = posts.find(p => p.id === selectedPostId);

  const sortedComments = activePost ? [...activePost.comments].sort((a, b) => {
    if (sortOrder === 'recommend') return b.likes - a.likes;
    return b.id - a.id;
  }) : [];

  const toggleLike = (commentId, isReply = false, replyId = null) => {
    setPosts(posts.map(post => {
      if (post.id !== selectedPostId) return post;
      return {
        ...post,
        comments: post.comments.map(comment => {
          if (!isReply && comment.id === commentId) {
            return { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 };
          } else if (isReply && comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === replyId) {
                  return { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 };
                }
                return reply;
              })
            };
          }
          return comment;
        })
      };
    }));
  };

  const handleCommentSubmit = () => {
    if (newComment.trim() === '') return;
    const newCommentObj = {
      id: Date.now(), author: '익명유저', time: '방금 전', content: newComment,
      likes: 0, isLiked: false, isOperator: false, replies: []
    };
    setPosts(posts.map(post => {
      if (post.id === selectedPostId) return { ...post, comments: [newCommentObj, ...post.comments] };
      return post;
    }));
    setNewComment('');
  };

  const handleReplySubmit = (commentId) => {
    if (newReply.trim() === '') return;
    const newReplyObj = { id: Date.now(), author: '익명유저', time: '방금 전', content: newReply, likes: 0, isLiked: false };
    setPosts(posts.map(post => {
      if (post.id === selectedPostId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) return { ...comment, replies: [...comment.replies, newReplyObj] };
            return comment;
          })
        };
      }
      return post;
    }));
    setNewReply('');
    setActiveReplyId(null);
  };

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setIsPlaying(false);
    setView('post');
  };

  // ── 목록 화면 ───────────────────────────────────────────────────
  if (view === 'category') {
    return (
      <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-xl relative overflow-hidden font-sans">
        <header className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">영상으로 보는 진상 🎬</h1>
        </header>

        <main className="p-4 flex-1 overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4 px-1">
            매주 선정된 역대급 진상 사연을 생생한 영상으로 만나보세요!
          </p>

          <div className="flex flex-col gap-4">
            {posts.map((post, index) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors pr-2 leading-tight">
                    {post.title}
                  </h2>
                  {index === 0 && (
                    <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full whitespace-nowrap">
                      HOT
                    </span>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-2.5 flex gap-3 items-center border border-gray-100">
                  <div className="w-16 h-16 bg-gray-900 rounded-md flex-shrink-0 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <img
                      src={post.videoType === 'youtube'
                        ? `https://img.youtube.com/vi/${post.videoId}/hqdefault.jpg`
                        : `https://drive.google.com/thumbnail?id=${post.videoId}&sz=w300`}
                      alt="Thumbnail"
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    />
                    <PlayCircle className="text-white z-10 drop-shadow-md" size={24} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-gray-500 truncate mb-1">
                      {post.content.split('\n')[1]}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                      <span>조회 {post.views}</span>
                      <span>·</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── 상세 화면 ───────────────────────────────────────────────────
  if (!activePost) return null;

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto shadow-xl relative overflow-hidden font-sans">

      <header className="bg-white p-4 border-b border-gray-200 flex items-center sticky top-0 z-20 shadow-sm">
        <button
          onClick={() => { setView('category'); setIsPlaying(false); }}
          className="mr-3 p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <div className="flex-1 overflow-hidden">
          <h1 className="text-lg font-bold text-gray-900 truncate">{activePost.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mt-0.5">
            <span className="font-medium text-gray-700">{activePost.author}</span>
            {activePost.isOperator && (
              <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">운영자</span>
            )}
            <span className="mx-2 text-gray-300">|</span>
            <span>조회 {activePost.views}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{activePost.time}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">

        {/* 영상 (9:16) */}
        <div className="w-full bg-black aspect-[9/16] relative group flex items-center justify-center overflow-hidden">
          {!isPlaying ? (
            <div
              className="absolute inset-0 w-full h-full cursor-pointer group flex flex-col items-center justify-center bg-gray-900"
              onClick={() => setIsPlaying(true)}
            >
              <img
                src={activePost.videoType === 'youtube'
                  ? `https://img.youtube.com/vi/${activePost.videoId}/hqdefault.jpg`
                  : `https://drive.google.com/thumbnail?id=${activePost.videoId}&sz=w1000`}
                alt="Video Thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
              />
              <div className="z-10 bg-red-600 text-white rounded-full p-4 transform group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                <PlayCircle size={48} fill="currentColor" />
              </div>
              <span className="z-10 mt-4 text-white text-sm font-bold opacity-80">영상을 재생하려면 터치하세요</span>
            </div>
          ) : (
            <>
              {activePost.videoType === 'youtube' ? (
                <>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full bg-black"
                    src={`https://www.youtube.com/embed/${activePost.videoId}?autoplay=1&rel=0`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="YouTube Video Player"
                  />
                  <a
                    href={`https://youtube.com/shorts/${activePost.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30 hover:bg-black/90 transition-colors z-10 flex items-center gap-1 shadow-lg"
                  >
                    <PlayCircle size={14} /> 유튜브에서 직접 보기
                  </a>
                </>
              ) : (
                <iframe
                  className="absolute top-0 left-0 w-full h-full bg-black"
                  src={`https://drive.google.com/file/d/${activePost.videoId}/preview`}
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="Google Drive Video Player"
                />
              )}
            </>
          )}
        </div>

        {/* 본문 */}
        <div className="p-4 border-b-8 border-gray-50">
          <p className="text-gray-800 leading-relaxed mb-4 text-sm sm:text-base whitespace-pre-line">
            {activePost.content}
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4 text-sm text-gray-700 shadow-inner">
            <p className="font-bold text-blue-800 mb-2 flex items-center gap-1">
              <Star size={14} className="fill-blue-500" /> 이번 주 선정된 베스트 사연
            </p>
            <p className="italic leading-relaxed whitespace-pre-line">{activePost.bestStory}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {activePost.hashtags.map((tag, idx) => (
              <span key={idx} className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>

        {/* 댓글 헤더 */}
        <div className="px-4 py-3 bg-white flex justify-between items-center border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center text-sm sm:text-base">
            <MessageSquare size={18} className="mr-2 text-gray-500" />
            댓글 <span className="text-blue-600 ml-1">
              {activePost.comments.length + activePost.comments.reduce((acc, curr) => acc + curr.replies.length, 0)}
            </span>
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium bg-gray-50 px-2 py-1 rounded-md"
            >
              {sortOrder === 'recommend' ? '추천순' : '최신순'}
              <ChevronDown size={14} className="ml-1" />
            </button>
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'recommend' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'}`}
                  onClick={() => { setSortOrder('recommend'); setShowSortOptions(false); }}
                >추천순</button>
                <button
                  className={`w-full text-left px-4 py-2 text-sm ${sortOrder === 'latest' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700'}`}
                  onClick={() => { setSortOrder('latest'); setShowSortOptions(false); }}
                >최신순</button>
              </div>
            )}
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="divide-y divide-gray-100">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="p-4 bg-white hover:bg-gray-50/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className={`font-bold text-sm ${comment.isOperator ? 'text-red-600' : 'text-gray-800'}`}>
                      {comment.author}
                    </span>
                    {comment.isOperator && (
                      <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">운영자</span>
                    )}
                    <span className="text-xs text-gray-400 ml-2">{comment.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed break-words pr-2">{comment.content}</p>
                </div>
                <button
                  onClick={() => toggleLike(comment.id)}
                  className="flex flex-col items-center ml-2 p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  <Star size={18} className={`transition-colors ${comment.isLiked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  <span className={`text-[10px] mt-1 font-bold ${comment.isLiked ? 'text-yellow-600' : 'text-gray-400'}`}>{comment.likes}</span>
                </button>
              </div>

              <div className="mt-2 flex">
                <button
                  onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                  className="text-[11px] font-bold text-gray-500 hover:text-blue-600 transition-colors flex items-center bg-gray-100 px-2 py-1 rounded-md"
                >
                  답글 달기 {comment.replies.length > 0 && <span className="ml-1 text-blue-500">{comment.replies.length}</span>}
                </button>
              </div>

              {activeReplyId === comment.id && (
                <div className="mt-3 ml-4 flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                  <input
                    type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)}
                    placeholder={`${comment.author}님에게 답글 남기기...`}
                    className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none text-gray-800"
                    onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit(comment.id)}
                  />
                  <button onClick={() => handleReplySubmit(comment.id)} disabled={!newReply.trim()} className="p-1.5 text-blue-500 hover:bg-white rounded-md transition-colors disabled:opacity-50">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                </div>
              )}

              {comment.replies.length > 0 && (
                <div className="mt-3 ml-2 pl-3 border-l-[3px] border-gray-100 flex flex-col gap-3">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="flex justify-between items-start bg-gray-50/50 p-2 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center mb-0.5">
                          <span className="font-bold text-sm text-gray-800">{reply.author}</span>
                          <span className="text-xs text-gray-400 ml-2">{reply.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed break-words pr-2">{reply.content}</p>
                      </div>
                      <button onClick={() => toggleLike(comment.id, true, reply.id)} className="flex flex-col items-center ml-2 p-1 rounded hover:bg-gray-100 transition-colors">
                        <Star size={14} className={`transition-colors ${reply.isLiked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        <span className={`text-[10px] mt-0.5 font-bold ${reply.isLiked ? 'text-yellow-600' : 'text-gray-400'}`}>{reply.likes}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {activePost.comments.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">첫 댓글을 남겨보세요!</div>
          )}
        </div>
      </main>

      {/* 하단 댓글 입력 */}
      <footer className="bg-white border-t border-gray-200 p-3 absolute bottom-0 w-full z-20 shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
          <input
            type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 남겨주세요..."
            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-gray-800"
            onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
            className={`p-2 mr-1 rounded-full flex items-center justify-center transition-colors ${newComment.trim() ? 'bg-blue-500 text-white shadow-sm' : 'bg-gray-200 text-gray-400'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
