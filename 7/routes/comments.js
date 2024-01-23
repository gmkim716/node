const express = require('express');
const { User, Comment } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => { // POST /comments
  try {
    const comment = await Comment.create({ // 댓글 생성
      commenter: req.body.id,
      comment: req.body.comment,
    });
    console.log(comment);
    res.status(201).json(comment); // 응답
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.route('/:id')
  .patch(async (req, res, next) => { // PATCH /comments/:id
    try {
      const result = await Comment.update({ // 댓글 수정
        comment: req.body.comment,
      }, {
        where: { id: req.params.id }, // id가 일치하는 댓글을 찾음
      });
      console.log(result);
      res.json(result); // 응답
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(async (req, res, next) => { // DELETE /comments/:id
    try {
      const result = await Comment.destroy({ where: { id: req.params.id } }); // id가 일치하는 댓글을 찾아서 삭제
      res.json(result); 
    } catch (err) {
      console.error(err);
      next(err); 
    }
  });

module.exports = router;