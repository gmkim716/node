const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");

dotenv.config();
const indexRouter = require("./routes");

const app = express();
app.set("port", process.env.PORT || 4000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,  // express 객체
  watch: true,  // 템플릿 파일이 변경될 때 템플릿 엔진을 다시 렌더링
});

app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,  // 요청이 왔을 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정
  saveUninitialized: false,  // 세션에 저장할 내역이 없더라도 세션을 저장할지 설정
  secret: process.env.COOKIE_SECRET,  // cookie-parser의 비밀키와 같게 설정
  cookie: {
    httpOnly: true,  // 클라이언트에서 쿠키를 확인하지 못하도록 설정
    secure: false,  // https가 아닌 환경에서도 사용할 수 있게 함
  },
}));

app.use("/", indexRouter);

app.use((req, res, next) => {  // 404
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);  // 에러를 넘김
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});