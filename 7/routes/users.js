const express = require('express');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();

router.route('/')
  .get(async (req, res, next) => { // GET /users
    try {
      const users = await User.findAll(); // 모든 사용자를 찾음
      res.json(users); // 응답
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(async (req, res, next) => { // POST /users
    try {
      const result = await User.create({ // 사용자를 생성
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      console.log(result);
      res.status(201).json(result); // 응답
    } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:id/comments', async (req, res, next) => { // GET /users/:id/comments
  try {
    const comments = await Comment.findAll({ // 모든 댓글을 찾음
      include: {
        model: User, // 사용자 정보를 JOIN
        where: { id: req.params.id }, // 사용자 id가 일치하는 댓글을 찾음
      },
    });
    console.log(comments);
    res.json(comments); // 응답
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
