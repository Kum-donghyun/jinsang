const router = require('express').Router();
const pool = require('../db/connection');
const auth = require('../middleware/auth');

// 투표하기
router.post('/', auth, async (req, res) => {
  try {
    const { post_id, vote_option } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM votes WHERE post_id = ? AND user_id = ?',
      [post_id, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: '이미 투표하셨습니다.' });
    }

    await pool.query(
      'INSERT INTO votes (post_id, user_id, vote_option) VALUES (?, ?, ?)',
      [post_id, req.user.id, vote_option]
    );

    await pool.query(
      'UPDATE vote_options SET vote_count = vote_count + 1 WHERE post_id = ? AND option_label = ?',
      [post_id, vote_option]
    );

    // 업데이트된 투표 결과 반환
    const [options] = await pool.query(
      'SELECT * FROM vote_options WHERE post_id = ?',
      [post_id]
    );

    res.json({ message: '투표 완료!', vote_options: options });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 투표 상태 확인
router.get('/status/:postId', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT vote_option FROM votes WHERE post_id = ? AND user_id = ?',
      [req.params.postId, req.user.id]
    );
    const [options] = await pool.query(
      'SELECT * FROM vote_options WHERE post_id = ?',
      [req.params.postId]
    );
    res.json({
      voted: rows.length > 0,
      myVote: rows.length > 0 ? rows[0].vote_option : null,
      vote_options: options
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
