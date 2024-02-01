const express = require('express');
const axios = require('axios');

const router = express.Router();
// const URL = 'http://localhost:8002/v1';
const URL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:4000';  // origin 헤더 추가

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {  // 세션에 토큰이 없으면 토큰 발급 시도
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token;  // 세션에 토큰 저장
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    });  // API 요청
  } catch (error) {
    if (error.response.status === 419) {  // 토큰 만료 시 토큰 재발급 받기
      delete req.session.jwt;
      return request(req, api);
    }  // 419 외의 다른 에러면
    return error.response;
  }
};

router.get('/mypost', async (req, res, next) => {  // 내가 쓴 게시글 가져오기
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/search/:hashtag', async (req, res, next) => {  // 해시태그 검색 결과 가져오기
  try {
    const result = await request(
      req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
    );
    res.json(result.data);
  } catch (error) {
    if (error.code) {
      console.error(error);
      next(error);
    }
  }
});

router.get('/test', async (req, res, next) => {  // 테스트 토큰 라우터
  try {
    if (!req.session.jwt) {  // 세션에 토큰이 없으면 토큰 발급 시도
      const tokenResult = await axios.post('http://localhost:8002/v1/token', {
        clientSecret: process.env.CLIENT_SECRET,  // 비밀 키
      });
      if (tokenResult.data && tokenResult.data.code === 200) {
        req.session.jwt = tokenResult.data.token;  // 세션에 토큰 저장
      } else {  // 토큰 발급 실패
        return res.json(tokenResult.data);  // 발급 실패 사유 응답
      }
    }
    // 발급받은 토큰 테스트
    const result = await axios.get('http://localhost:8002/v1/test', {
      headers: { authorization: req.session.jwt },  // API 요청 헤더에 토큰을 실어 보냄
    });
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    if (error.response.status === 419) {  // 토큰 만료 시
      return res.json(error.response.data);
    }
    return next(error);
  }
});

module.exports = router;