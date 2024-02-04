const express = require("express"); // express: 웹 프레임워크
const path = require("path"); // path: 파일 경로를 다루는 모듈
const morgan = require("morgan"); // morgan: 로그를 남기는 모듈
const cookieParser = require("cookie-parser"); // cookie-parser: 쿠키를 다루는 모듈
const session = require("express-session"); // express-session: 세션을 다루는 모듈
const nunjucks = require("nunjucks"); // nunjucks: 템플릿 엔진
const dotenv = require("dotenv"); // dotenv: 환경 변수를 파일에 저장하고 불러오는 모듈

dotenv.config(); // .env 파일을 읽어서 process.env에 추가
const webSocket = require("./socket"); // socket.js 파일을 불러옴
const indexRouter = require("./routes"); // routes/index.js 파일을 불러옴

const app = express(); // express 객체 생성
app.set("port", process.env.PORT || 8005); // 서버 포트 설정
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(morgan("dev")); // 로그를 남기는 미들웨어
app.use(express.static(path.join(__dirname, "public"))); // 정적 파일 제공 미들웨어
app.use(express.json()); // 요청 본문을 파싱하는 미들웨어
app.use(express.urlencoded({ extended: false })); // 요청 본문을 파싱하는 미들웨어
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키를 다루는 미들웨어
// 세션을 다루는 미들웨어
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// 라우터 미들웨어
app.use("/", indexRouter);

// 404 에러 처리 미들웨어
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// 서버 실행
const server = app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

// 웹소켓 서버 실행
webSocket(server);
