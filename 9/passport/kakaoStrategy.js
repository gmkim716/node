const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오에서 발급해주는 아이디
        callbackURL: "/auth/kakao/callback", // 카카오로부터 인증 결과를 받을 라우터 주소
      },
      async (accessToken, refreshToken, profile, done) => { 
        console.log("kakao profile", profile);
        try { 
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: "kakao" },
          });
          if (exUser) { // 이미 회원가입되어 있는 경우
            done(null, exUser); // 사용자 정보와 함께 done 함수 호출
          } else {  
            const newUser = await User.create({ // 회원가입
              email: profile._json && profile._json.kakao_account_email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: "kakao",
            });
            done(null, newUser); 
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
