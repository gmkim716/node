const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /users
  try {
    const users = await User.findAll(); // 모든 사용자를 찾음
    res.render('sequelize', { users }); // sequelize.html 렌더링
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;