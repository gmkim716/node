const express = require('express'); 
const path = require('path'); 
const morgan = require('morgan'); // 로그를 남기는 모듈
const nunjucks = require('nunjucks'); // 템플릿 엔진

const { sequelize } = require('./models'); // db 연결
const indexRouter = require('./routes'); 
const usersRouter = require('./routes/users'); 
const commentsRouter = require('./routes/comments'); 

const app = express(); 
app.set('port', process.env.PORT || 3001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true, // 파일이 변경될 때 템플릿 엔진을 다시 렌더링
})
sequelize.sync({ force: false }) // 테이블이 존재하지 않으면 생성
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev')); // 로그를 남김
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공, __dirname은 현재 폴더
app.use(express.json()); // json 데이터 처리
app.use(express.urlencoded({ extended: false })); // form 데이터 처리, true면 qs, false면 querystring

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

app.use((req, res, next) => { // 미들웨어
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`); // 에러 메시지
  error.status = 404; // 에러 상태
  next(error); // 다음 미들웨어로 넘김
});

app.use((err, req, res, next) => { // 에러 처리 미들웨어
  res.locals.message = err.message; // 에러 메시지
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 개발 모드일 때만 에러 스택 추적
  res.status(err.status || 500); // 에러 상태
  res.render('error'); // 에러 페이지 렌더링
});

app.listen(app.get('port'), () => { // 서버 실행
  console.log(app.get('port'), '번 포트에서 대기 중');
});