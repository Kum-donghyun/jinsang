const router = require('express').Router();
const pool = require('../db/connection');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const upload = require('../middleware/upload');

// 프로필 수정
router.put('/profile', auth, upload.single('profile_image'), async (req, res) => {
  try {
    const { nickname } = req.body;
    const profile_image = req.file ? `/uploads/${req.file.filename}` : undefined;

    let query = 'UPDATE users SET';
    const params = [];
    const updates = [];

    if (nickname) { updates.push(' nickname = ?'); params.push(nickname); }
    if (profile_image) { updates.push(' profile_image = ?'); params.push(profile_image); }

    if (updates.length === 0) return res.status(400).json({ message: '변경 사항이 없습니다.' });

    query += updates.join(',') + ' WHERE id = ?';
    params.push(req.user.id);

    await pool.query(query, params);
    res.json({ message: '프로필이 수정되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 비밀번호 변경
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) return res.status(400).json({ message: '현재 비밀번호가 올바르지 않습니다.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 내가 작성한 글
router.get('/my-posts', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name
      FROM posts p JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ? ORDER BY p.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 좋아요한 글
router.get('/liked-posts', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name,
             CASE WHEN p.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM likes l
      JOIN posts p ON l.post_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      WHERE l.user_id = ? ORDER BY l.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 투표한 글
router.get('/voted-posts', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, v.vote_option,
             CASE WHEN p.is_anonymous = 1 THEN '익명' ELSE u.nickname END as display_name
      FROM votes v
      JOIN posts p ON v.post_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.user_id = u.id
      WHERE v.user_id = ? ORDER BY v.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 내가 작성한 댓글
router.get('/my-comments', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cm.*, p.title as post_title, p.id as post_id
      FROM comments cm
      JOIN posts p ON cm.post_id = p.id
      WHERE cm.user_id = ? ORDER BY cm.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 회원 탈퇴
router.delete('/account', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: '탈퇴가 완료되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
