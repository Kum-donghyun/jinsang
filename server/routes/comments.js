const router = require('express').Router();
const pool = require('../db/connection');
const auth = require('../middleware/auth');

// 댓글 목록
router.get('/post/:postId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cm.*, u.nickname, u.profile_image,
             CASE WHEN cm.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM comments cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.post_id = ?
      ORDER BY cm.created_at ASC
    `, [req.params.postId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 댓글 작성
router.post('/', auth, async (req, res) => {
  try {
    const { post_id, content, is_anonymous } = req.body;
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content, is_anonymous) VALUES (?, ?, ?, ?)',
      [post_id, req.user.id, content, is_anonymous ? 1 : 0]
    );
    await pool.query('UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?', [post_id]);

    res.status(201).json({ id: result.insertId, message: '댓글이 작성되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 댓글 삭제
router.delete('/:id', auth, async (req, res) => {
  try {
    const [comment] = await pool.query('SELECT * FROM comments WHERE id = ?', [req.params.id]);
    if (comment.length === 0) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
    if (comment[0].user_id !== req.user.id) return res.status(403).json({ message: '권한이 없습니다.' });

    await pool.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
    await pool.query('UPDATE posts SET comment_count = comment_count - 1 WHERE id = ?', [comment[0].post_id]);
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
