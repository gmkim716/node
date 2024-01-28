const express = require("express");
const User = require("../schemas/user");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}); // 모든 사용자 찾기
    res.render("mongoose", { users }); // mongoose.html 렌더링
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
