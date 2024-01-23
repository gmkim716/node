const express = require("express");
const User = require("../schemas/user");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}); // 모든 사용자 찾기
    res.json(users);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
