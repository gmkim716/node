const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router(); 

router.post('/token', apiLimiter, async (req, res) => {  // POST /v2/token 라우터
  const { clientSecret } = req.body;  // 클라이언트 비밀키
  try {
    const domain = await Domain.findOne({  // 도메인에서 클라이언트 비밀키가 일치하는 것을 찾음
      where: { clientSecret },  // 도메인 비밀키
      include: {
        model: User,  
        attribute: ['nick', 'id'],  
      },
    });
    if (!domain) {  // 등록되지 않은 도메인이면
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({  // jwt.sign(토큰의 내용, 토큰의 비밀키, 토큰의 설정)
      id: domain.User.id,
      nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '1m',  // 유효 기간, 1분
      issuer: 'gmkim716',  // 발급자
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
}});

router.get('/test', verifyToken, apiLimiter, (req, res) => {  // GET /v2/test 라우터
  res.json(req.decoded); 
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {  // GET /v2/posts/my 라우터
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {  // GET /v2/posts/hashtag/:title 라우터
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다.',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
}); 

module.exports = router;  // 라우터 내보내기
