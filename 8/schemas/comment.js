const mongoose = require("mongoose");

const { Schema } = mongoose; // 스키마 생성
const { Types: { ObjectId } } = Schema; // ObjectId를 Schema.Types.ObjectId로 사용
const commentSchema = new Schema({
  commenter: {
    type: ObjectId,
    required: true,
    ref: "User", // User 스키마의 ObjectId와 연결
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // 기본값
  },
});

module.exports = mongoose.model("Comment", commentSchema); // 스키마를 모델로 감싸줌
