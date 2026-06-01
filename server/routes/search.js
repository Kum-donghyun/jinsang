const router = require('express').Router();
const pool = require('../db/connection');

// 검색
router.get('/', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) return res.status(400).json({ message: '검색어를 입력해주세요.' });

    const offset = (page - 1) * limit;
    const keyword = `%${q}%`;

    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             CASE WHEN p.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM posts p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      WHERE p.title LIKE ? OR p.content LIKE ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [keyword, keyword, parseInt(limit), parseInt(offset)]);

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM posts WHERE title LIKE ? OR content LIKE ?',
      [keyword, keyword]
    );

    res.json({ posts: rows, total: countResult[0].total, keyword: q });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
