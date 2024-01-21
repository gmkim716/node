const express = require('express'); // express 모듈을 가져옴
const path = require('path'); // path 모듈을 가져옴

const app = express();
app.set('port', process.env.PORT || 3000); // 포트 설정

// 미들웨어 설정
// next 함수를 호출하지 않으면 다음 미들웨어가 실행되지 않음
app.use((req, res, next) => {
  console.log('모든 요청에 다 실행됩니다.');
  next();
});
app.get('/', (req, res, next) => {  
  console.log('GET / 요청에서만 실행됩니다.');
  next(); 
}, (req, res) => {
  throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
});

// 에러 처리 미들웨어
// 에러 처리 미들웨어는 매개변수가 반드시 4개여야 함
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), `번 포트에서 대기 중`);
});

