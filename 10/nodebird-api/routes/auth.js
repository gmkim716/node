const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.post("/join", isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } }); // 이미 가입된 이메일인지 확인
    if (exUser) {
      return res.redirect("/join?error=exist"); // 이미 가입된 이메일이면 에러 메시지를 전달
    }
    const hash = await bcrypt.hash(password, 12); // 비밀번호를 암호화
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/"); // 회원가입 후 메인 페이지로 이동
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    // 미들웨어 확장 패턴
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`); // 로그인 실패 시 메인 페이지로 이동
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/"); // 로그인 성공 시 메인 페이지로 이동
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다.
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout(); // req.user 객체 제거
  req.session.destroy(); // req.session 객체의 내용 제거
  res.redirect("/"); // 메인 페이지로 이동
});

router.get("/kakao", passport.authenticate("kakao")); // 카카오 로그인 라우터

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    // 카카오 로그인 콜백 라우터
    failureRedirect: "/", // 로그인 실패 시 메인 페이지로 이동
  }),
  (req, res) => {
    res.redirect("/"); // 로그인 성공 시 메인 페이지로 이동
  }
);

module.exports = router;
