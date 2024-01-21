const express = require('express'); // express 모듈을 가져온다.
const cookieParser = require('cookie-parser'); // 쿠키를 사용하기 위한 미들웨어
const morgan = require('morgan'); // 로그 
const path = require('path');
const session = require('express-session'); 
const nunjucks = require('nunjucks'); // 템플릿 엔진
const dotenv = require('dotenv'); // 환경 변수
const passport = require('passport'); // 패스포트

dotenv.config(); // .env 파일을 읽어서 process.env로 만든다.
const pageRouter = require('./routes/page');
const { sequelize } = require('./models'); // 시퀄라이즈 연결
const passportConfig = require('./passport'); // 패스포트 설정

const app = express(); // express 객체 생성
passport(); // 패스포트 설정
app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html'); // 템플릿 엔진 설정
nunjucks.configure('views', { // 템플릿 파일들이 위치한 폴더 설정
  express: app,
  watch: true,
});
sequelize.sync({ force: false }) // 테이블이 존재하지 않으면 생성한다.
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev')); // 로그
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공
app.use(express.json()); // body-parser
app.use(express.urlencoded({ extended: false })); // body-parser
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키
app.use(session({ // 세션
  resave: false, // 요청이 올 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지 설정
  saveUninitialized: false, // 세션에 저장할 내역이 없더라도 세션을 저장할지 설정
  secret: process.env.COOKIE_SECRET, 
  cookie: {
    httpOnly: true, // 자바스크립트로 쿠키에 접근하지 못하게 한다.
    secure: false, // https를 쓸 때 true
  },
}));

app.use('/', pageRouter);

// 404 처리 미들웨어
app.use((req, res, next) => { 
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); // 에러를 넘겨준다.
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => { 
  res.locals.message = err.message; // 템플릿 엔진 변수
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 템플릿 엔진 변수
  res.status(err.status || 500); // 상태 코드
  res.render('error'); // 에러 페이지
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});