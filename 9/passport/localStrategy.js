const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
      },
      async (email, password, done) => {
        // done(에러, 성공, 실패)
        try {
          const exUser = await User.findOne({ where: { email } }); // 이메일이 존재하는지 확인
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password); // 비밀번호가 일치하는지 확인
            if (result) {
              done(null, exUser); // 성공
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다." }); // 실패
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원입니다." }); // 실패
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
