const express = require("express");
const path = require("path");
const morgan = require("morgan"); // 로그를 남기는 미들웨어
const nunjucks = require("nunjucks"); // 템플릿 엔진

// 라우터 연결
const indexRouter = require("./routes");
const usersRouter = require("./routes/users");
const commentRouter = require("./routes/comments");

const app = express();
app.set("port", process.env.PORT || 3002);
app.set("view engine", "html"); // 템플릿 엔진을 html로 설정
nunjucks.configure("views", {
  // 템플릿 파일들이 위치한 폴더를 views로 설정
  express: app,
  watch: true,
});

// 몽고디비 연결, 책에 적혀있는 내용은 몽구스 버전이 달라서 에러가 발생한다.
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://gmkim716:m4WERLDQgeSutuEl@nodejs.m01qbgc.mongodb.net/?retryWrites=true&w=majority",
    {
      dbName: "nodejs",
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// 미들웨어
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // form 데이터 처리

// 라우터 연결
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/comments", commentRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error); // 에러 처리 미들웨어로 이동
});

app.use((err, req, res, next) => {
  // 에러 처리 미들웨어
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {}; // 개발 환경일 때만 에러 스택 추적
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
