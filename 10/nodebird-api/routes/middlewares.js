const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');  // 요청 횟수 제한

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);  // jwt.verify(토큰, 비밀키): 토큰을 디코딩
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {  // 유효 기간 초과
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }
    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

exports.apiLimiter = RateLimit({  // 책에서 new RateLimit()으로 되어 있지만, 에러가 발생하여 수정함, 버전 차이
  windowMs: 60 * 1000,  // 1분
  max: 10,  // 1분에 10번
  delayMs: 0,  // 호출 간격
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,  // 기본값 429
      message: "1분에 한 번만 요청할 수 있습니다.",
    });
  },
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: "새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.",
  });
}
