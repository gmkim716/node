const express = require("express");  // express: 웹 서버를 만드는 프레임워크
const path = require("path");  // path: 경로를 쉽게 조작하도록 도와주는 Node.js 내장 모듈
const cookieParser = require("cookie-parser");  // cookie-parser: 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만듦
const passport = require("passport");  // passport: 로그인 구현을 위한 모듈
const morgan = require("morgan");  // morgan: 요청과 응답에 대한 정보를 콘솔에 기록
const session = require("express-session");  // express-session: 세션 관리용 미들웨어
const nunjucks = require("nunjucks");  // nunjucks: 템플릿 엔진
const dotenv = require("dotenv");  // dotenv: .env 파일을 읽어서 process.env로 만듦

dotenv.config();  // .env 파일을 읽어서 process.env로 만듦
const v2 = require('./routes/v2');  // v2: v2 라우터
const v1 = require('./routes/v1');  // v1: v1 라우터
const authRouter = require("./routes/auth");  // authRouter: 로그인, 로그아웃 라우터
const indexRouter = require("./routes");  // indexRouter: 메인 페이지 라우터
const { sequelize } = require("./models");  // sequelize: 시퀄라이즈 연결 객체
const passportConfig = require("./passport");  // passportConfig: 패스포트 설정

// express 객체 생성
const app = express();  // express 객체 생성
passportConfig();  // 패스포트 설정
app.set("port", process.env.PORT || 8002);  // 서버가 실행될 포트 설정
app.set("view engine", "html");  // 템플릿 엔진을 html로 설정
nunjucks.configure("views", {  // views 폴더의 경로를 지정
  express: app,
  watch: true,
});
sequelize .sync({ force: false })  // force: true/false: 서버 실행 시마다 테이블 재생성 여부
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

// 미들웨어
app.use(morgan("dev"));  // dev 모드로 로그를 남김
app.use(express.static(path.join(__dirname, "public")));  // public 폴더를 정적 폴더로 지정
app.use(express.json());  // 요청의 본문을 해석해 req.body 객체로 만듦
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));  // 쿠키를 해석해 req.cookies 객체로 만듦
app.use(session({  // 세션 관리용 미들웨어
  resave: false,  // 요청이 왔을 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정
  saveUninitialized: false,  // 세션에 저장할 내역이 없더라도 세션을 저장할지 설정
  secret: process.env.COOKIE_SECRET,  // cookie-parser의 비밀키와 같게 설정
  cookie: {
    httpOnly: true,  // 클라이언트에서 쿠키를 확인하지 못하도록 설정
    secure: false,  // https가 아닌 환경에서도 사용할 수 있게 함
  },
}));
app.use(passport.initialize());  // 요청에 passport 설정을 심음
app.use(passport.session());  // req.session 객체에 passport 정보를 저장

// 라우터
app.use('/v2', v2); 
app.use('/v1', v1); 
app.use('/auth', authRouter);  // auth 라우터를 /auth 경로로 설정
app.use('/', indexRouter);  // index 라우터를 / 경로로 설정

// 에러 처리 미들웨어
app.use((req, res, next) => {  // 404
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);  // 에러를 넘김
});

app.use((err, req, res, next) => {  // 500
  res.locals.message = err.message;  // res.locals: 템플릿 엔진에서 사용할 수 있는 변수를 저장하는 객체
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};  // 개발 환경일 때만 에러를 표시
  res.status(err.status || 500);
  res.render("error");
});

// 서버 실행
app.listen(app.get("port"), () => {  // 서버 실행
  console.log(app.get("port"), "번 포트에서 대기 중");
}); 