const express = require('express');
const { v4: uuidv4 } = require('uuid');  // uuid: UUID 생성
const { User, Domain } = require('../models');  // User, Domain 모델 가져옴
const { isLoggedIn } = require('./middlewares');  // isLoggedIn 미들웨어 가져옴

const router = express.Router();  // 라우터 생성

router.get('/', async (req, res, next) => {  // GET / 라우터
  try {
    const user = await User.findOne({
      where: { id: req.user && req.user.id || null },  // 로그인한 사용자가 있다면 사용자 아이디를, 없다면 null을 넣음
      include: { model: Domain },  // 사용자와 연결된 도메인을 가져옴
    });
    res.render('login', { user, domains: user && user.domains }); 
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/domain', isLoggedIn, async (req, res, next) => {  // POST /domain 라우터
  try {
    await Domain.create({  // Domain 모델로 도메인 생성
      UserId: req.user.id,  // 사용자 아이디
      host: req.body.host,  // 도메인
      type: req.body.type,  // 도메인 종류
      clientSecret: uuidv4(),  // 클라이언트 비밀키
    });
    res.redirect('/');  // 리다이렉트
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;