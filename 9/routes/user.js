const express = require("express");

const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const User = require("../models/user");

const router = express.Router();

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  // POST /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); // 팔로우할 사용자를 데이터베이스에서 조회
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10)); // addFollowing 메서드로 현재 로그인한 사용자와의 관계를 지정
      res.send("success");
    } else {
      res.status(404).send("no user");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
