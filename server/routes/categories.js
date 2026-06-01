const router = require('express').Router();
const pool = require('../db/connection');

// 전체 카테고리 목록
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 카테고리별 최신 글 (미리보기)
router.get('/:slug/preview', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.title, p.like_count, p.comment_count, p.created_at,
             CASE WHEN p.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      WHERE c.slug = ?
      ORDER BY p.created_at DESC
      LIMIT 5
    `, [req.params.slug]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
