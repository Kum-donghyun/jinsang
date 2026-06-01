const router = require('express').Router();
const pool = require('../db/connection');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// 게시글 목록 (카테고리, 정렬, 페이지네이션)
router.get('/', async (req, res) => {
  try {
    const { category, sort = 'latest', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1';
    const params = [];

    if (category) {
      where += ' AND c.slug = ?';
      params.push(category);
    }

    let orderBy = 'ORDER BY p.created_at DESC';
    if (sort === 'popular') orderBy = 'ORDER BY p.like_count DESC, p.created_at DESC';
    if (sort === 'views') orderBy = 'ORDER BY p.view_count DESC';
    if (sort === 'verdict') where += ' AND p.is_popular = 1';

    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             u.nickname, u.profile_image,
             CASE WHEN p.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      ${where}
      ${orderBy}
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(`
      SELECT COUNT(*) as total FROM posts p
      JOIN categories c ON p.category_id = c.id
      ${where}
    `, params);

    res.json({
      posts: rows,
      total: countResult[0].total,
      page: parseInt(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 인기글 (주간 베스트)
router.get('/weekly-best', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             u.nickname,
             CASE WHEN p.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      WHERE p.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY p.like_count DESC, p.view_count DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 인기 급상승
router.get('/trending', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             u.nickname,
             CASE WHEN p.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      ORDER BY p.like_count DESC, p.created_at DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 게시글 상세
router.get('/:id', async (req, res) => {
  try {
    // 조회수 증가
    await pool.query('UPDATE posts SET view_count = view_count + 1 WHERE id = ?', [req.params.id]);

    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             u.nickname, u.profile_image,
             CASE WHEN p.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (rows.length === 0) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });

    // 투표 옵션 조회
    const [voteOptions] = await pool.query(
      'SELECT * FROM vote_options WHERE post_id = ?',
      [req.params.id]
    );

    res.json({ ...rows[0], vote_options: voteOptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 게시글 작성
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content, category_id, is_anonymous, vote_option_a, vote_option_b } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO posts (user_id, category_id, title, content, image_url, is_anonymous) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, category_id, title, content, image_url, is_anonymous ? 1 : 0]
    );

    // 투표 옵션 생성
    const optA = vote_option_a || '글쓴이 잘못';
    const optB = vote_option_b || '상대방 잘못';
    await pool.query(
      'INSERT INTO vote_options (post_id, option_label, option_text) VALUES (?, ?, ?), (?, ?, ?)',
      [result.insertId, 'A', optA, result.insertId, 'B', optB]
    );

    res.status(201).json({ id: result.insertId, message: '게시글이 작성되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 게시글 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const [post] = await pool.query('SELECT user_id FROM posts WHERE id = ?', [req.params.id]);
    if (post.length === 0) return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    if (post[0].user_id !== req.user.id) return res.status(403).json({ message: '권한이 없습니다.' });

    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 좋아요 토글
router.post('/:id/like', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const [existing] = await pool.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      await pool.query('UPDATE posts SET like_count = like_count - 1 WHERE id = ?', [postId]);
      res.json({ liked: false });
    } else {
      await pool.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      await pool.query('UPDATE posts SET like_count = like_count + 1 WHERE id = ?', [postId]);
      res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 좋아요 여부 확인
router.get('/:id/like-status', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM likes WHERE post_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ liked: rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
