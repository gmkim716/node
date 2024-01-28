const express = require("express");
const multer = require("multer"); // 파일 업로드를 위한 미들웨어
const path = require("path");
const fs = require("fs"); // 파일 시스템을 조작하는 노드 내장 모듈

const { Post, HashTag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.readdirSync("uploads"); // uploads 폴더가 있는지 확인
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // uploads 폴더가 없으면 생성
}

const upload = multer({
  // multer 설정
  storage: multer.diskStorage({
    destination(req, file, cb) {
      // cb: 콜백함수, req: 요청, file: 파일 객체
      cb(null, "uploads/"); // 파일이 저장될 폴더
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일 확장자
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일 이름
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한
});

router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  // 이미지 업로드 라우터, single: 하나의 이미지 업로드
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` }); // 업로드된 이미지의 주소를 보낸다.
});

const upload2 = multer(); // multer 설정
router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  // 게시글 업로드 라우터, none: 이미지를 올리지 않을 때
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]+/g); // 해시태그 추출, 정규표현식
    if (hashtags) {
      const result = await Promise.all(
        // 해시태그 생성
        hashtags.map((tag) =>
          HashTag.findOrCreate({
            // findOrCreate: 없으면 생성, 있으면 조회
            where: { title: tag.slice(1).toLowerCase() }, // 해시태그는 #을 제외하고 소문자로 저장, slice(1): #을 제외
          })
        )
      );
      await post.addHashTags(result.map((r) => r[0])); // 게시글과 해시태그 연결
    }
    res.redirect("/"); // 메인 페이지로 이동
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
