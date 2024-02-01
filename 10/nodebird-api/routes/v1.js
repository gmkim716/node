const express = require("express");
const jwt = require("jsonwebtoken");

const { verifyToken, deprecated } = require("./middlewares");
const { Domain, User, Post, Hashtag } = require("../models");

const router = express.Router();

router.use(deprecated);  // v1 라우터에 대한 모든 요청에 대해 deprecated 미들웨어를 실행, deprecated: 폐기된 

// 토큰을 발급하는 라우터
router.post('/token', async (req, res) => {  // POST /v1/token 라우터
  const { clientSecret } = req.body;  // 클라이언트 비밀키
  try {
    const domain = await Domain.findOne({  // 도메인에서 클라이언트 비밀키가 일치하는 것을 찾음
      where: { clientSecret },
      include: {
        model: User,
        attribute: ["nick", "id"],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: "등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요",
      });
    }
    const token = jwt.sign({  // jwt.sign(토큰의 내용, 토큰의 비밀키, 토큰의 설정)
      id: domain.User.id,
      nick: domain.User.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: "1m",  // 유효 기간, 1분
      issuer: "gmkim716",  // 발급자
    });
    return res.json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      message: "서버 에러",
    });
  }
});

// 토큰을 테스트하는 라우터
router.get('/test', verifyToken, (req, res) => {  // GET /v1/test 라우터
  res.json(req.decoded);
});

// 내가 올린 포스트를 가져오는 라우터
router.get('/posts/my', verifyToken, (req, res) => {  // GET /v1/posts/my 라우터
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
        message: "서버 에러",
      });
    });
  });

// 해시태그로 검색한 결과를 가져오는 라우터
router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {  // GET /v1/posts/hashtag/:title 라우터
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: "검색 결과가 없습니다.",
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
      message: "서버 에러",
    });
  }
});

module.exports = router;