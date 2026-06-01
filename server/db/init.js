const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  // 1) DB 없이 연결하여 DB 생성
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

  console.log('MySQL 연결 성공!');

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`데이터베이스 '${process.env.DB_NAME}' 생성 완료!`);

  await conn.query(`USE \`${process.env.DB_NAME}\``);

  // 2) 사용자 테이블
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      nickname VARCHAR(50) NOT NULL,
      profile_image VARCHAR(500) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('users 테이블 생성 완료');

  // 3) 카테고리 테이블
  await conn.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      slug VARCHAR(50) NOT NULL UNIQUE,
      sort_order INT DEFAULT 0
    )
  `);
  console.log('categories 테이블 생성 완료');

  // 4) 기본 카테고리 삽입
  const categories = [
    ['서비스', 'cs', 1],
    ['직장', 'work', 2],
    ['운전', 'drive', 3],
    ['판매직', 'sales', 4],
    ['교직', 'education', 5],
    ['인간관계', 'relationship', 6],
    ['자유', 'free', 7],
    ['비밀', 'secret', 8],
    ['장터', 'market', 9],
    ['정보', 'info', 10],
    ['홍보', 'promotion', 11]
  ];

  for (const [name, slug, order] of categories) {
    await conn.query(
      `INSERT IGNORE INTO categories (name, slug, sort_order) VALUES (?, ?, ?)`,
      [name, slug, order]
    );
  }
  console.log('기본 카테고리 삽입 완료');

  // 5) 게시글 테이블
  await conn.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      category_id INT NOT NULL,
      title VARCHAR(200) NOT NULL,
      content TEXT NOT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      is_anonymous TINYINT(1) DEFAULT 0,
      view_count INT DEFAULT 0,
      like_count INT DEFAULT 0,
      comment_count INT DEFAULT 0,
      is_popular TINYINT(1) DEFAULT 0,
      is_weekly_best TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);
  console.log('posts 테이블 생성 완료');

  // 6) 댓글 테이블
  await conn.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      is_anonymous TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('comments 테이블 생성 완료');

  // 7) 좋아요 테이블
  await conn.query(`
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_like (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('likes 테이블 생성 완료');

  // 8) 투표 테이블 (게시글에 대한 투표)
  await conn.query(`
    CREATE TABLE IF NOT EXISTS votes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      vote_option VARCHAR(10) NOT NULL COMMENT 'A 또는 B',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_vote (post_id, user_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  console.log('votes 테이블 생성 완료');

  // 9) 투표 옵션 테이블
  await conn.query(`
    CREATE TABLE IF NOT EXISTS vote_options (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      option_label VARCHAR(10) NOT NULL,
      option_text VARCHAR(200) NOT NULL,
      vote_count INT DEFAULT 0,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `);
  console.log('vote_options 테이블 생성 완료');

  // 10) 테스트 유저 삽입
  const bcrypt = require('bcryptjs');
  const hashedPw = await bcrypt.hash('test1234', 10);
  await conn.query(
    `INSERT IGNORE INTO users (username, password, nickname) VALUES (?, ?, ?)`,
    ['testuser', hashedPw, '테스트유저']
  );
  await conn.query(
    `INSERT IGNORE INTO users (username, password, nickname) VALUES (?, ?, ?)`,
    ['admin', await bcrypt.hash('admin1234', 10), '관리자']
  );
  console.log('테스트 유저 생성 완료');

  // 11) 샘플 게시글 삽입
  const samplePosts = [
    [1, 1, '카페에서 음료 쏟고 환불 요구하는 손님', '카페에서 일하는데 손님이 직접 음료를 쏟아놓고 새 음료를 달라고 합니다. 거절하니까 화를 내시는데... 이거 제가 잘못한 건가요?', 0],
    [1, 2, '회의 중에 계속 딴짓하는 팀장님', '회의를 본인이 소집해놓고 계속 핸드폰만 보고 있습니다. 그런데 회의 내용 모르면 저한테 화를 내요.', 0],
    [1, 3, '끼어들기 후 오히려 욕하는 운전자', '정체 구간에서 새치기를 하더니 제가 경적을 울리니까 차에서 내려서 욕을 합니다.', 0],
    [2, 1, '반말하는 손님에게 존댓말 강요해도 되나요?', '편의점 알바 중인데 반말하시는 손님이 너무 많아요. 존댓말로 대화해달라고 요청해도 될까요?', 0],
    [2, 6, '친구가 매번 약속에 30분씩 늦습니다', '매번 30분 이상 늦는 친구 때문에 스트레스받아요. 말하면 "그게 뭐 어때서"라고 하는데...', 0],
    [1, 4, '환불 기간 지나고 환불 요구하는 고객', '환불 기간이 일주일인데 한 달 후에 와서 환불해달라고 합니다. 규정상 안 된다고 했더니 소비자원에 신고하겠다고 하네요.', 0],
    [2, 5, '학부모가 성적 올려달라고 전화합니다', '중학교 교사입니다. 학부모님이 매주 전화해서 아이 성적을 올려달라고 요구하시는데 어떻게 대처해야 할까요?', 0],
    [1, 6, '룸메이트가 제 물건을 허락없이 씁니다', '기숙사 룸메이트가 제 샴푸, 세제 등을 맨날 허락없이 쓰고 채워놓지도 않습니다.', 0]
  ];

  for (const [userId, catId, title, content, anon] of samplePosts) {
    await conn.query(
      `INSERT IGNORE INTO posts (user_id, category_id, title, content, is_anonymous, view_count, like_count) VALUES (?, ?, ?, ?, ?, FLOOR(RAND()*500), FLOOR(RAND()*100))`,
      [userId, catId, title, content, anon]
    );
  }
  console.log('샘플 게시글 삽입 완료');

  // 투표 옵션 삽입
  const [posts] = await conn.query('SELECT id FROM posts');
  for (const post of posts) {
    const [existing] = await conn.query('SELECT id FROM vote_options WHERE post_id = ?', [post.id]);
    if (existing.length === 0) {
      await conn.query(
        'INSERT INTO vote_options (post_id, option_label, option_text, vote_count) VALUES (?, ?, ?, ?)',
        [post.id, 'A', '글쓴이 잘못', Math.floor(Math.random() * 50)]
      );
      await conn.query(
        'INSERT INTO vote_options (post_id, option_label, option_text, vote_count) VALUES (?, ?, ?, ?)',
        [post.id, 'B', '상대방 잘못', Math.floor(Math.random() * 50)]
      );
    }
  }
  console.log('투표 옵션 삽입 완료');

  // 인기글 설정
  await conn.query(`UPDATE posts SET is_popular = 1 WHERE like_count >= 50`);
  const [bestPost] = await conn.query('SELECT id FROM posts ORDER BY like_count DESC LIMIT 1');
  if (bestPost.length > 0) {
    await conn.query('UPDATE posts SET is_weekly_best = 1 WHERE id = ?', [bestPost[0].id]);
  }
  console.log('인기글 설정 완료');

  await conn.end();
  console.log('\n========================================');
  console.log('  진상도감 데이터베이스 초기화 완료!');
  console.log('========================================\n');
}

initDatabase().catch(err => {
  console.error('DB 초기화 오류:', err);
  process.exit(1);
});
