const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User, HashTag } = require("../models");

const router = express.Router();

router.use((req, res, next) => {
  // 모든 라우터에 공통으로 적용되는 미들웨어
  res.locals.user = req.user; // res.locals 객체에 user 속성을 추가한다.
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user
    ? req.user.Followings.map((f) => f.id)
    : [];
  next();
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        // 작성자 정보를 가져오기 위해 include 속성 사용
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]], // 게시글을 역순으로 정렬
    });
    res.render("main", {
      title: "NodeBird",
      twits: posts,
    });
  } catch {
    console.error(error);
    next(error);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    // 해시태그가 없는 경우
    return res.redirect("/");
  }
  try {
    const hashtag = await HashTag.findOne({ where: { title: query } }); // 해시태그가 존재하는지 검색
    let posts = [];
    if (hashtag) {
      // 해시태그가 존재하면
      posts = await hashtag.getPosts({ include: [{ model: User }] }); // 시퀄라이즈에서 제공하는 getPosts 메서드로 모든 게시글을 가져온다.
    }

    return res.render("main", {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
