const passport = require("passport");
const local = require("./localStrategy"); // 로컬 로그인 전략
const kakao = require("./kakaoStrategy"); // 카카오 로그인 전략
const User = require("../models/user");

module.exports = () => {
  // 로그인 시 실행 / 사용자 정보 객체를 세션에 아이디로 저장
  passport.serializeUser((user, done) => {
    // req.session(세션) 객체에 어떤 데이터를 저장할지 선택
    done(null, user.id); // 첫 번째 인수는 에러 발생 시 사용, 두 번째 인수는 저장하고 싶은 데이터 / 모든 유저 정보를 저장하면 용량이 커지므로 id만 저장한다.
  });

  // 매 요청 시 실행 / 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴, 세션에 불필요한 데이터를 담지 않기 위해 사용
  passport.deserializeUser((id, done) => {
    // serializeUser의 done에서 사용한 두 번째 인수가 deserializeUser의 첫번째 매개변수가 된다.
    User.findOne({ where: { id } }) // id로 사용자를 찾는다.
      .then((user) => done(null, user)) // req.user에 저장한다.
      .catch((err) => done(err));
  });

  local();
  kakao();
};
